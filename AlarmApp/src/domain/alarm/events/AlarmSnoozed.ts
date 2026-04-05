import { BaseDomainEvent } from '../../shared';
import { Alarm } from '../entities/Alarm';

export class AlarmSnoozed extends BaseDomainEvent {
  readonly alarm: Alarm;
  readonly snoozeDurationMinutes: number;

  constructor(alarm: Alarm, snoozeDurationMinutes: number) {
    super('AlarmSnoozed', alarm.id);
    this.alarm = alarm;
    this.snoozeDurationMinutes = snoozeDurationMinutes;
  }

  toPlainObject(): Record<string, string | number | boolean | null> {
    return {
      ...super.toPlainObject(),
      alarmId: this.alarm.id,
      snoozeDurationMinutes: this.snoozeDurationMinutes,
    };
  }
}
