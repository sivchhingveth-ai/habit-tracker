import React, { useState, useCallback, useEffect } from 'react';
import { Play, ChevronRight, ChevronLeft, Check, Target, Zap, Trophy, Dumbbell, Flame, Heart, Sparkles, Calendar, ChevronDown } from 'lucide-react';
import { Exercise, Level, ExerciseCategory, CATEGORY_LABELS, generateWorkout, EXERCISE_DETAILS } from '../utils/workouts';

const LEVELS: { key: Level; label: string; color: string }[] = [
  { key: 'beginner', label: 'Beginner', color: '#8b9a7b' },
  { key: 'intermediate', label: 'Intermediate', color: '#5a6577' },
  { key: 'advanced', label: 'Advanced', color: '#8b3a3a' },
];

const GOALS: { key: string; label: string; icon: React.ReactNode; categories: ExerciseCategory[]; desc: string; monthFocus: string[] }[] = [
  { key: 'abs', label: 'Get Abs', icon: <Target className="w-6 h-6" />, categories: ['core', 'cardio'], desc: 'Core-focused workouts to build visible abs', monthFocus: ['Core Basics', 'Fat Burn', 'Abs Definition'] },
  { key: 'muscle', label: 'Build Muscle', icon: <Dumbbell className="w-6 h-6" />, categories: ['chest', 'back', 'arms', 'shoulders', 'legs', 'glutes'], desc: 'Strength training for muscle growth', monthFocus: ['Foundation', 'Hypertrophy', 'Strength Peak'] },
  { key: 'lose', label: 'Lose Weight', icon: <Flame className="w-6 h-6" />, categories: ['cardio', 'full-body', 'legs', 'core'], desc: 'High-calorie burn workouts', monthFocus: ['Active Start', 'Fat Burn', 'Peak Burn'] },
  { key: 'strength', label: 'Get Stronger', icon: <Zap className="w-6 h-6" />, categories: ['chest', 'back', 'legs', 'arms', 'shoulders'], desc: 'Compound movements for raw strength', monthFocus: ['Base Strength', 'Power Build', 'Max Strength'] },
  { key: 'tone', label: 'Tone Up', icon: <Heart className="w-6 h-6" />, categories: ['legs', 'glutes', 'arms', 'core'], desc: 'Sculpt and define your body', monthFocus: ['Shape Up', 'Sculpt', 'Define'] },
  { key: 'flexibility', label: 'Stay Active', icon: <Sparkles className="w-6 h-6" />, categories: ['full-body', 'core', 'cardio'], desc: 'General fitness and health', monthFocus: ['Move More', 'Build Habits', 'Stay Strong'] },
];

const LEVEL_PROGRESSION: Level[] = ['beginner', 'intermediate', 'advanced'];
const PLAN_STORAGE = 'habit-tracker-3month-plan';

interface DayWorkout {
  dayName: string;
  exercises: Exercise[];
}

interface WeekPlan {
  week: number;
  label: string;
  days: DayWorkout[];
}

interface MonthPlan {
  month: number;
  level: Level;
  title: string;
  weeks: WeekPlan[];
}

interface ThreeMonthPlan {
  goalKey: string;
  categories: ExerciseCategory[];
  startedAt: number;
  currentDay: number;
  completedDays: string[];
  months: MonthPlan[];
}

function loadPlan(): ThreeMonthPlan | null {
  try {
    const raw = localStorage.getItem(PLAN_STORAGE);
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (
      !p || !Array.isArray(p.months) ||
      p.months.some((m: any) => !Array.isArray(m.weeks) || m.weeks.some((w: any) => !Array.isArray(w.days)))
    ) {
      localStorage.removeItem(PLAN_STORAGE);
      return null;
    }
    if (!p.completedDays) p.completedDays = [];
    return p;
  } catch {
    localStorage.removeItem(PLAN_STORAGE);
    return null;
  }
}

function savePlan(p: ThreeMonthPlan | null) {
  try { if (p) localStorage.setItem(PLAN_STORAGE, JSON.stringify(p)); else localStorage.removeItem(PLAN_STORAGE); } catch {}
}

function generateThreeMonthPlan(goalKey: string, categories: ExerciseCategory[]): ThreeMonthPlan {
  const goal = GOALS.find((g) => g.key === goalKey)!;
  const months: MonthPlan[] = [];
  for (let m = 0; m < 3; m++) {
    const level = LEVEL_PROGRESSION[m];
    const weeks: WeekPlan[] = [];
    for (let w = 0; w < 4; w++) {
      const days: DayWorkout[] = [];
      for (const dayName of ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']) {
        days.push({ dayName, exercises: generateWorkout(categories, level) });
      }
      weeks.push({ week: w + 1, label: `Week ${w + 1}`, days });
    }
    months.push({ month: m + 1, level, title: goal.monthFocus[m], weeks });
  }
  return { goalKey, categories, startedAt: Date.now(), currentDay: 0, completedDays: [], months };
}

function getGlobalDayIndex(plan: ThreeMonthPlan, monthIdx: number, weekIdx: number, dayIdx: number): number {
  let idx = 0;
  for (let m = 0; m < monthIdx; m++) idx += plan.months[m].weeks.length * 5;
  idx += weekIdx * 5 + dayIdx;
  return idx;
}

interface PlanViewProps {
  onStartWorkout: (exercises: Exercise[], name: string) => void;
}

export const PlanView: React.FC<PlanViewProps> = ({ onStartWorkout }) => {
  const saved = loadPlan();
  const [plan, setPlan] = useState<ThreeMonthPlan | null>(saved);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<ExerciseCategory[]>([]);
  const [expandedMonth, setExpandedMonth] = useState<number | null>(saved ? 0 : null);
  const [expandedWeek, setExpandedWeek] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const toggleCategory = useCallback((cat: ExerciseCategory) => {
    setSelectedCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
  }, []);

  const handleGoalSelect = useCallback((goalKey: string) => {
    setSelectedGoal(goalKey);
    const goal = GOALS.find((g) => g.key === goalKey);
    if (goal) setSelectedCategories(goal.categories);
    setStep(2);
  }, []);

  const handleStartPlan = useCallback(() => {
    if (selectedCategories.length === 0 || !selectedGoal) return;
    const newPlan = generateThreeMonthPlan(selectedGoal, selectedCategories);
    setPlan(newPlan);
    savePlan(newPlan);
    setExpandedMonth(0);
  }, [selectedCategories, selectedGoal]);

  const handleStartDay = useCallback((monthIdx: number, weekIdx: number, dayIdx: number, day: DayWorkout) => {
    if (!plan) return;
    const globalIdx = getGlobalDayIndex(plan, monthIdx, weekIdx, dayIdx);
    const updated = { ...plan, currentDay: globalIdx };
    setPlan(updated);
    savePlan(updated);
    onStartWorkout(day.exercises, `${day.dayName} — ${plan.months[monthIdx].title}`);
  }, [plan, onStartWorkout]);

  const handleMarkDone = useCallback((monthIdx: number, weekIdx: number, dayIdx: number) => {
    if (!plan) return;
    const globalIdx = getGlobalDayIndex(plan, monthIdx, weekIdx, dayIdx);
    const key = `${monthIdx}-${weekIdx}-${dayIdx}`;
    const completed = (plan.completedDays || []).includes(key);
    const updated = {
      ...plan,
      completedDays: completed
        ? (plan.completedDays || []).filter((d) => d !== key)
        : [...(plan.completedDays || []), key],
    };
    setPlan(updated);
    savePlan(updated);
  }, [plan]);

  const handleResetPlan = useCallback(() => {
    setPlan(null);
    setStep(1);
    setSelectedGoal(null);
    setSelectedCategories([]);
    setExpandedMonth(null);
    setExpandedWeek(null);
    setExpandedDay(null);
    savePlan(null);
  }, []);

  // ─── Onboarding ─────────────────────────────────────────────
  if (!plan) {
    return (
      <div className="space-y-5 animate-slide-up">
        {step === 1 && (
          <>
            <div className="text-center">
              <h2 className="text-[22px] font-black text-[var(--text-primary)] tracking-tight">What's your goal?</h2>
              <p className="text-[var(--text-muted)] text-[13px] font-medium mt-1">Pick your 3-month fitness goal</p>
            </div>
            <div className="space-y-2">
              {GOALS.map((goal) => (
                <button key={goal.key} onClick={() => handleGoalSelect(goal.key)}
                  className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-card)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all active:scale-[0.98] text-left">
                  <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] shrink-0">{goal.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-[var(--text-primary)]">{goal.label}</p>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{goal.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <h2 className="text-[20px] font-black text-[var(--text-primary)] tracking-tight">Fine-tune your focus</h2>
              <p className="text-[var(--text-muted)] text-[13px] font-medium mt-1">Adjust muscle groups if needed</p>
            </div>
            <div className="flex items-center justify-center gap-2 py-1">
              <div className="h-1.5 w-8 rounded-full bg-[var(--accent)]" />
              <div className="h-1.5 w-4 rounded-full bg-[var(--accent)]/40" />
              <div className="h-1.5 w-4 rounded-full bg-[var(--bg-soft)]" />
            </div>
            <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-card)] p-4">
              <div className="grid grid-cols-3 gap-2">
                {(['chest', 'back', 'shoulders', 'arms', 'core', 'legs', 'glutes', 'cardio', 'full-body'] as ExerciseCategory[]).map((cat) => {
                  const active = selectedCategories.includes(cat);
                  const labels: Record<string, string> = { chest: 'Chest', back: 'Back', shoulders: 'Shoulders', arms: 'Arms', core: 'Abs', legs: 'Legs', glutes: 'Glutes', cardio: 'Cardio', 'full-body': 'Full Body' };
                  const icons: Record<string, string> = { chest: '💪', back: '🔙', shoulders: '🏋️', arms: '💪', core: '🎯', legs: '🦵', glutes: '🍑', cardio: '❤️', 'full-body': '⚡' };
                  return (
                    <button key={cat} onClick={() => toggleCategory(cat)}
                      className={`relative flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all active:scale-95 ${active ? 'bg-[var(--accent)]/15 border-2 border-[var(--accent)]' : 'bg-[var(--bg-soft)] border-2 border-transparent'}`}>
                      {active && <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[var(--accent)] flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" strokeWidth={3} /></div>}
                      <span className="text-[20px]">{icons[cat]}</span>
                      <span className={`text-[11px] font-bold ${active ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>{labels[cat]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(1)} className="flex-1 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-[14px] font-bold bg-[var(--bg-soft)] text-[var(--text-muted)] active:scale-[0.98]">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={() => setStep(3)} disabled={selectedCategories.length === 0}
                className="flex-[2] py-3.5 rounded-2xl flex items-center justify-center gap-2 text-[14px] font-bold text-white active:scale-[0.98] shadow-lg disabled:opacity-40"
                style={{ backgroundColor: selectedCategories.length > 0 ? 'var(--accent)' : 'var(--bg-soft)' }}>
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div>
              <h2 className="text-[20px] font-black text-[var(--text-primary)] tracking-tight">Your 3-Month Plan</h2>
              <p className="text-[var(--text-muted)] text-[13px] font-medium mt-1">Progressive difficulty over 12 weeks</p>
            </div>
            <div className="flex items-center justify-center gap-2 py-1">
              <div className="h-1.5 w-8 rounded-full bg-[var(--accent)]" />
              <div className="h-1.5 w-8 rounded-full bg-[var(--accent)]" />
              <div className="h-1.5 w-8 rounded-full bg-[var(--accent)]" />
            </div>
            <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-card)] p-4 space-y-3">
              {GOALS.find((g) => g.key === selectedGoal)?.monthFocus.map((focus, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[12px] font-black text-white shrink-0" style={{ backgroundColor: LEVELS[i].color }}>M{i + 1}</div>
                  <div>
                    <p className="text-[13px] font-bold text-[var(--text-primary)]">{focus}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">{LEVELS[i].label} · 4 weeks · 5 days/week</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-card)] p-4">
              <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Target Areas</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedCategories.map((c) => (
                  <span key={c} className="px-2.5 py-1 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] text-[11px] font-bold">{CATEGORY_LABELS[c]}</span>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="flex-1 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-[14px] font-bold bg-[var(--bg-soft)] text-[var(--text-muted)] active:scale-[0.98]">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={handleStartPlan} className="flex-[2] py-3.5 rounded-2xl flex items-center justify-center gap-2 text-[14px] font-bold text-white active:scale-[0.98] shadow-lg" style={{ backgroundColor: 'var(--accent)' }}>
                <Play className="w-5 h-5" fill="currentColor" /> Start Plan
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // ─── Active Plan — Full 3-Month View ────────────────────────
  const goal = GOALS.find((g) => g.key === plan.goalKey);
  const totalDays = plan.months.reduce((s, m) => s + m.weeks.length * 5, 0);
  const completedCount = (plan.completedDays || []).length;

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[20px] sm:text-[22px] md:text-[26px] font-black text-[var(--text-primary)] leading-tight tracking-tight">
            {goal?.label || 'My Plan'}
          </h2>
          <p className="text-[var(--text-muted)] text-[13px] font-medium mt-1">
            {completedCount}/{totalDays} days completed
          </p>
        </div>
        <button onClick={handleResetPlan} className="text-[11px] font-bold text-[var(--text-muted)] hover:text-red-500 transition-all">
          Reset
        </button>
      </div>

      {/* Overall progress */}
      <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-card)] p-4">
        <div className="w-full h-2 rounded-full bg-[var(--bg-soft)] overflow-hidden">
          <div className="h-full rounded-full bg-[var(--accent)] transition-all duration-500" style={{ width: `${(completedCount / totalDays) * 100}%` }} />
        </div>
        <p className="text-[11px] text-[var(--text-muted)] mt-1.5 text-center">{Math.round((completedCount / totalDays) * 100)}% complete</p>
      </div>

      {/* All 3 months */}
      {plan.months.map((month, mIdx) => {
        const mColor = LEVELS[mIdx].color;
        const monthCompleted = month.weeks.reduce((ws, w, wIdx) => ws + w.days.filter((_, dIdx) => (plan.completedDays || []).includes(`${mIdx}-${wIdx}-${dIdx}`)).length, 0);
        const monthTotal = month.weeks.length * 5;
        const isExpanded = expandedMonth === mIdx;

        return (
          <div key={mIdx} className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-card)] overflow-hidden">
            {/* Month header */}
            <button
              onClick={() => setExpandedMonth(isExpanded ? null : mIdx)}
              className="w-full flex items-center gap-3 p-4 text-left transition-all hover:bg-[var(--bg-soft)]"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[13px] font-black text-white shrink-0" style={{ backgroundColor: mColor }}>
                M{mIdx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-[var(--text-primary)]">{month.title}</p>
                <p className="text-[11px] text-[var(--text-muted)]">{LEVELS[mIdx].label} · {monthCompleted}/{monthTotal} done</p>
              </div>
              <ChevronDown className={`w-5 h-5 text-[var(--text-muted)] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            {/* Weeks */}
            {isExpanded && (
              <div className="border-t border-[var(--border-soft)]">
                {month.weeks.map((week, wIdx) => {
                  const weekKey = `${mIdx}-${wIdx}`;
                  const weekExpanded = expandedWeek === weekKey;

                  return (
                    <div key={wIdx}>
                      {/* Week header */}
                      <button
                        onClick={() => setExpandedWeek(weekExpanded ? null : weekKey)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left border-b border-[var(--border-soft)] transition-all hover:bg-[var(--bg-soft)]"
                      >
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: `${mColor}20`, color: mColor }}>
                          {wIdx + 1}
                        </div>
                        <span className="text-[12px] font-bold text-[var(--text-primary)] flex-1">Week {wIdx + 1}</span>
                        <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${weekExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Days */}
                      {weekExpanded && (
                        <div className="bg-[var(--bg)]">
                          {week.days.map((day, dIdx) => {
                            const dayKey = `${mIdx}-${wIdx}-${dIdx}`;
                            const isDone = (plan.completedDays || []).includes(dayKey);
                            const isDayExpanded = expandedDay === dayKey;
                            const exCount = day.exercises.filter((e) => !e.name.toLowerCase().includes('rest')).length;

                            return (
                              <div key={dIdx} className="border-b border-[var(--border-soft)] last:border-b-0">
                                {/* Day header */}
                                <div className="flex items-center gap-3 px-4 py-3">
                                  <button
                                    onClick={() => handleMarkDone(mIdx, wIdx, dIdx)}
                                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-90 ${
                                      isDone ? 'text-white' : 'border-2 border-[var(--border-medium)]'
                                    }`}
                                    style={isDone ? { backgroundColor: mColor } : {}}
                                  >
                                    {isDone && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                                  </button>
                                  <button
                                    onClick={() => setExpandedDay(isDayExpanded ? null : dayKey)}
                                    className="flex-1 text-left"
                                  >
                                    <p className={`text-[13px] font-bold ${isDone ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-primary)]'}`}>
                                      {day.dayName}
                                    </p>
                                    <p className="text-[10px] text-[var(--text-muted)]">{exCount} exercises</p>
                                  </button>
                                  <button
                                    onClick={() => handleStartDay(mIdx, wIdx, dIdx, day)}
                                    className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-white active:scale-95 transition-all"
                                    style={{ backgroundColor: mColor }}
                                  >
                                    Start
                                  </button>
                                </div>

                                {/* Expanded exercises */}
                                {isDayExpanded && (
                                  <div className="px-4 pb-3 space-y-1.5">
                                    {day.exercises
                                      .filter((e) => !e.name.toLowerCase().includes('rest'))
                                      .map((ex, i) => {
                                        const detail = EXERCISE_DETAILS[ex.name];
                                        return (
                                          <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[var(--bg-soft)]">
                                            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                                              style={{ backgroundColor: mColor }}>
                                              {i + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <p className="text-[12px] font-medium text-[var(--text-primary)] truncate">{ex.name}</p>
                                              {detail && <p className="text-[10px] text-[var(--text-muted)] truncate">{detail.musclesWorked}</p>}
                                            </div>
                                            <span className="text-[10px] text-[var(--text-muted)] shrink-0">{ex.duration}</span>
                                          </div>
                                        );
                                      })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
