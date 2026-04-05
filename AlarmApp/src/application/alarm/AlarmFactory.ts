import { v4 as uuidv4 } from 'uuid';
import { Alarm, CreateAlarmParams } from '../../domain/alarm';
import { Time } from '../../domain/alarm/value-objects/Time';
import { RepeatPattern } from '../../domain/alarm/value-objects/RepeatPattern';
import { SoundSelection } from '../../domain/alarm/value-objects/SoundSelection';

export interface AlarmFormData {
  hour: number;
  minute: number;
  label: string;
  soundId: string;
  repeatDays: number[];
  isEnabled: boolean;
}

export class AlarmFactory {
  static createFromFormData(data: AlarmFormData): CreateAlarmParams {
    return {
      time: new Time(data.hour, data.minute),
      label: data.label,
      sound: SoundSelection.create(data.soundId),
      repeatPattern: RepeatPattern.fromDays(data.repeatDays),
      isEnabled: data.isEnabled,
    };
  }

  static getDefaultFormData(): AlarmFormData {
    const now = new Date();
    return {
      hour: now.getHours(),
      minute: (now.getMinutes() + 5) % 60,
      label: '',
      soundId: 'default',
      repeatDays: [],
      isEnabled: true,
    };
  }
}
