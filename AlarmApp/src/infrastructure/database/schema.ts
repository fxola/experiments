export const ALARM_TABLE = 'alarms';

export const AlarmColumns = {
  ID: 'id',
  HOUR: 'hour',
  MINUTE: 'minute',
  LABEL: 'label',
  SOUND_ID: 'sound_id',
  SOUND_URI: 'sound_uri',
  REPEAT_DAYS: 'repeat_days',
  IS_ENABLED: 'is_enabled',
  NEXT_TRIGGER_AT: 'next_trigger_at',
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at',
} as const;
