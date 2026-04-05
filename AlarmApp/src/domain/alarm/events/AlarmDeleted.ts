import { BaseDomainEvent } from '../../shared';
import { Alarm } from '../entities/Alarm';

export class AlarmDeleted extends BaseDomainEvent {
  readonly alarm: Alarm;

  constructor(alarm: Alarm) {
    super('AlarmDeleted', alarm.id);
    this.alarm = alarm;
  }

  toPlainObject(): Record<string, string | number | boolean | null> {
    return {
      ...super.toPlainObject(),
      alarmId: this.alarm.id,
    };
  }
}
