import { BaseDomainEvent } from '../../shared';
import { Alarm } from '../entities/Alarm';

export class AlarmEnabled extends BaseDomainEvent {
  readonly alarm: Alarm;

  constructor(alarm: Alarm) {
    super('AlarmEnabled', alarm.id);
    this.alarm = alarm;
  }

  toPlainObject(): Record<string, string | number | boolean | null> {
    return {
      ...super.toPlainObject(),
      alarmId: this.alarm.id,
    };
  }
}

export class AlarmDisabled extends BaseDomainEvent {
  readonly alarm: Alarm;

  constructor(alarm: Alarm) {
    super('AlarmDisabled', alarm.id);
    this.alarm = alarm;
  }

  toPlainObject(): Record<string, string | number | boolean | null> {
    return {
      ...super.toPlainObject(),
      alarmId: this.alarm.id,
    };
  }
}
