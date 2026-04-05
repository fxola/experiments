import { Alarm } from '../../domain/alarm/entities/Alarm';
import { Time } from '../../domain/alarm/value-objects/Time';
import { RepeatPattern } from '../../domain/alarm/value-objects/RepeatPattern';
import { SoundSelection } from '../../domain/alarm/value-objects/SoundSelection';
import { AlarmRepository } from '../../domain/alarm/repositories/AlarmRepository';
import { getDatabase } from '../database/DatabaseProvider';
import { ALARM_TABLE, AlarmColumns } from '../database/schema';

interface AlarmRow {
  id: string;
  hour: number;
  minute: number;
  label: string;
  sound_id: string;
  sound_uri: string | null;
  repeat_days: string;
  is_enabled: number;
  next_trigger_at: string | null;
  created_at: string;
  updated_at: string;
}

export class SqliteAlarmRepository implements AlarmRepository {
  private mapRowToAlarm(row: AlarmRow): Alarm {
    return Alarm.fromPersistence({
      id: row.id,
      time: new Time(row.hour, row.minute),
      label: row.label ?? '',
      sound: SoundSelection.create(row.sound_id, row.sound_uri ?? undefined),
      repeatPattern: RepeatPattern.fromDaysJSON(row.repeat_days),
      isEnabled: row.is_enabled === 1,
      nextTriggerAt: row.next_trigger_at ? new Date(row.next_trigger_at) : null,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    });
  }

  async findAll(): Promise<Alarm[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<AlarmRow>(
      `SELECT * FROM ${ALARM_TABLE} ORDER BY hour ASC, minute ASC`
    );
    return rows.map((row) => this.mapRowToAlarm(row));
  }

  async findById(id: string): Promise<Alarm | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<AlarmRow>(
      `SELECT * FROM ${ALARM_TABLE} WHERE ${AlarmColumns.ID} = ?`,
      [id]
    );
    return row ? this.mapRowToAlarm(row) : null;
  }

  async findEnabled(): Promise<Alarm[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<AlarmRow>(
      `SELECT * FROM ${ALARM_TABLE} WHERE ${AlarmColumns.IS_ENABLED} = 1 ORDER BY hour ASC, minute ASC`
    );
    return rows.map((row) => this.mapRowToAlarm(row));
  }

  async save(alarm: Alarm): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT INTO ${ALARM_TABLE} (
        ${AlarmColumns.ID}, ${AlarmColumns.HOUR}, ${AlarmColumns.MINUTE},
        ${AlarmColumns.LABEL}, ${AlarmColumns.SOUND_ID}, ${AlarmColumns.SOUND_URI},
        ${AlarmColumns.REPEAT_DAYS}, ${AlarmColumns.IS_ENABLED},
        ${AlarmColumns.NEXT_TRIGGER_AT}, ${AlarmColumns.CREATED_AT}, ${AlarmColumns.UPDATED_AT}
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        alarm.id,
        alarm.time.hour,
        alarm.time.minute,
        alarm.label,
        alarm.sound.soundId,
        alarm.sound.uri ?? null,
        alarm.repeatPattern.toJSON(),
        alarm.isEnabled ? 1 : 0,
        alarm.nextTriggerAt?.toISOString() ?? null,
        alarm.createdAt.toISOString(),
        alarm.updatedAt.toISOString(),
      ]
    );
  }

  async update(alarm: Alarm): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `UPDATE ${ALARM_TABLE} SET
        ${AlarmColumns.HOUR} = ?, ${AlarmColumns.MINUTE} = ?,
        ${AlarmColumns.LABEL} = ?, ${AlarmColumns.SOUND_ID} = ?,
        ${AlarmColumns.SOUND_URI} = ?, ${AlarmColumns.REPEAT_DAYS} = ?,
        ${AlarmColumns.IS_ENABLED} = ?, ${AlarmColumns.NEXT_TRIGGER_AT} = ?,
        ${AlarmColumns.UPDATED_AT} = ?
      WHERE ${AlarmColumns.ID} = ?`,
      [
        alarm.time.hour,
        alarm.time.minute,
        alarm.label,
        alarm.sound.soundId,
        alarm.sound.uri ?? null,
        alarm.repeatPattern.toJSON(),
        alarm.isEnabled ? 1 : 0,
        alarm.nextTriggerAt?.toISOString() ?? null,
        alarm.updatedAt.toISOString(),
        alarm.id,
      ]
    );
  }

  async delete(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(`DELETE FROM ${ALARM_TABLE} WHERE ${AlarmColumns.ID} = ?`, [id]);
  }
}
