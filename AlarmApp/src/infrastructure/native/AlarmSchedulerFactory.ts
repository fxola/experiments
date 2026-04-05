import { Platform } from 'react-native';
import { Alarm } from '../../domain/alarm/entities/Alarm';
import { AlarmScheduler } from './AlarmScheduler';
import { AndroidAlarmScheduler } from './AndroidAlarmScheduler';
import { IosAlarmScheduler } from './IosAlarmScheduler';

class AlarmSchedulerFactory {
  private static instance: AlarmScheduler | null = null;

  static getInstance(): AlarmScheduler {
    if (!this.instance) {
      if (Platform.OS === 'android') {
        this.instance = new AndroidAlarmScheduler();
      } else if (Platform.OS === 'ios') {
        this.instance = new IosAlarmScheduler();
      } else {
        this.instance = {
          schedule: async () => {},
          cancel: async () => {},
          cancelAll: async () => {},
          getScheduledAlarms: async () => [],
        };
      }
    }
    return this.instance;
  }

  static async scheduleAlarm(alarm: Alarm): Promise<void> {
    const scheduler = this.getInstance();
    await scheduler.schedule(alarm);
  }

  static async cancelAlarm(alarmId: string): Promise<void> {
    const scheduler = this.getInstance();
    await scheduler.cancel(alarmId);
  }
}

export { AlarmSchedulerFactory };
