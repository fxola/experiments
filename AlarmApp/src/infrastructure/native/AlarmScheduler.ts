import { Alarm } from '../../domain/alarm/entities/Alarm';

export interface AlarmScheduler {
  schedule(alarm: Alarm): Promise<void>;
  cancel(alarmId: string): Promise<void>;
  cancelAll(): Promise<void>;
  getScheduledAlarms(): Promise<string[]>;
}

export interface AlarmSchedulerConfig {
  defaultSnoozeMinutes?: number;
}
