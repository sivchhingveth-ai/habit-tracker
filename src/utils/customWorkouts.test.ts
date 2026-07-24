import { getCustomWorkouts, addCustomWorkout, updateCustomWorkout, deleteCustomWorkout } from './customWorkouts';
import { Workout } from './workouts';

const STORAGE_KEY = 'buttress-custom-workouts';

const draft: Omit<Workout, 'id'> = {
  title: 'Morning Blast',
  tagline: 'Quick start',
  duration: '15 min',
  level: 'beginner',
  gender: 'men',
  exercises: [{ name: 'Regular Push-Ups', duration: '30s' }],
  tip: 'Warm up first',
};

describe('customWorkouts', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns an empty list when nothing is stored', () => {
    expect(getCustomWorkouts()).toEqual([]);
  });

  it('returns an empty list when stored JSON is malformed', () => {
    localStorage.setItem(STORAGE_KEY, '{{nope');
    expect(getCustomWorkouts()).toEqual([]);
  });

  it('adds a workout with a generated custom id', () => {
    const added = addCustomWorkout(draft);
    expect(added.id).toMatch(/^custom-\d+$/);
    expect(getCustomWorkouts()).toEqual([added]);
  });

  it('generates unique ids for consecutive adds', () => {
    const a = addCustomWorkout(draft);
    const b = addCustomWorkout(draft);
    expect(a.id).not.toBe(b.id);
    expect(getCustomWorkouts()).toHaveLength(2);
  });

  it('updates an existing workout by id', () => {
    const added = addCustomWorkout(draft);
    updateCustomWorkout(added.id, { title: 'Evening Blast', level: 'advanced' });
    const stored = getCustomWorkouts();
    expect(stored[0].title).toBe('Evening Blast');
    expect(stored[0].level).toBe('advanced');
    expect(stored[0].tagline).toBe('Quick start');
  });

  it('ignores updates for unknown ids', () => {
    const added = addCustomWorkout(draft);
    updateCustomWorkout('custom-does-not-exist', { title: 'Nope' });
    expect(getCustomWorkouts()).toEqual([added]);
  });

  it('deletes a workout by id and keeps the rest', () => {
    const a = addCustomWorkout(draft);
    const b = addCustomWorkout({ ...draft, title: 'Second' });
    deleteCustomWorkout(a.id);
    const stored = getCustomWorkouts();
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe(b.id);
  });
});
