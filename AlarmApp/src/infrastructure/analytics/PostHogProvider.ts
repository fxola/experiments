import PostHog from 'posthog-react-native';
import { DomainEvent } from '../../domain/shared';

const POSTHOG_API_KEY = process.env.EXPO_PUBLIC_POSTHOG_API_KEY ?? 'phc_dev_key';
const POSTHOG_HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com';

let posthogInstance: PostHog | null = null;

export function getPostHog(): PostHog {
  if (!posthogInstance) {
    posthogInstance = new PostHog(POSTHOG_API_KEY, {
      host: POSTHOG_HOST,
    });
  }
  return posthogInstance;
}

export function captureEvent(
  eventName: string,
  properties?: Record<string, string | number | boolean | null>
): void {
  try {
    getPostHog().capture(eventName, properties);
  } catch (error) {
    console.error('Failed to capture event:', error);
  }
}

export function captureDomainEvent(event: DomainEvent): void {
  const plain = (event as any).toPlainObject?.() ?? {};
  const sanitized: Record<string, string | number | boolean | null> = {};
  
  for (const [key, value] of Object.entries(plain)) {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null) {
      sanitized[key] = value;
    } else {
      sanitized[key] = String(value);
    }
  }
  
  captureEvent(event.eventType, sanitized);
}
