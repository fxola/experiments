import { AlarmUseCases } from '../application/alarm/AlarmUseCases';
import { SqliteAlarmRepository } from '../infrastructure/persistence/SqliteAlarmRepository';

class Container {
  private static instance: Container;
  private _alarmRepository: SqliteAlarmRepository | null = null;
  private _alarmUseCases: AlarmUseCases | null = null;

  private constructor() {}

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }

  get alarmRepository(): SqliteAlarmRepository {
    if (!this._alarmRepository) {
      this._alarmRepository = new SqliteAlarmRepository();
    }
    return this._alarmRepository;
  }

  get alarmUseCases(): AlarmUseCases {
    if (!this._alarmUseCases) {
      this._alarmUseCases = new AlarmUseCases(this.alarmRepository);
    }
    return this._alarmUseCases;
  }
}

export const container = Container.getInstance();
