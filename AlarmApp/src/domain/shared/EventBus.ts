import { DomainEvent } from './DomainEvent';

type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => void | Promise<void>;

export class EventBus {
  private handlers: Map<string, Set<EventHandler>> = new Map();

  subscribe<T extends DomainEvent>(
    eventType: string,
    handler: EventHandler<T>
  ): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler as EventHandler);

    return () => {
      this.handlers.get(eventType)?.delete(handler as EventHandler);
    };
  }

  async publish<T extends DomainEvent>(event: T): Promise<void> {
    const handlers = this.handlers.get(event.eventType);
    if (!handlers) return;

    const promises: Promise<void>[] = [];
    handlers.forEach((handler) => {
      const result = handler(event);
      if (result instanceof Promise) {
        promises.push(result);
      }
    });

    await Promise.all(promises);
  }

  clear(): void {
    this.handlers.clear();
  }
}

export const eventBus = new EventBus();
