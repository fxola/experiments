import { NativeModules, Platform } from 'react-native';
import { Alarm } from '../../domain/alarm/entities/Alarm';
import { AlarmScheduler } from './AlarmScheduler';

const { AndroidAlarmScheduler: NativeAndroidScheduler } = NativeModules;

export class AndroidAlarmScheduler implements AlarmScheduler {
  async schedule(alarm: Alarm): Promise<void> {
    if (Platform.OS !== 'android') return;

    if (!alarm.isEnabled || !alarm.nextTriggerAt) {
      return;
    }

    const triggerTime = alarm.nextTriggerAt.getTime();
    const now = Date.now();

    if (triggerTime <= now) {
      return;
    }

    try {
      await NativeAndroidScheduler.scheduleAlarm(
        alarm.id,
        triggerTime,
        alarm.label,
        alarm.sound.soundId,
        alarm.repeatPattern.isRecurring(),
        alarm.repeatPattern.toJSON()
      );
    } catch (error) {
      console.error('Failed to schedule alarm:', error);
      throw error;
    }
  }

  async cancel(alarmId: string): Promise<void> {
    if (Platform.OS !== 'android') return;

    try {
      await NativeAndroidScheduler.cancelAlarm(alarmId);
    } catch (error) {
      console.error('Failed to cancel alarm:', error);
      throw error;
    }
  }

  async cancelAll(): Promise<void> {
    if (Platform.OS !== 'android') return;

    try {
      await NativeAndroidScheduler.cancelAllAlarms();
    } catch (error) {
      console.error('Failed to cancel all alarms:', error);
      throw error;
    }
  }

  async getScheduledAlarms(): Promise<string[]> {
    if (Platform.OS !== 'android') return [];

    try {
      return await NativeAndroidScheduler.getScheduledAlarmIds();
    } catch (error) {
      console.error('Failed to get scheduled alarms:', error);
      return [];
    }
  }
}
