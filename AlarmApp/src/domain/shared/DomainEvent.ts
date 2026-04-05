export interface DomainEvent {
  readonly eventType: string;
  readonly occurredAt: Date;
  readonly aggregateId: string;
}

export abstract class BaseDomainEvent implements DomainEvent {
  readonly eventType: string;
  readonly occurredAt: Date;
  readonly aggregateId: string;

  constructor(eventType: string, aggregateId: string) {
    this.eventType = eventType;
    this.occurredAt = new Date();
    this.aggregateId = aggregateId;
  }

  toPlainObject(): Record<string, string | number | boolean | null> {
    return {
      eventType: this.eventType,
      occurredAt: this.occurredAt.toISOString(),
      aggregateId: this.aggregateId,
    };
  }
}
