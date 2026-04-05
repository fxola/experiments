import { posthogAlarmTracker } from '../../infrastructure/analytics/PostHogAlarmTracker';
import { useEffect } from 'react';

export function useAnalyticsTracker() {
  useEffect(() => {
    posthogAlarmTracker.start();
    return () => {
      posthogAlarmTracker.stop();
    };
  }, []);
}
