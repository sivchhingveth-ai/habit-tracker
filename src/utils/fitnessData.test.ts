import { getWorkoutLog, addWorkoutLog, estimateCaloriesBurned, getXPData, addXP, WorkoutLogEntry } from './fitnessData';

const makeEntry = (date: string): WorkoutLogEntry => ({
  date,
  workoutName: 'Full Body',
  duration: 900,
  exercisesCompleted: 5,
  totalExercises: 5,
  caloriesBurned: 100,
  level: 'beginner',
  xpEarned: 50,
});

describe('fitnessData', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('workout log', () => {
    it('returns an empty log initially', () => {
      expect(getWorkoutLog()).toEqual([]);
    });

    it('stores entries sorted by date', () => {
      addWorkoutLog(makeEntry('2026-07-20'));
      addWorkoutLog(makeEntry('2026-07-18'));
      addWorkoutLog(makeEntry('2026-07-19'));
      expect(getWorkoutLog().map((e) => e.date)).toEqual(['2026-07-18', '2026-07-19', '2026-07-20']);
    });

    it('caps the log at 200 entries, dropping the oldest', () => {
      for (let i = 0; i < 205; i++) {
        addWorkoutLog(makeEntry(`2026-01-${String(100 + i)}`));
      }
      const log = getWorkoutLog();
      expect(log).toHaveLength(200);
      expect(log[0].date).toBe('2026-01-105');
    });
  });

  describe('estimateCaloriesBurned', () => {
    it('uses higher MET for intense exercises', () => {
      // 8.0 MET * 70kg * 3600s / 3600 = 560
      expect(estimateCaloriesBurned('Burpees', 3600)).toBe(560);
    });

    it('uses moderate MET for strength exercises', () => {
      // 5.0 MET * 70kg * 3600s / 3600 = 350
      expect(estimateCaloriesBurned('Regular Push-Ups', 3600)).toBe(350);
    });

    it('uses low MET for rest', () => {
      // 1.0 MET * 70kg * 3600s / 3600 = 70
      expect(estimateCaloriesBurned('Rest', 3600)).toBe(70);
    });

    it('falls back to default MET for unknown exercises', () => {
      // 4.0 MET * 70kg * 3600s / 3600 = 280
      expect(estimateCaloriesBurned('Mystery Move', 3600)).toBe(280);
    });

    it('scales with duration and rounds to whole calories', () => {
      // 5.0 * 70 * 30 / 3600 = 2.9166... -> 3
      expect(estimateCaloriesBurned('Squats', 30)).toBe(3);
    });
  });

  describe('XP', () => {
    it('starts at level 1 with no XP', () => {
      expect(getXPData()).toEqual({ totalXP: 0, level: 1 });
    });

    it('accumulates XP and levels up every 500 XP', () => {
      addXP(300);
      expect(getXPData()).toEqual({ totalXP: 300, level: 1 });
      addXP(300);
      expect(getXPData()).toEqual({ totalXP: 600, level: 2 });
      addXP(900);
      expect(getXPData()).toEqual({ totalXP: 1500, level: 4 });
    });
  });
});
