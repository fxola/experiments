import { BaseDomainEvent } from '../../shared';
import { Alarm } from '../entities/Alarm';

export class AlarmTriggered extends BaseDomainEvent {
  readonly alarm: Alarm;
  readonly wasInForeground: boolean;

  constructor(alarm: Alarm, wasInForeground: boolean = true) {
    super('AlarmTriggered', alarm.id);
    this.alarm = alarm;
    this.wasInForeground = wasInForeground;
  }

  toPlainObject(): Record<string, string | number | boolean | null> {
    return {
      ...super.toPlainObject(),
      alarmId: this.alarm.id,
      wasInForeground: this.wasInForeground ? 'true' : 'false',
    };
  }
}
