export class Time {
  readonly hour: number;
  readonly minute: number;

  constructor(hour: number, minute: number) {
    if (hour < 0 || hour > 23) {
      throw new Error('Hour must be between 0 and 23');
    }
    if (minute < 0 || minute > 59) {
      throw new Error('Minute must be between 0 and 59');
    }
    this.hour = hour;
    this.minute = minute;
  }

  format(): string {
    const h = this.hour.toString().padStart(2, '0');
    const m = this.minute.toString().padStart(2, '0');
    return `${h}:${m}`;
  }

  format12Hour(): { time: string; period: 'AM' | 'PM' } {
    const period = this.hour >= 12 ? 'PM' : 'AM';
    const hour12 = this.hour % 12 || 12;
    return {
      time: `${hour12}:${this.minute.toString().padStart(2, '0')}`,
      period,
    };
  }

  toMinutes(): number {
    return this.hour * 60 + this.minute;
  }

  equals(other: Time): boolean {
    return this.hour === other.hour && this.minute === other.minute;
  }
}
