export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
export const DAY_NUMBERS = [0, 1, 2, 3, 4, 5, 6] as const;

export class RepeatPattern {
  readonly days: readonly number[];

  private constructor(days: readonly number[]) {
    this.days = days;
  }

  static empty(): RepeatPattern {
    return new RepeatPattern([]);
  }

  static daily(): RepeatPattern {
    return new RepeatPattern([0, 1, 2, 3, 4, 5, 6]);
  }

  static weekdays(): RepeatPattern {
    return new RepeatPattern([1, 2, 3, 4, 5]);
  }

  static weekends(): RepeatPattern {
    return new RepeatPattern([0, 6]);
  }

  static fromDays(days: number[]): RepeatPattern {
    const uniqueDays = [...new Set(days.filter((d) => d >= 0 && d <= 6))].sort();
    return new RepeatPattern(uniqueDays);
  }

  static fromDaysJSON(json: string): RepeatPattern {
    try {
      const days = JSON.parse(json) as number[];
      return RepeatPattern.fromDays(days);
    } catch {
      return RepeatPattern.empty();
    }
  }

  isRecurring(): boolean {
    return this.days.length > 0;
  }

  isDaily(): boolean {
    return this.days.length === 7;
  }

  isWeekdays(): boolean {
    return (
      this.days.length === 5 &&
      this.days.every((d) => d >= 1 && d <= 5)
    );
  }

  isWeekends(): boolean {
    return this.days.length === 2 && this.days.includes(0) && this.days.includes(6);
  }

  includesDay(day: number): boolean {
    return this.days.includes(day);
  }

  getNextTriggerDay(fromDay: number): number | null {
    if (this.days.length === 0) return null;

    for (let i = 1; i <= 7; i++) {
      const nextDay = (fromDay + i) % 7;
      if (this.days.includes(nextDay)) {
        return nextDay;
      }
    }
    return null;
  }

  toJSON(): string {
    return JSON.stringify(this.days);
  }

  equals(other: RepeatPattern): boolean {
    if (this.days.length !== other.days.length) return false;
    return this.days.every((day) => other.days.includes(day));
  }
}
