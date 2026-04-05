import { Alarm } from '../entities/Alarm';

export interface AlarmRepository {
  findAll(): Promise<Alarm[]>;
  findById(id: string): Promise<Alarm | null>;
  findEnabled(): Promise<Alarm[]>;
  save(alarm: Alarm): Promise<void>;
  update(alarm: Alarm): Promise<void>;
  delete(id: string): Promise<void>;
}
