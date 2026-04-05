import { eventBus } from '../../domain/shared';
import {
  AlarmCreated,
  AlarmUpdated,
  AlarmDeleted,
  AlarmTriggered,
  AlarmDismissed,
  AlarmSnoozed,
  AlarmEnabled,
  AlarmDisabled,
} from '../../domain/alarm/events';
import { captureEvent } from './PostHogProvider';

export class PostHogAlarmTracker {
  private unsubscribers: (() => void)[] = [];

  start(): void {
    this.unsubscribers = [
      eventBus.subscribe('AlarmCreated', this.handleAlarmCreated),
      eventBus.subscribe('AlarmUpdated', this.handleAlarmUpdated),
      eventBus.subscribe('AlarmDeleted', this.handleAlarmDeleted),
      eventBus.subscribe('AlarmTriggered', this.handleAlarmTriggered),
      eventBus.subscribe('AlarmDismissed', this.handleAlarmDismissed),
      eventBus.subscribe('AlarmSnoozed', this.handleAlarmSnoozed),
      eventBus.subscribe('AlarmEnabled', this.handleAlarmEnabled),
      eventBus.subscribe('AlarmDisabled', this.handleAlarmDisabled),
    ];
  }

  stop(): void {
    this.unsubscribers.forEach((unsub) => unsub());
    this.unsubscribers = [];
  }

  private handleAlarmCreated = (event: AlarmCreated): void => {
    captureEvent('alarm_created', {
      alarm_id: event.alarm.id,
      time: event.alarm.time.format(),
      is_recurring: event.alarm.repeatPattern.isRecurring() ? 'true' : 'false',
      repeat_days_count: event.alarm.repeatPattern.days.length,
    });
  };

  private handleAlarmUpdated = (event: AlarmUpdated): void => {
    captureEvent('alarm_updated', {
      alarm_id: event.alarm.id,
      changed_fields: event.changedFields.join(','),
    });
  };

  private handleAlarmDeleted = (event: AlarmDeleted): void => {
    captureEvent('alarm_deleted', {
      alarm_id: event.alarm.id,
    });
  };

  private handleAlarmTriggered = (event: AlarmTriggered): void => {
    captureEvent('alarm_triggered', {
      alarm_id: event.alarm.id,
      was_in_foreground: event.wasInForeground ? 'true' : 'false',
    });
  };

  private handleAlarmDismissed = (event: AlarmDismissed): void => {
    captureEvent('alarm_dismissed', {
      alarm_id: event.alarm.id,
      time_to_dismiss_seconds: Math.round(event.timeToDismissMs / 1000),
    });
  };

  private handleAlarmSnoozed = (event: AlarmSnoozed): void => {
    captureEvent('alarm_snoozed', {
      alarm_id: event.alarm.id,
      snooze_duration_minutes: event.snoozeDurationMinutes,
    });
  };

  private handleAlarmEnabled = (event: AlarmEnabled): void => {
    captureEvent('alarm_enabled', {
      alarm_id: event.alarm.id,
    });
  };

  private handleAlarmDisabled = (event: AlarmDisabled): void => {
    captureEvent('alarm_disabled', {
      alarm_id: event.alarm.id,
    });
  };
}

export const posthogAlarmTracker = new PostHogAlarmTracker();
