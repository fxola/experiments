import { BaseDomainEvent } from '../../shared';
import { Alarm } from '../entities/Alarm';

export class AlarmCreated extends BaseDomainEvent {
  readonly alarm: Alarm;

  constructor(alarm: Alarm) {
    super('AlarmCreated', alarm.id);
    this.alarm = alarm;
  }

  toPlainObject(): Record<string, string | number | boolean | null> {
    return {
      ...super.toPlainObject(),
      alarmId: this.alarm.id,
      time: this.alarm.time.format(),
      isRecurring: this.alarm.repeatPattern.isRecurring() ? 'true' : 'false',
      repeatDaysCount: this.alarm.repeatPattern.days.length,
    };
  }
}
