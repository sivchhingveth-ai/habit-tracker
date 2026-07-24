/**
 * Formats a Date object as YYYY-MM-DD in the local timezone.
 */
export const formatDateStr = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Converts a string to title case: first letter of each word capitalized.
 */
export const toTitleCase = (str: string): string =>
  str.replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * Calculates the "effective date" for the habit tracker.
 * If the current time is before 5:00 AM, it returns the previous day's date.
 */
export const getEffectiveDate = (date: Date = new Date()): Date => {
  const hours = date.getHours();
  // We use a clone to avoid mutating the original date
  const result = new Date(date);
  if (hours < 5) {
    result.setDate(result.getDate() - 1);
  }
  return result;
};

/**
 * Returns the effective date string in YYYY-MM-DD format (local time).
 */
export const getEffectiveDateStr = (date: Date = new Date()): string => {
  return formatDateStr(getEffectiveDate(date));
};

/**
 * Returns the days of the month (1-indexed) a habit is due for a given
 * monthly target, evenly spaced from day 1. Generalizes the old fixed
 * 1/2/3/4 presets (which matched 1st; 1st+15th; 1st/11th/21st;
 * 1st/8th/15th/22nd) to any custom target count.
 */
export const getDueDaysInMonth = (monthlyTarget: number, daysInMonth: number): number[] => {
  const target = Math.min(monthlyTarget, daysInMonth);
  return Array.from({ length: target }, (_, i) => 1 + Math.floor((i * daysInMonth) / target));
};

/**
 * Checks if a habit should be visible on a specific day based on monthly target.
 * Monthly target defines how many times per month the habit appears, spread
 * evenly across the month starting from the 1st.
 *
 * @param monthlyTarget - Number of times per month (undefined/0 = daily)
 * @param dateStr - The date to check in YYYY-MM-DD format
 * @returns boolean - Whether the habit should be visible on this day
 */
export const shouldShowHabitOnDay = (monthlyTarget: number | undefined | null, dateStr: string): boolean => {
  // If no target, 0, or at/above the days in the month, show every day
  if (!monthlyTarget || monthlyTarget <= 0) {
    return true;
  }

  const [year, month, day] = dateStr.split('-').map(Number);
  const currentDay = day;
  const daysInMonth = new Date(year, month, 0).getDate();

  if (monthlyTarget >= daysInMonth) return true;

  return getDueDaysInMonth(monthlyTarget, daysInMonth).includes(currentDay);
};

/**
 * Calculates the streak for a habit history.
 * A streak is the number of consecutive days (backwards from today or yesterday)
 * that the habit was completed.
 */
export const calculateStreak = (history: Record<string, boolean>, todayStr: string): number => {
  let streak = 0;
  const [y, m, day] = todayStr.split('-').map(Number);
  const curr = new Date(y, m - 1, day);

  // If done today, start from today
  if (history[todayStr]) {
    streak++;
    curr.setDate(curr.getDate() - 1);
  } else {
    // If NOT done today, start checking from yesterday to keep an existing streak alive
    curr.setDate(curr.getDate() - 1);
  }

  while (history[formatDateStr(curr)]) {
    streak++;
    curr.setDate(curr.getDate() - 1);
    if (streak > 365) break; // sanity cap
  }
  return streak;
};
