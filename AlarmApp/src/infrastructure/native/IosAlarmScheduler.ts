import { NativeModules, Platform } from 'react-native';
import { Alarm } from '../../domain/alarm/entities/Alarm';
import { AlarmScheduler } from './AlarmScheduler';

const { IosAlarmScheduler: NativeIosScheduler } = NativeModules;

export class IosAlarmScheduler implements AlarmScheduler {
  async schedule(alarm: Alarm): Promise<void> {
    if (Platform.OS !== 'ios') return;

    if (!alarm.isEnabled || !alarm.nextTriggerAt) {
      return;
    }

    const triggerTime = alarm.nextTriggerAt.getTime();
    const now = Date.now();

    if (triggerTime <= now) {
      return;
    }

    try {
      await NativeIosScheduler.scheduleAlarm(
        alarm.id,
        triggerTime,
        alarm.label,
        alarm.sound.soundId,
        alarm.repeatPattern.isRecurring(),
        alarm.repeatPattern.toJSON()
      );
    } catch (error) {
      console.error('Failed to schedule alarm (iOS):', error);
      throw error;
    }
  }

  async cancel(alarmId: string): Promise<void> {
    if (Platform.OS !== 'ios') return;

    try {
      await NativeIosScheduler.cancelAlarm(alarmId);
    } catch (error) {
      console.error('Failed to cancel alarm (iOS):', error);
      throw error;
    }
  }

  async cancelAll(): Promise<void> {
    if (Platform.OS !== 'ios') return;

    try {
      await NativeIosScheduler.cancelAllAlarms();
    } catch (error) {
      console.error('Failed to cancel all alarms (iOS):', error);
      throw error;
    }
  }

  async getScheduledAlarms(): Promise<string[]> {
    if (Platform.OS !== 'ios') return [];

    try {
      return await NativeIosScheduler.getScheduledAlarmIds();
    } catch (error) {
      console.error('Failed to get scheduled alarms (iOS):', error);
      return [];
    }
  }
}
