import { eventBus } from '../../domain/shared';
import {
  Alarm,
  AlarmRepository,
  Time,
  RepeatPattern,
  SoundSelection,
  CreateAlarmParams,
  UpdateAlarmParams,
} from '../../domain/alarm';
import { AlarmSchedulerFactory } from '../../infrastructure/native/AlarmSchedulerFactory';

export class AlarmUseCases {
  constructor(private readonly alarmRepository: AlarmRepository) {}

  async createAlarm(params: CreateAlarmParams): Promise<Alarm> {
    const { alarm, events } = Alarm.create({
      time: params.time,
      label: params.label,
      sound: params.sound,
      repeatPattern: params.repeatPattern,
      isEnabled: params.isEnabled,
    });

    await this.alarmRepository.save(alarm);

    if (alarm.isEnabled && alarm.nextTriggerAt) {
      await AlarmSchedulerFactory.scheduleAlarm(alarm);
    }

    for (const event of events) {
      await eventBus.publish(event);
    }

    return alarm;
  }

  async updateAlarm(alarmId: string, params: UpdateAlarmParams): Promise<Alarm> {
    const existingAlarm = await this.alarmRepository.findById(alarmId);
    if (!existingAlarm) {
      throw new Error(`Alarm not found: ${alarmId}`);
    }

    const { alarm, events } = existingAlarm.update(params);
    await this.alarmRepository.update(alarm);

    await AlarmSchedulerFactory.cancelAlarm(alarmId);
    if (alarm.isEnabled && alarm.nextTriggerAt) {
      await AlarmSchedulerFactory.scheduleAlarm(alarm);
    }

    for (const event of events) {
      await eventBus.publish(event);
    }

    return alarm;
  }

  async deleteAlarm(alarmId: string): Promise<void> {
    const alarm = await this.alarmRepository.findById(alarmId);
    if (!alarm) {
      throw new Error(`Alarm not found: ${alarmId}`);
    }

    await AlarmSchedulerFactory.cancelAlarm(alarmId);
    await this.alarmRepository.delete(alarmId);

    const { events } = alarm.delete();
    for (const event of events) {
      await eventBus.publish(event);
    }
  }

  async toggleAlarm(alarmId: string): Promise<Alarm> {
    const alarm = await this.alarmRepository.findById(alarmId);
    if (!alarm) {
      throw new Error(`Alarm not found: ${alarmId}`);
    }

    const { alarm: updatedAlarm, events } = alarm.toggle();
    await this.alarmRepository.update(updatedAlarm);

    if (updatedAlarm.isEnabled && updatedAlarm.nextTriggerAt) {
      await AlarmSchedulerFactory.scheduleAlarm(updatedAlarm);
    } else {
      await AlarmSchedulerFactory.cancelAlarm(alarmId);
    }

    for (const event of events) {
      await eventBus.publish(event);
    }

    return updatedAlarm;
  }

  async getAllAlarms(): Promise<Alarm[]> {
    return this.alarmRepository.findAll();
  }

  async getAlarmById(alarmId: string): Promise<Alarm | null> {
    return this.alarmRepository.findById(alarmId);
  }

  async getEnabledAlarms(): Promise<Alarm[]> {
    return this.alarmRepository.findEnabled();
  }

  async handleAlarmTriggered(alarmId: string): Promise<void> {
    const alarm = await this.alarmRepository.findById(alarmId);
    if (!alarm) return;

    const { events } = alarm.trigger();
    for (const event of events) {
      await eventBus.publish(event);
    }
  }

  async handleAlarmDismissed(alarmId: string, triggeredAt: Date): Promise<void> {
    const alarm = await this.alarmRepository.findById(alarmId);
    if (!alarm) return;

    const { events } = alarm.dismiss(triggeredAt);
    for (const event of events) {
      await eventBus.publish(event);
    }
  }

  async handleAlarmSnoozed(alarmId: string, minutes: number): Promise<void> {
    const alarm = await this.alarmRepository.findById(alarmId);
    if (!alarm) return;

    const { events } = alarm.snooze(minutes);
    for (const event of events) {
      await eventBus.publish(event);
    }
  }
}
