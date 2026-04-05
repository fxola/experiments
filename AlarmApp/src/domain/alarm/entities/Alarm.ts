import { Time } from '../value-objects/Time';
import { RepeatPattern } from '../value-objects/RepeatPattern';
import { SoundSelection } from '../value-objects/SoundSelection';
import { AlarmCreated } from '../events/AlarmCreated';
import { AlarmUpdated } from '../events/AlarmUpdated';
import { AlarmDeleted } from '../events/AlarmDeleted';
import { AlarmTriggered } from '../events/AlarmTriggered';
import { AlarmDismissed } from '../events/AlarmDismissed';
import { AlarmSnoozed } from '../events/AlarmSnoozed';
import { AlarmEnabled, AlarmDisabled } from '../events/AlarmToggled';
import { DomainEvent } from '../../shared';
import { addDays, setHours, setMinutes, startOfDay, isBefore } from 'date-fns';

export interface AlarmProps {
  id: string;
  time: Time;
  label: string;
  sound: SoundSelection;
  repeatPattern: RepeatPattern;
  isEnabled: boolean;
  nextTriggerAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAlarmParams {
  time: Time;
  label?: string;
  sound?: SoundSelection;
  repeatPattern?: RepeatPattern;
  isEnabled?: boolean;
}

export interface UpdateAlarmParams {
  time?: Time;
  label?: string;
  sound?: SoundSelection;
  repeatPattern?: RepeatPattern;
  isEnabled?: boolean;
}

export class Alarm {
  readonly id: string;
  readonly time: Time;
  readonly label: string;
  readonly sound: SoundSelection;
  readonly repeatPattern: RepeatPattern;
  readonly isEnabled: boolean;
  readonly nextTriggerAt: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: AlarmProps) {
    this.id = props.id;
    this.time = props.time;
    this.label = props.label;
    this.sound = props.sound;
    this.repeatPattern = props.repeatPattern;
    this.isEnabled = props.isEnabled;
    this.nextTriggerAt = props.nextTriggerAt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(params: CreateAlarmParams): { alarm: Alarm; events: DomainEvent[] } {
    const id = Date.now().toString();
    const now = new Date();
    const time = params.time;
    const repeatPattern = params.repeatPattern ?? RepeatPattern.empty();
    const nextTriggerAt = Alarm.calculateNextTrigger(time, repeatPattern, now);

    const alarm = new Alarm({
      id,
      time,
      label: params.label ?? '',
      sound: params.sound ?? SoundSelection.default(),
      repeatPattern,
      isEnabled: params.isEnabled ?? true,
      nextTriggerAt,
      createdAt: now,
      updatedAt: now,
    });

    const events: DomainEvent[] = [new AlarmCreated(alarm)];

    return { alarm, events };
  }

  static fromPersistence(props: AlarmProps): Alarm {
    return new Alarm(props);
  }

  update(params: UpdateAlarmParams): { alarm: Alarm; events: DomainEvent[] } {
    const now = new Date();
    const time = params.time ?? this.time;
    const label = params.label ?? this.label;
    const sound = params.sound ?? this.sound;
    const repeatPattern = params.repeatPattern ?? this.repeatPattern;
    const isEnabled = params.isEnabled ?? this.isEnabled;
    const nextTriggerAt = isEnabled
      ? Alarm.calculateNextTrigger(time, repeatPattern, now)
      : null;

    const alarm = new Alarm({
      id: this.id,
      time,
      label,
      sound,
      repeatPattern,
      isEnabled,
      nextTriggerAt,
      createdAt: this.createdAt,
      updatedAt: now,
    });

    const events: DomainEvent[] = [new AlarmUpdated(this, alarm)];
    return { alarm, events };
  }

  toggle(): { alarm: Alarm; events: DomainEvent[] } {
    return this.update({ isEnabled: !this.isEnabled });
  }

  delete(): { alarm: Alarm; events: DomainEvent[] } {
    return {
      alarm: this,
      events: [new AlarmDeleted(this)],
    };
  }

  trigger(): { alarm: Alarm; events: DomainEvent[] } {
    const events: DomainEvent[] = [new AlarmTriggered(this)];
    return { alarm: this, events };
  }

  dismiss(triggeredAt: Date): { alarm: Alarm; events: DomainEvent[] } {
    const events: DomainEvent[] = [new AlarmDismissed(this, triggeredAt)];
    return { alarm: this, events };
  }

  snooze(minutes: number): { alarm: Alarm; events: DomainEvent[] } {
    const events: DomainEvent[] = [new AlarmSnoozed(this, minutes)];
    return { alarm: this, events };
  }

  private static calculateNextTrigger(
    time: Time,
    repeatPattern: RepeatPattern,
    fromDate: Date
  ): Date | null {
    const today = startOfDay(fromDate);
    let candidate = setMinutes(setHours(today, time.hour), time.minute);

    if (!repeatPattern.isRecurring()) {
      if (isBefore(candidate, fromDate)) {
        return null;
      }
      return candidate;
    }

    const currentDay = fromDate.getDay();

    for (let i = 0; i <= 7; i++) {
      const checkDate = addDays(today, i);
      const checkDay = checkDate.getDay();

      if (repeatPattern.includesDay(checkDay)) {
        candidate = setMinutes(setHours(checkDate, time.hour), time.minute);
        if (i === 0 && isBefore(candidate, fromDate)) {
          continue;
        }
        return candidate;
      }
    }

    return null;
  }

  toPlainObject(): Record<string, unknown> {
    return {
      id: this.id,
      hour: this.time.hour,
      minute: this.time.minute,
      label: this.label,
      soundId: this.sound.soundId,
      soundUri: this.sound.uri,
      repeatDays: this.repeatPattern.toJSON(),
      isEnabled: this.isEnabled,
      nextTriggerAt: this.nextTriggerAt?.toISOString() ?? null,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
