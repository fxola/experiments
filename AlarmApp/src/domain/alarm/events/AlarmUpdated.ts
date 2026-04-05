import { BaseDomainEvent } from '../../shared';
import { Alarm } from '../entities/Alarm';

export class AlarmUpdated extends BaseDomainEvent {
  readonly alarm: Alarm;
  readonly changedFields: string[];

  constructor(before: Alarm, after: Alarm) {
    super('AlarmUpdated', after.id);
    this.alarm = after;
    this.changedFields = AlarmUpdated.getChangedFields(before, after);
  }

  private static getChangedFields(before: Alarm, after: Alarm): string[] {
    const fields: string[] = [];

    if (!before.time.equals(after.time)) fields.push('time');
    if (before.label !== after.label) fields.push('label');
    if (!before.sound.equals(after.sound)) fields.push('sound');
    if (!before.repeatPattern.equals(after.repeatPattern)) fields.push('repeatPattern');
    if (before.isEnabled !== after.isEnabled) fields.push('isEnabled');

    return fields;
  }

  toPlainObject(): Record<string, string | number | boolean | null> {
    return {
      ...super.toPlainObject(),
      alarmId: this.alarm.id,
      changedFields: this.changedFields.join(','),
    };
  }
}
