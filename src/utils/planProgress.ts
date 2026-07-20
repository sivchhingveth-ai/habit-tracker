const PROGRESS_STORAGE = 'habit-tracker-plan-progress';
const PLAN_STORAGE = 'habit-tracker-3month-plan';

export const PLAN_PROGRESS_EVENT = 'plan-progress-updated';

export type PlanProgress = Record<string, { done: number; total: number }>;

export function getPlanProgress(): PlanProgress {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_STORAGE) || '{}');
  } catch {
    return {};
  }
}

function notify() {
  window.dispatchEvent(new Event(PLAN_PROGRESS_EVENT));
}

export function setPlanDayProgress(dayKey: string, done: number, total: number) {
  try {
    const all = getPlanProgress();
    const prev = all[dayKey];
    // Never regress a day (e.g. restarting a half-finished workout)
    if (prev && prev.total === total && prev.done > done) done = prev.done;
    all[dayKey] = { done, total };
    localStorage.setItem(PROGRESS_STORAGE, JSON.stringify(all));

    if (total > 0 && done >= total) {
      const raw = localStorage.getItem(PLAN_STORAGE);
      if (raw) {
        const plan = JSON.parse(raw);
        if (plan) {
          if (!Array.isArray(plan.completedDays)) plan.completedDays = [];
          if (!plan.completedDays.includes(dayKey)) {
            plan.completedDays.push(dayKey);
            localStorage.setItem(PLAN_STORAGE, JSON.stringify(plan));
          }
        }
      }
    }
    notify();
  } catch {}
}

export function clearPlanDayProgress(dayKey: string) {
  try {
    const all = getPlanProgress();
    if (dayKey in all) {
      delete all[dayKey];
      localStorage.setItem(PROGRESS_STORAGE, JSON.stringify(all));
    }
    notify();
  } catch {}
}
