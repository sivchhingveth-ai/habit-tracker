/**
 * @vitest-environment node
 */
import { formatDateStr, getEffectiveDate, getEffectiveDateStr, getDueDaysInMonth, shouldShowHabitOnDay } from './dateUtils';


describe('dateUtils', () => {
  it('should format a date as YYYY-MM-DD', () => {
    const date = new Date(2023, 0, 15); // Jan 15th (m=0)
    expect(formatDateStr(date)).toBe('2023-01-15');
  });

  it('should shift the date to the previous day if time is before 5 AM', () => {
    const Jan16_4AM = new Date(2023, 0, 16, 4, 30);
    const effective = getEffectiveDate(Jan16_4AM);
    expect(effective.getDate()).toBe(15);
    expect(effective.getMonth()).toBe(0);
    expect(formatDateStr(effective)).toBe('2023-01-15');
  });

  it('should NOT shift the date if time is 5 AM or later', () => {
    const Jan16_6AM = new Date(2023, 0, 16, 6, 0);
    const effective = getEffectiveDate(Jan16_6AM);
    expect(effective.getDate()).toBe(16);
    expect(effective.getMonth()).toBe(0);
    expect(formatDateStr(effective)).toBe('2023-01-16');
  });

  it('should format effective date string correctly', () => {
    const Jan16_2AM = new Date(2023, 0, 16, 2, 0);
    expect(getEffectiveDateStr(Jan16_2AM)).toBe('2023-01-15');

    const Jan16_8AM = new Date(2023, 0, 16, 8, 0);
    expect(getEffectiveDateStr(Jan16_8AM)).toBe('2023-01-16');
  });
});

describe('getDueDaysInMonth', () => {
  it('matches the legacy presets on a 31-day month', () => {
    expect(getDueDaysInMonth(1, 31)).toEqual([1]);
    expect(getDueDaysInMonth(2, 31)).toEqual([1, 16]);
    expect(getDueDaysInMonth(3, 31)).toEqual([1, 11, 21]);
    expect(getDueDaysInMonth(4, 31)).toEqual([1, 8, 16, 24]);
  });

  it('spreads a custom target evenly and always starts on day 1', () => {
    const days = getDueDaysInMonth(6, 30);
    expect(days).toHaveLength(6);
    expect(days[0]).toBe(1);
    expect(Math.max(...days)).toBeLessThanOrEqual(30);
  });

  it('caps the count at the number of days in the month', () => {
    expect(getDueDaysInMonth(40, 28)).toHaveLength(28);
  });
});

describe('shouldShowHabitOnDay', () => {
  it('shows every day when target is empty or zero', () => {
    expect(shouldShowHabitOnDay(undefined, '2026-02-14')).toBe(true);
    expect(shouldShowHabitOnDay(0, '2026-02-14')).toBe(true);
  });

  it('shows only on the 1st for a once-a-month target', () => {
    expect(shouldShowHabitOnDay(1, '2026-02-01')).toBe(true);
    expect(shouldShowHabitOnDay(1, '2026-02-02')).toBe(false);
  });

  it('honors a custom target on the computed due days', () => {
    const due = getDueDaysInMonth(5, 28);
    const month = '2026-02-';
    for (let d = 1; d <= 28; d++) {
      const dateStr = month + String(d).padStart(2, '0');
      expect(shouldShowHabitOnDay(5, dateStr)).toBe(due.includes(d));
    }
  });
});
