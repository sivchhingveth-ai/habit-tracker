const STORAGE_PREFIX = 'habit-tracker-fitness-';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function save(key: string, value: unknown) {
  try { localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value)); } catch {}
}

// ─── Workout Log ───────────────────────────────────────────────
export interface WorkoutLogEntry {
  date: string;
  workoutName: string;
  duration: number;
  exercisesCompleted: number;
  totalExercises: number;
  caloriesBurned: number;
  level: string;
  xpEarned: number;
}

const WORKOUT_LOG_KEY = 'workout-log';

export function getWorkoutLog(): WorkoutLogEntry[] { return load(WORKOUT_LOG_KEY, []); }
export function addWorkoutLog(entry: WorkoutLogEntry) {
  const log = getWorkoutLog();
  log.push(entry);
  log.sort((a, b) => a.date.localeCompare(b.date));
  if (log.length > 200) log.splice(0, log.length - 200);
  save(WORKOUT_LOG_KEY, log);
}

// ─── Calories Burned Estimate ──────────────────────────────────
export function estimateCaloriesBurned(exerciseName: string, durationSeconds: number, _weightKg: number = 70): number {
  const met = getMET(exerciseName);
  return Math.round((met * 70 * durationSeconds) / 3600);
}

function getMET(name: string): number {
  const n = name.toLowerCase();
  if (n.includes('burpee') || n.includes('jump squat') || n.includes('mountain climber')) return 8.0;
  if (n.includes('squat') || n.includes('lunge') || n.includes('push-up') || n.includes('push up')) return 5.0;
  if (n.includes('plank') || n.includes('crunch') || n.includes('sit-up') || n.includes('sit up')) return 3.8;
  if (n.includes('walk') || n.includes('march') || n.includes('step')) return 3.5;
  if (n.includes('stretch') || n.includes('yoga')) return 2.5;
  if (n.includes('rest')) return 1.0;
  return 4.0;
}

// ─── XP ────────────────────────────────────────────────────────
const XP_KEY = 'xp-data';

export interface XPData {
  totalXP: number;
  level: number;
}

export function getXPData(): XPData {
  const data = load(XP_KEY, { totalXP: 0, level: 1 });
  data.level = Math.max(1, Math.floor(data.totalXP / 500) + 1);
  return data;
}

export function addXP(amount: number) {
  const data = getXPData();
  data.totalXP += amount;
  data.level = Math.floor(data.totalXP / 500) + 1;
  save(XP_KEY, data);
}
