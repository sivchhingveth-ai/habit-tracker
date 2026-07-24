import { getPlanProgress, setPlanDayProgress, clearPlanDayProgress, PLAN_PROGRESS_EVENT } from './planProgress';

const PROGRESS_STORAGE = 'buttress-plan-progress';
const PLAN_STORAGE = 'buttress-3month-plan';

describe('planProgress', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns empty progress when nothing is stored', () => {
    expect(getPlanProgress()).toEqual({});
  });

  it('returns empty progress when stored JSON is malformed', () => {
    localStorage.setItem(PROGRESS_STORAGE, 'not json{');
    expect(getPlanProgress()).toEqual({});
  });

  it('stores progress for a day', () => {
    setPlanDayProgress('m1-w2-d3', 2, 5);
    expect(getPlanProgress()).toEqual({ 'm1-w2-d3': { done: 2, total: 5 } });
  });

  it('never regresses a day with the same total', () => {
    setPlanDayProgress('day1', 4, 5);
    setPlanDayProgress('day1', 1, 5);
    expect(getPlanProgress()['day1']).toEqual({ done: 4, total: 5 });
  });

  it('accepts lower done when the total changes', () => {
    setPlanDayProgress('day1', 4, 5);
    setPlanDayProgress('day1', 1, 3);
    expect(getPlanProgress()['day1']).toEqual({ done: 1, total: 3 });
  });

  it('marks the day completed in the stored plan when done reaches total', () => {
    localStorage.setItem(PLAN_STORAGE, JSON.stringify({ completedDays: [] }));
    setPlanDayProgress('day1', 5, 5);
    const plan = JSON.parse(localStorage.getItem(PLAN_STORAGE)!);
    expect(plan.completedDays).toEqual(['day1']);
  });

  it('does not duplicate completed days', () => {
    localStorage.setItem(PLAN_STORAGE, JSON.stringify({ completedDays: ['day1'] }));
    setPlanDayProgress('day1', 5, 5);
    const plan = JSON.parse(localStorage.getItem(PLAN_STORAGE)!);
    expect(plan.completedDays).toEqual(['day1']);
  });

  it('does not mark completion when total is zero', () => {
    localStorage.setItem(PLAN_STORAGE, JSON.stringify({ completedDays: [] }));
    setPlanDayProgress('day1', 0, 0);
    const plan = JSON.parse(localStorage.getItem(PLAN_STORAGE)!);
    expect(plan.completedDays).toEqual([]);
  });

  it('clears progress for a day', () => {
    setPlanDayProgress('day1', 2, 5);
    setPlanDayProgress('day2', 1, 5);
    clearPlanDayProgress('day1');
    expect(getPlanProgress()).toEqual({ 'day2': { done: 1, total: 5 } });
  });

  it('dispatches the progress event on updates', () => {
    let fired = 0;
    const handler = () => { fired++; };
    window.addEventListener(PLAN_PROGRESS_EVENT, handler);
    setPlanDayProgress('day1', 1, 5);
    clearPlanDayProgress('day1');
    window.removeEventListener(PLAN_PROGRESS_EVENT, handler);
    expect(fired).toBe(2);
  });
});
