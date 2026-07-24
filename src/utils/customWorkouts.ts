import { Workout, Exercise } from './workouts';

const STORAGE_KEY = 'buttress-custom-workouts';

let _id = Date.now();
const nextId = () => `custom-${_id++}`;

export const getCustomWorkouts = (): Workout[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveCustomWorkouts = (workouts: Workout[]) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts)); } catch { /* ignore */ }
};

export const addCustomWorkout = (w: Omit<Workout, 'id'>): Workout => {
  const workout: Workout = { ...w, id: nextId() };
  const all = getCustomWorkouts();
  all.push(workout);
  saveCustomWorkouts(all);
  return workout;
};

export const updateCustomWorkout = (id: string, patch: Partial<Omit<Workout, 'id'>>) => {
  const all = getCustomWorkouts();
  const idx = all.findIndex((w) => w.id === id);
  if (idx === -1) return;
  all[idx] = { ...all[idx], ...patch };
  saveCustomWorkouts(all);
};

export const deleteCustomWorkout = (id: string) => {
  saveCustomWorkouts(getCustomWorkouts().filter((w) => w.id !== id));
};
