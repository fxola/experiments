export interface SoundOption {
  id: string;
  name: string;
  uri?: string;
}

export const DEFAULT_ALARM_SOUNDS: SoundOption[] = [
  { id: 'default', name: 'Default' },
  { id: 'radar', name: 'Radar' },
  { id: 'chord', name: 'Chord' },
  { id: 'echo', name: 'Echo' },
  { id: 'fanfare', name: 'Fanfare' },
  { id: '升起', name: 'Rise' },
  { id: 'alarms', name: 'Alarms' },
];

export class SoundSelection {
  readonly soundId: string;
  readonly uri?: string;

  private constructor(soundId: string, uri?: string) {
    this.soundId = soundId;
    this.uri = uri;
  }

  static default(): SoundSelection {
    return new SoundSelection('default');
  }

  static create(soundId: string, uri?: string): SoundSelection {
    return new SoundSelection(soundId, uri);
  }

  static fromOption(option: SoundOption): SoundSelection {
    return new SoundSelection(option.id, option.uri);
  }

  getDisplayName(): string {
    const found = DEFAULT_ALARM_SOUNDS.find((s) => s.id === this.soundId);
    return found?.name ?? this.soundId;
  }

  equals(other: SoundSelection): boolean {
    return this.soundId === other.soundId;
  }
}
