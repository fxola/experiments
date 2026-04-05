import { BaseDomainEvent } from '../../shared';
import { Alarm } from '../entities/Alarm';

export class AlarmDismissed extends BaseDomainEvent {
  readonly alarm: Alarm;
  readonly triggeredAt: Date;
  readonly timeToDismissMs: number;

  constructor(alarm: Alarm, triggeredAt: Date) {
    super('AlarmDismissed', alarm.id);
    this.alarm = alarm;
    this.triggeredAt = triggeredAt;
    this.timeToDismissMs = Date.now() - triggeredAt.getTime();
  }

  toPlainObject(): Record<string, string | number | boolean | null> {
    return {
      ...super.toPlainObject(),
      alarmId: this.alarm.id,
      triggeredAt: this.triggeredAt.toISOString(),
      timeToDismissSeconds: Math.round(this.timeToDismissMs / 1000),
    };
  }
}
