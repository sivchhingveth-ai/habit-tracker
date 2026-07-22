import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Play, ChevronRight, ChevronLeft, Check, Target, Zap, Trophy, Dumbbell, Flame, Heart, Sparkles, Calendar, ChevronDown, Flag, SlidersHorizontal, X, RefreshCw, Search } from 'lucide-react';
import { Exercise, Level, ExerciseCategory, CATEGORY_LABELS, generateWorkout, EXERCISE_DETAILS, getWarmupForDay, ALL_EXERCISES } from '../utils/workouts';
import { ExerciseDetail } from './ExerciseDetail';
import { estimateCaloriesBurned } from '../utils/fitnessData';
import { getPlanProgress, PlanProgress, PLAN_PROGRESS_EVENT } from '../utils/planProgress';

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

const DURATIONS: { key: number; label: string; shortLabel: string; desc: string; weeks: number; levelPath: Level[]; goalTips: string[] }[] = [
  { key: 1, label: '1 Month', shortLabel: '1 Mo', desc: 'Quick kickstart — build the habit', weeks: 4, levelPath: ['beginner'], goalTips: ['Learn the basics', 'Build consistency', 'Form good habits'] },
  { key: 2, label: '2 Months', shortLabel: '2 Mo', desc: 'Solid foundation — see real results', weeks: 8, levelPath: ['beginner', 'intermediate'], goalTips: ['Build base strength', 'Increase intensity', 'See visible change'] },
  { key: 3, label: '3 Months', shortLabel: '3 Mo', desc: 'Full transformation — max results', weeks: 12, levelPath: ['beginner', 'intermediate', 'advanced'], goalTips: ['Master form', 'Progressive overload', 'Peak performance'] },
];

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
  durationMonths: number;
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
    if (!p.durationMonths) p.durationMonths = p.months.length || 3;
    return p;
  } catch {
    localStorage.removeItem(PLAN_STORAGE);
    return null;
  }
}

function savePlan(p: ThreeMonthPlan | null) {
  try { if (p) localStorage.setItem(PLAN_STORAGE, JSON.stringify(p)); else localStorage.removeItem(PLAN_STORAGE); } catch {}
}

function generateThreeMonthPlan(goalKey: string, categories: ExerciseCategory[], durationMonths: number): ThreeMonthPlan {
  const goal = GOALS.find((g) => g.key === goalKey)!;
  const dur = DURATIONS.find((d) => d.key === durationMonths) || DURATIONS[2];
  const months: MonthPlan[] = [];
  for (let m = 0; m < dur.levelPath.length; m++) {
    const level = dur.levelPath[m];
    const weeks: WeekPlan[] = [];
    for (let w = 0; w < 4; w++) {
      const days: DayWorkout[] = [];
      for (const dayName of ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']) {
        days.push({ dayName, exercises: generateWorkout(categories, level) });
      }
      weeks.push({ week: w + 1, label: `Week ${w + 1}`, days });
    }
    months.push({ month: m + 1, level, title: goal.monthFocus[m] || goal.monthFocus[goal.monthFocus.length - 1], weeks });
  }
  return { goalKey, categories, durationMonths, startedAt: Date.now(), currentDay: 0, completedDays: [], months };
}

function getGlobalDayIndex(plan: ThreeMonthPlan, monthIdx: number, weekIdx: number, dayIdx: number): number {
  let idx = 0;
  for (let m = 0; m < monthIdx; m++) idx += plan.months[m].weeks.length * 5;
  idx += weekIdx * 5 + dayIdx;
  return idx;
}

function getDayExercises(day: DayWorkout, dayNumber: number): { warmup: Exercise[]; main: Exercise[] } {
  const main = day.exercises.filter((e) => !e.name.toLowerCase().includes('rest'));
  const warmup = getWarmupForDay(dayNumber, main.map((e) => e.name));
  return { warmup, main };
}

function getDayStats(day: DayWorkout, dayNumber: number): { count: number; mins: number; kcal: number } {
  const { warmup, main } = getDayExercises(day, dayNumber);
  const all = [...warmup, ...main];
  const totalSec = all.reduce((s, e) => s + (parseInt(e.duration) || 30) + 10, 0);
  const kcal = all.reduce((s, e) => s + estimateCaloriesBurned(e.name, parseInt(e.duration) || 30), 0);
  return { count: all.length, mins: Math.max(1, Math.round(totalSec / 60)), kcal };
}

const ProgressRing: React.FC<{ percent: number; color: string; checkColor?: string; size?: number }> = ({ percent, color, checkColor = '#ffffff', size = 46 }) => {
  if (percent >= 100) {
    return (
      <div className="rounded-full flex items-center justify-center shrink-0" style={{ width: size, height: size, backgroundColor: color }}>
        <Check className="w-5 h-5" strokeWidth={3} style={{ color: checkColor }} />
      </div>
    );
  }
  const stroke = 3.5;
  const r = (size - stroke * 2) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeOpacity={0.22} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - percent / 100)} className="transition-all duration-500" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold" style={{ color }}>{percent}%</span>
    </div>
  );
};

interface PlanViewProps {
  onStartWorkout: (exercises: Exercise[], name: string, dayKey?: string) => void;
}

export const PlanView: React.FC<PlanViewProps> = ({ onStartWorkout }) => {
  const [plan, setPlan] = useState<ThreeMonthPlan | null>(loadPlan);
  const [progress, setProgress] = useState<PlanProgress>(getPlanProgress);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number>(3);
  const [selectedCategories, setSelectedCategories] = useState<ExerciseCategory[]>([]);
  const [expandedMonth, setExpandedMonth] = useState<number | null>(plan ? 0 : null);
  const [detailDay, setDetailDay] = useState<string | null>(null);
  const [detailExIdx, setDetailExIdx] = useState<number | null>(null);
  const [showCustomize, setShowCustomize] = useState(false);
  const [custCategories, setCustCategories] = useState<ExerciseCategory[]>([]);
  const [custLevel, setCustLevel] = useState<Level>('beginner');
  const [celebrateDay, setCelebrateDay] = useState<number | null>(null);
  const completedRef = useRef<Set<string>>(new Set(plan?.completedDays || []));
  const [replaceExercise, setReplaceExercise] = useState<{ dayKey: string; exerciseIdx: number; exercise: Exercise } | null>(null);
  const [replaceSearch, setReplaceSearch] = useState('');

  useEffect(() => {
    const handler = () => {
      const fresh = loadPlan();
      if (fresh) {
        const added = (fresh.completedDays || []).find((k) => !completedRef.current.has(k));
        completedRef.current = new Set(fresh.completedDays || []);
        if (added) {
          const [am, aw, ad] = added.split('-').map(Number);
          setCelebrateDay(getGlobalDayIndex(fresh, am, aw, ad) + 1);
        }
      } else {
        completedRef.current = new Set();
      }
      setPlan(fresh);
      setProgress(getPlanProgress());
    };
    window.addEventListener(PLAN_PROGRESS_EVENT, handler);
    return () => window.removeEventListener(PLAN_PROGRESS_EVENT, handler);
  }, []);

  const toggleCategory = useCallback((cat: ExerciseCategory) => {
    setSelectedCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
  }, []);

  const handleGoalSelect = useCallback((goalKey: string) => {
    setSelectedGoal(goalKey);
    const goal = GOALS.find((g) => g.key === goalKey);
    if (goal) setSelectedCategories(goal.categories);
    setStep(2);
  }, []);

  const handleDurationSelect = useCallback((months: number) => {
    setSelectedDuration(months);
    setStep(3);
  }, []);

  const handleStartPlan = useCallback(() => {
    if (selectedCategories.length === 0 || !selectedGoal) return;
    const newPlan = generateThreeMonthPlan(selectedGoal, selectedCategories, selectedDuration);
    setPlan(newPlan);
    savePlan(newPlan);
    setExpandedMonth(0);
  }, [selectedCategories, selectedGoal, selectedDuration]);

  const handleStartDay = useCallback((monthIdx: number, weekIdx: number, dayIdx: number, day: DayWorkout) => {
    if (!plan) return;
    const globalIdx = getGlobalDayIndex(plan, monthIdx, weekIdx, dayIdx);
    const { warmup, main } = getDayExercises(day, globalIdx + 1);
    const updated = { ...plan, currentDay: globalIdx };
    setPlan(updated);
    savePlan(updated);
    onStartWorkout([...warmup, ...main], `Day ${globalIdx + 1} — ${plan.months[monthIdx].title}`, `${monthIdx}-${weekIdx}-${dayIdx}`);
  }, [plan, onStartWorkout]);

  const handleResetPlan = useCallback(() => {
    setPlan(null);
    setStep(1);
    setSelectedGoal(null);
    setSelectedDuration(3);
    setSelectedCategories([]);
    setExpandedMonth(null);
    setDetailDay(null);
    setDetailExIdx(null);
    setShowCustomize(false);
    setCelebrateDay(null);
    completedRef.current = new Set();
    savePlan(null);
  }, []);

  const openCustomize = useCallback(() => {
    if (!plan) return;
    setCustCategories(plan.categories || []);
    setCustLevel(plan.months[0]?.level || 'beginner');
    setShowCustomize(true);
  }, [plan]);

  const toggleCustCategory = useCallback((cat: ExerciseCategory) => {
    setCustCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
  }, []);

  const handleReplaceExercise = useCallback((dayKey: string, exerciseIdx: number, newExercise: Exercise) => {
    if (!plan) return;
    const [m, w, d] = dayKey.split('-').map(Number);
    const updated = { ...plan, months: plan.months.map((mo, mi) => mi === m ? { ...mo, weeks: mo.weeks.map((wk, wi) => wi === w ? { ...wk, days: wk.days.map((dy, di) => di === d ? { ...dy, exercises: dy.exercises.map((ex, ei) => ei === exerciseIdx ? { ...newExercise, duration: ex.duration } : ex) } : dy) } : wk) } : mo) };
    setPlan(updated);
    savePlan(updated);
    setReplaceExercise(null);
    setReplaceSearch('');
  }, [plan]);

  const handleSaveCustomize = useCallback(() => {
    if (!plan || custCategories.length === 0) return;
    const done = new Set(plan.completedDays || []);
    const updated: ThreeMonthPlan = {
      ...plan,
      categories: custCategories,
      months: plan.months.map((m, mi) => ({
        ...m,
        level: custLevel,
        weeks: m.weeks.map((wk, wi) => ({
          ...wk,
          // Keep the exercises of days already completed; regenerate the rest
          days: wk.days.map((dy, di) => done.has(`${mi}-${wi}-${di}`)
            ? dy
            : { ...dy, exercises: generateWorkout(custCategories, custLevel) }),
        })),
      })),
    };
    setPlan(updated);
    savePlan(updated);
    setShowCustomize(false);
  }, [plan, custCategories, custLevel]);

  // ─── Onboarding ─────────────────────────────────────────────
  if (!plan) {
    return (
      <div className="space-y-5 animate-slide-up">
        {step === 1 && (
          <>
            <div className="text-center">
              <h2 className="text-[22px] font-black text-[var(--text-primary)] tracking-tight">What's your goal?</h2>
              <p className="text-[var(--text-muted)] text-[13px] font-semibold mt-1">Pick your fitness goal</p>
            </div>
            <div className="flex items-center justify-center gap-2 py-1">
              <div className="h-1.5 w-8 rounded-full bg-[var(--brand)]" />
              <div className="h-1.5 w-4 rounded-full bg-[var(--border-medium)]" />
              <div className="h-1.5 w-4 rounded-full bg-[var(--border-soft)]" />
              <div className="h-1.5 w-4 rounded-full bg-[var(--border-soft)]" />
            </div>
            <div className="space-y-2.5">
              {GOALS.map((goal) => (
                <button key={goal.key} onClick={() => handleGoalSelect(goal.key)}
                  className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-card)] hover:border-[var(--border-medium)] hover:shadow-sm transition-all active:scale-[0.98] text-left">
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-extrabold text-[var(--text-primary)]">{goal.label}</p>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5 font-medium">{goal.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="text-center">
              <h2 className="text-[22px] font-black text-[var(--text-primary)] tracking-tight">How long?</h2>
              <p className="text-[var(--text-muted)] text-[13px] font-semibold mt-1">Choose your plan duration</p>
            </div>
            <div className="flex items-center justify-center gap-2 py-1">
              <div className="h-1.5 w-8 rounded-full bg-[var(--brand)]" />
              <div className="h-1.5 w-8 rounded-full bg-[var(--brand)]" />
              <div className="h-1.5 w-4 rounded-full bg-[var(--border-medium)]" />
              <div className="h-1.5 w-4 rounded-full bg-[var(--border-soft)]" />
            </div>
            <div className="space-y-2.5">
              {DURATIONS.map((dur) => (
                <button key={dur.key} onClick={() => handleDurationSelect(dur.key)}
                  className="w-full rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-card)] overflow-hidden transition-all active:scale-[0.98] text-left hover:border-[var(--border-medium)] hover:shadow-sm">
                  <div className="flex items-center gap-4 px-4 py-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${dur.key === 1 ? '#6fa83b' : dur.key === 2 ? '#4e55e0' : '#d05a96'}12`, border: `1px solid ${dur.key === 1 ? '#6fa83b' : dur.key === 2 ? '#4e55e0' : '#d05a96'}25` }}>
                      <span className="text-[16px] font-black" style={{ color: dur.key === 1 ? '#6fa83b' : dur.key === 2 ? '#4e55e0' : '#d05a96' }}>{dur.key}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-extrabold text-[var(--text-primary)]">{dur.label}</p>
                      <p className="text-[11px] text-[var(--text-muted)] mt-0.5 font-medium">{dur.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                  </div>
                  <div className="px-4 pb-3 flex gap-1.5 flex-wrap">
                    {dur.goalTips.map((tip, i) => (
                      <span key={i} className="text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[var(--bg-soft)] text-[var(--text-muted)]">{tip}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(1)} className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 text-[14px] font-bold bg-[var(--bg-soft)] border border-[var(--border-soft)] text-[var(--text-muted)] active:scale-[0.98]">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <div>
              <h2 className="text-[22px] font-black text-[var(--text-primary)] tracking-tight">Fine-tune your focus</h2>
              <p className="text-[var(--text-muted)] text-[13px] font-semibold mt-1">Adjust muscle groups if needed</p>
            </div>
            <div className="flex items-center justify-center gap-2 py-1">
              <div className="h-1.5 w-8 rounded-full bg-[var(--brand)]" />
              <div className="h-1.5 w-8 rounded-full bg-[var(--brand)]" />
              <div className="h-1.5 w-8 rounded-full bg-[var(--brand)]" />
              <div className="h-1.5 w-4 rounded-full bg-[var(--border-soft)]" />
            </div>
            <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-card)] p-4">
              <div className="grid grid-cols-3 gap-2">
                {(['chest', 'back', 'shoulders', 'arms', 'core', 'legs', 'glutes', 'cardio', 'full-body'] as ExerciseCategory[]).map((cat) => {
                  const active = selectedCategories.includes(cat);
                  const labels: Record<string, string> = { chest: 'Chest', back: 'Back', shoulders: 'Shoulders', arms: 'Arms', core: 'Abs', legs: 'Legs', glutes: 'Glutes', cardio: 'Cardio', 'full-body': 'Full Body' };
                  return (
                    <button key={cat} onClick={() => toggleCategory(cat)}
                      className={`relative flex flex-col items-center justify-center gap-1.5 py-4 px-2 rounded-xl transition-all active:scale-95 border ${
                        active ? 'bg-[var(--brand)]/10 border-[var(--brand)]/40 shadow-md' : 'bg-[var(--bg-card)] border-[var(--border-soft)] hover:border-[var(--border-medium)]'
                      }`}>
                      {active && <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[var(--brand)] flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" strokeWidth={3} /></div>}
                      <span className={`text-[12px] font-extrabold ${active ? 'text-[var(--brand)]' : 'text-[var(--text-secondary)]'}`}>{labels[cat]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(2)} className="flex-1 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-[14px] font-bold bg-[var(--bg-soft)] border border-[var(--border-soft)] text-[var(--text-muted)] active:scale-[0.98]">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={() => setStep(4)} disabled={selectedCategories.length === 0}
                className="flex-[2] py-3.5 rounded-2xl flex items-center justify-center gap-2 text-[14px] font-extrabold active:scale-[0.98] shadow-lg border transition-all disabled:cursor-not-allowed"
                style={selectedCategories.length > 0
                  ? { backgroundColor: 'var(--text-primary)', color: 'var(--bg-card)', borderColor: 'transparent' }
                  : { backgroundColor: 'var(--bg-soft)', color: 'var(--text-muted)', borderColor: 'var(--border-soft)' }
                }>
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div>
              <h2 className="text-[22px] font-black text-[var(--text-primary)] tracking-tight">Your {selectedDuration}-Month Plan</h2>
              <p className="text-[var(--text-muted)] text-[13px] font-semibold mt-1">Progressive difficulty over {selectedDuration * 4} weeks</p>
            </div>
            <div className="flex items-center justify-center gap-2 py-1">
              <div className="h-1.5 w-8 rounded-full bg-[var(--brand)]" />
              <div className="h-1.5 w-8 rounded-full bg-[var(--brand)]" />
              <div className="h-1.5 w-8 rounded-full bg-[var(--brand)]" />
              <div className="h-1.5 w-8 rounded-full bg-[var(--brand)]" />
            </div>
            <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-card)] p-4 space-y-3">
              {(() => {
                const dur = DURATIONS.find((d) => d.key === selectedDuration) || DURATIONS[2];
                const goal = GOALS.find((g) => g.key === selectedGoal);
                return dur.levelPath.map((level, i) => {
                  const lvl = LEVELS.find((l) => l.key === level) || LEVELS[0];
                  const focus = goal?.monthFocus[i] || goal?.monthFocus[goal.monthFocus.length - 1] || 'Build Strength';
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[12px] font-black text-white shrink-0 shadow-sm" style={{ backgroundColor: lvl.color }}>M{i + 1}</div>
                      <div>
                        <p className="text-[13px] font-extrabold text-[var(--text-primary)]">{focus}</p>
                        <p className="text-[11px] text-[var(--text-muted)] font-medium">{lvl.label} · 4 weeks · 5 days/week</p>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
            <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-card)] p-4">
              <p className="text-[10px] font-extrabold text-[var(--text-muted)] uppercase tracking-[0.15em] mb-2.5">Target Areas</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedCategories.map((c) => (
                  <span key={c} className="px-2.5 py-1 rounded-lg bg-[var(--bg-soft)] text-[var(--text-secondary)] text-[11px] font-bold">{CATEGORY_LABELS[c]}</span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-card)] p-4">
              <p className="text-[10px] font-extrabold text-[var(--text-muted)] uppercase tracking-[0.15em] mb-2.5">What to Expect</p>
              <div className="space-y-2.5">
                {DURATIONS.find((d) => d.key === selectedDuration)?.goalTips.map((tip, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[var(--brand)]/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[var(--brand)]" strokeWidth={3} />
                    </div>
                    <span className="text-[12px] font-semibold text-[var(--text-secondary)]">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(3)} className="flex-1 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-[14px] font-bold bg-[var(--bg-soft)] border border-[var(--border-soft)] text-[var(--text-muted)] active:scale-[0.98]">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button onClick={handleStartPlan} className="flex-[2] py-3.5 rounded-2xl flex items-center justify-center gap-2 text-[14px] font-extrabold active:scale-[0.98] shadow-lg border transition-all hover:brightness-110"
                style={{ backgroundColor: 'var(--text-primary)', color: 'var(--bg-card)', borderColor: 'transparent' }}>
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

  const dayPercent = (key: string): number => {
    if ((plan.completedDays || []).includes(key)) return 100;
    const p = progress[key];
    if (!p || !p.total) return 0;
    return Math.min(100, Math.round((p.done / p.total) * 100));
  };

  // First not-fully-completed day = the active "up next" day
  let currentKey: string | null = null;
  outer: for (let m = 0; m < plan.months.length; m++) {
    for (let w = 0; w < plan.months[m].weeks.length; w++) {
      for (let d = 0; d < plan.months[m].weeks[w].days.length; d++) {
        const key = `${m}-${w}-${d}`;
        if (dayPercent(key) < 100) { currentKey = key; break outer; }
      }
    }
  }

  // Current month/level indicator
  const currentMonthIdx = (() => {
    for (let m = 0; m < plan.months.length; m++) {
      for (let w = 0; w < plan.months[m].weeks.length; w++) {
        for (let d = 0; d < plan.months[m].weeks[w].days.length; d++) {
          const key = `${m}-${w}-${d}`;
          if (dayPercent(key) < 100) return m;
        }
      }
    }
    return plan.months.length - 1;
  })();
  const currentMonth = plan.months[currentMonthIdx];
  const currentLevel = LEVELS.find((l) => l.key === currentMonth?.level);

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Plan Badge */}
      <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-soft)] shadow-sm">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[14px] font-black text-white shrink-0 shadow-md" style={{ backgroundColor: currentLevel?.color || LEVELS[0].color }}>
          {currentMonthIdx + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-[14px] sm:text-[15px] font-extrabold text-[var(--text-primary)] truncate">{goal?.label || 'My Plan'}</p>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest shrink-0" style={{ backgroundColor: `${currentLevel?.color || LEVELS[0].color}18`, color: currentLevel?.color || LEVELS[0].color }}>
              {currentLevel?.label || 'Beginner'}
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-0.5 font-medium">Month {currentMonthIdx + 1} of {plan.months.length} — {currentMonth?.title}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[18px] sm:text-[20px] font-black text-[var(--text-primary)] leading-none">{Math.round((completedCount / totalDays) * 100)}%</p>
          <p className="text-[9px] text-[var(--text-muted)] mt-0.5 font-semibold tracking-wider uppercase">done</p>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[22px] sm:text-[24px] md:text-[28px] font-black text-[var(--text-primary)] leading-tight tracking-tight">
            {goal?.label || 'My Plan'}
          </h2>
          <p className="text-[var(--text-muted)] text-[13px] font-semibold mt-1">
            {completedCount}/{totalDays} days completed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openCustomize}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[var(--bg-card)] border border-[var(--border-soft)] text-[11px] font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-soft)] transition-all active:scale-95"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" /> Customize
          </button>
          <button onClick={handleResetPlan} className="text-[11px] font-bold text-[var(--text-muted)] hover:text-[var(--accent-deep)] transition-all">
            Reset
          </button>
        </div>
      </div>

      {/* Overall progress */}
      <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-soft)] p-4 shadow-sm">
        <div className="w-full h-2.5 rounded-full bg-[var(--bg-soft)] overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(completedCount / totalDays) * 100}%`, backgroundColor: currentLevel?.color || 'var(--brand)' }} />
        </div>
        <p className="text-[11px] text-[var(--text-muted)] mt-2 text-center font-semibold">{Math.round((completedCount / totalDays) * 100)}% complete</p>
      </div>

      {/* All months */}
      {plan.months.map((month, mIdx) => {
        const mColor = LEVELS[mIdx].color;
        const monthCompleted = month.weeks.reduce((ws, w, wIdx) => ws + w.days.filter((_, dIdx) => (plan.completedDays || []).includes(`${mIdx}-${wIdx}-${dIdx}`)).length, 0);
        const monthTotal = month.weeks.length * 5;
        const isExpanded = expandedMonth === mIdx;

        // A month is locked if the previous month is not fully completed
        const isLocked = mIdx > 0 && (() => {
          const prevMonth = plan.months[mIdx - 1];
          const prevTotal = prevMonth.weeks.length * 5;
          const prevDone = prevMonth.weeks.reduce((ws, w, wIdx) => ws + w.days.filter((_, dIdx) => (plan.completedDays || []).includes(`${mIdx - 1}-${wIdx}-${dIdx}`)).length, 0);
          return prevDone < prevTotal;
        })();

        return (
          <div key={mIdx} className={`rounded-2xl bg-[var(--bg-card)] border border-[var(--border-soft)] overflow-hidden shadow-sm ${isLocked ? 'opacity-50' : ''}`}>
            {/* Month header */}
            <button
              onClick={() => setExpandedMonth(isExpanded ? null : mIdx)}
              className="w-full flex items-center gap-3 p-4 text-left transition-all hover:bg-[var(--bg-tint)]"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[13px] font-black text-white shrink-0 shadow-sm" style={{ backgroundColor: mColor }}>
                M{mIdx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-extrabold text-[var(--text-primary)]">{month.title}</p>
                  {isLocked && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-[var(--bg-soft)] text-[var(--text-muted)]">Locked</span>
                  )}
                </div>
                <p className="text-[11px] text-[var(--text-muted)] font-medium mt-0.5">{LEVELS.find((l) => l.key === month.level)?.label || LEVELS[mIdx].label} · {monthCompleted}/{monthTotal} done</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${mColor}15` }}>
                  <span className="text-[11px] font-black" style={{ color: mColor }}>{Math.round((monthCompleted / monthTotal) * 100)}%</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-[var(--text-muted)] transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {/* Weeks */}
            {isExpanded && (
              <div className="border-t border-[var(--border-soft)] px-3 pb-3">
                {month.weeks.map((week, wIdx) => {
                  const weekDone = week.days.filter((_, dIdx) => dayPercent(`${mIdx}-${wIdx}-${dIdx}`) >= 100).length;

                  return (
                    <div key={wIdx} className="space-y-2">
                      {/* Week header */}
                      <div className="flex items-center gap-2.5 px-1 pt-4 pb-1">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: weekDone === week.days.length ? `${mColor}20` : 'var(--bg-soft)' }}>
                          <Flag className="w-3.5 h-3.5" style={{ color: weekDone === week.days.length ? mColor : 'var(--text-muted)' }} fill={weekDone === week.days.length ? mColor : 'none'} />
                        </div>
                        <span className="text-[10px] font-extrabold tracking-[0.15em] uppercase text-[var(--text-muted)] flex-1">Week {week.week}</span>
                        <span className="text-[13px] font-black">
                          <span className="text-[var(--text-primary)]">{weekDone}</span>
                          <span className="text-[var(--text-muted)]">/{week.days.length}</span>
                        </span>
                      </div>

                      {/* Day cards */}
                      {week.days.map((day, dIdx) => {
                        const dayKey = `${mIdx}-${wIdx}-${dIdx}`;
                        const percent = dayPercent(dayKey);
                        const isCurrent = dayKey === currentKey && !isLocked;
                        const dayNum = getGlobalDayIndex(plan, mIdx, wIdx, dIdx) + 1;
                        const stats = getDayStats(day, dayNum);

                        if (isCurrent) {
                          return (
                            <div key={dIdx} className="rounded-2xl overflow-hidden shadow-lg border border-[var(--border-soft)]" style={{ backgroundColor: 'var(--bg-card)' }}>
                              <div className="flex items-center gap-3 px-5 py-4">
                                <button onClick={() => setDetailDay(dayKey)} className="flex-1 min-w-0 text-left">
                                  <p className="text-[22px] font-black text-[var(--text-primary)] leading-tight tracking-tight">Day {dayNum}</p>
                                  <p className="text-[12px] font-semibold text-[var(--text-muted)] mt-1">{stats.mins} mins · {stats.kcal} kcal{percent > 0 ? ` · ${percent}%` : ''}</p>
                                </button>
                                <button
                                  onClick={() => setDetailDay(dayKey)}
                                  className="px-6 py-2.5 rounded-full text-[13px] font-extrabold shadow-md active:scale-95 transition-all shrink-0"
                                  style={{ backgroundColor: mColor, color: '#ffffff' }}
                                >
                                  Start
                                </button>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <button
                            key={dIdx}
                            onClick={() => setDetailDay(dayKey)}
                            className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[var(--bg-soft)] border border-[var(--border-soft)] text-left transition-all hover:bg-[var(--bg-card)] hover:border-[var(--border-medium)] active:scale-[0.99]"
                          >
                            <div className="flex-1 min-w-0">
                              <p className={`text-[16px] font-extrabold tracking-tight ${percent >= 100 ? 'text-[var(--text-muted)]' : isLocked ? 'text-[var(--text-muted)] opacity-60' : 'text-[var(--text-primary)]'}`}>
                                Day {dayNum}
                              </p>
                              <p className="text-[11px] font-medium text-[var(--text-muted)]">{stats.count} exercises · {stats.mins} mins · {stats.kcal} kcal</p>
                            </div>
                            {isLocked ? (
                              <div className="w-8 h-8 rounded-full bg-[var(--bg-card)] border border-[var(--border-soft)] flex items-center justify-center shrink-0">
                                <svg className="w-3.5 h-3.5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              </div>
                            ) : (
                              <ProgressRing percent={percent} color={mColor} checkColor="#ffffff" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {/* ─── Day Detail Overlay ─── */}
      {detailDay && (() => {
        const [m, w, d] = detailDay.split('-').map(Number);
        const month = plan.months[m];
        const day = month?.weeks[w]?.days[d];
        if (!day) return null;
        const percent = dayPercent(detailDay);
        const dayNum = getGlobalDayIndex(plan, m, w, d) + 1;
        const stats = getDayStats(day, dayNum);
        const { warmup, main } = getDayExercises(day, dayNum);

        // Check if this month is locked
        const dayMonthLocked = m > 0 && (() => {
          const prevMonth = plan.months[m - 1];
          const prevTotal = prevMonth.weeks.length * 5;
          const prevDone = prevMonth.weeks.reduce((ws, w, wIdx) => ws + w.days.filter((_, dIdx) => (plan.completedDays || []).includes(`${m - 1}-${wIdx}-${dIdx}`)).length, 0);
          return prevDone < prevTotal;
        })();

        const exRow = (ex: Exercise, combinedIdx: number, displayNum: number, originalIdx: number) => {
          const det = EXERCISE_DETAILS[ex.name];
          const mColor = LEVELS[m].color;
          return (
            <div key={combinedIdx} className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setDetailExIdx(combinedIdx)}
                className="flex-1 flex items-center gap-3 px-3.5 sm:px-4 py-3.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-soft)] text-left transition-all hover:border-[var(--border-medium)] active:scale-[0.99]"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-black text-white shrink-0" style={{ backgroundColor: `${mColor}20`, color: mColor }}>{displayNum}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-extrabold text-[var(--text-primary)] truncate">{ex.name}</p>
                  {det && <p className="text-[11px] text-[var(--text-muted)] truncate mt-0.5 font-medium">{det.musclesWorked}</p>}
                </div>
                <span className="text-[11px] font-bold text-[var(--text-muted)] shrink-0">{ex.duration}</span>
                <ChevronRight className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
              </button>
              <button
                onClick={() => setReplaceExercise({ dayKey: detailDay!, exerciseIdx: originalIdx, exercise: ex })}
                className="w-11 h-11 rounded-xl bg-[var(--bg-soft)] border border-[var(--border-soft)] flex items-center justify-center shrink-0 transition-all hover:bg-[var(--bg-card)] active:scale-90 touch-manipulation"
                title="Replace exercise"
              >
                <RefreshCw className="w-4 h-4 text-[var(--text-muted)]" />
              </button>
            </div>
          );
        };

        return (
          <div className="fixed inset-0 z-[150] flex flex-col animate-fade-in" style={{ background: 'linear-gradient(160deg, var(--bg-page) 0%, var(--bg-card) 55%, var(--bg-page) 100%)' }}>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="max-w-2xl mx-auto px-5 pt-5 pb-40 safe-area-top">
                {/* Back */}
                <button
                  onClick={() => { setDetailDay(null); setDetailExIdx(null); }}
                  className="w-11 h-11 rounded-full bg-[var(--bg-card)] border border-[var(--border-soft)] flex items-center justify-center text-[var(--text-primary)] transition-all active:scale-90"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Title */}
                <div className="mt-6 flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-[34px] font-black text-[var(--text-primary)] tracking-tight leading-none">Day {dayNum}</h2>
                    <p className="text-[13px] font-semibold text-[var(--text-muted)] mt-2.5">{month.title} · Week {w + 1}</p>
                  </div>
                  {percent >= 100 ? (
                    <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-extrabold shrink-0" style={{ backgroundColor: LEVELS[m].color, color: '#ffffff' }}>
                      <Check className="w-3.5 h-3.5" strokeWidth={3} /> 100%
                    </div>
                  ) : percent > 0 ? (
                    <div className="px-3.5 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-soft)] text-[var(--text-primary)] text-[12px] font-extrabold shrink-0">{percent}%</div>
                  ) : null}
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-3 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-soft)] py-5 divide-x divide-[var(--border-soft)]">
                  <div className="text-center px-2">
                    <p className="text-[22px] font-black text-[var(--text-primary)] leading-none">{stats.count}</p>
                    <p className="text-[11px] font-semibold text-[var(--text-muted)] mt-1.5">Exercises</p>
                  </div>
                  <div className="text-center px-2">
                    <p className="text-[22px] font-black text-[var(--text-primary)] leading-none">{stats.mins} <span className="text-[13px] font-bold">mins</span></p>
                    <p className="text-[11px] font-semibold text-[var(--text-muted)] mt-1.5">Duration</p>
                  </div>
                  <div className="text-center px-2">
                    <p className="text-[22px] font-black text-[var(--text-primary)] leading-none">{stats.kcal} <span className="text-[13px] font-bold">kcal</span></p>
                    <p className="text-[11px] font-semibold text-[var(--text-muted)] mt-1.5">Calories</p>
                  </div>
                </div>

                {/* Warm-up */}
                {warmup.length > 0 && (
                  <>
                    <p className="text-[16px] font-extrabold text-[var(--text-primary)] mt-8 mb-3 tracking-tight">Warm-up</p>
                    <div className="space-y-2">
                      {warmup.map((ex, i) => exRow(ex, i, i + 1, i))}
                    </div>
                  </>
                )}

                {/* Exercises */}
                <p className="text-[16px] font-extrabold text-[var(--text-primary)] mt-7 mb-3 tracking-tight">Exercises</p>
                <div className="space-y-2">
                  {main.map((ex, i) => exRow(ex, warmup.length + i, i + 1, warmup.length + i))}
                </div>
              </div>
            </div>

            {/* START */}
            <div className="absolute bottom-0 inset-x-0 px-5 pb-6 pt-12 bg-gradient-to-t from-[var(--bg-page)] via-[var(--bg-page)]/85 to-transparent">
              {dayMonthLocked ? (
                <div className="w-full max-w-2xl mx-auto block py-4 rounded-full text-[13px] font-bold text-center tracking-wider bg-[var(--bg-card)] text-[var(--text-muted)] border border-[var(--border-soft)]">
                  Complete Month {m} first to unlock
                </div>
              ) : (
                <button
                  onClick={() => { setDetailDay(null); setDetailExIdx(null); handleStartDay(m, w, d, day); }}
                  className="w-full max-w-2xl mx-auto block py-4 rounded-full text-[14px] font-extrabold tracking-[0.2em] shadow-lg transition-all active:scale-[0.98]"
                  style={{ backgroundColor: LEVELS[m].color, color: '#ffffff' }}
                >
                  START
                </button>
              )}
            </div>
          </div>
        );
      })()}

      {/* ─── Exercise Detail Overlay ─── */}
      {detailDay && detailExIdx !== null && (() => {
        const [m, w, d] = detailDay.split('-').map(Number);
        const day = plan.months[m]?.weeks[w]?.days[d];
        if (!day) return null;
        const dayNum = getGlobalDayIndex(plan, m, w, d) + 1;
        const { warmup, main } = getDayExercises(day, dayNum);
        const all = [...warmup, ...main];
        const ex = all[detailExIdx];
        if (!ex) return null;
        return (
          <ExerciseDetail
            exerciseName={ex.name}
            duration={ex.duration}
            color={LEVELS[m].color}
            currentIndex={detailExIdx}
            totalExercises={all.length}
            onClose={() => setDetailExIdx(null)}
            onPrevious={detailExIdx > 0 ? () => setDetailExIdx(detailExIdx - 1) : undefined}
            onNext={detailExIdx < all.length - 1 ? () => setDetailExIdx(detailExIdx + 1) : undefined}
          />
        );
      })()}

      {/* ─── Customize Plan Modal ─── */}
      {showCustomize && (
        <div className="fixed inset-0 z-[160] flex items-end sm:items-center justify-center animate-fade-in" style={{ backgroundColor: 'rgba(5,6,8,0.75)', backdropFilter: 'blur(10px)' }}>
          <div className="w-full sm:max-w-lg max-h-[90vh] flex flex-col rounded-t-[28px] sm:rounded-[28px] bg-[#12161c]/95 backdrop-blur-2xl border border-white/10 shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-2 shrink-0">
              <h3 className="text-[20px] font-black text-white tracking-tight">Customize Plan</h3>
              <button onClick={() => setShowCustomize(false)} className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white/70 active:scale-90 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-2">
              {/* Target areas */}
              <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/45 mt-3 mb-2.5">Target Areas</p>
              <div className="grid grid-cols-2 gap-2">
                {(['core', 'chest', 'back', 'arms', 'legs', 'glutes', 'shoulders', 'cardio', 'full-body'] as ExerciseCategory[]).map((cat) => {
                  const active = custCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleCustCategory(cat)}
                      className={`relative flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all active:scale-[0.98] text-left ${
                        active ? 'bg-white/[0.14] border-white/60' : 'bg-white/[0.05] border-white/10'
                      }`}
                    >
                      <span className={`text-[13px] font-bold flex-1 ${active ? 'text-white' : 'text-white/55'}`}>{CATEGORY_LABELS[cat]}</span>
                      {active && (
                        <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#ffffff' }}>
                          <Check className="w-3 h-3" strokeWidth={3.5} style={{ color: '#0b0d10' }} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Difficulty */}
              <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/45 mt-6 mb-2.5">Difficulty</p>
              <div className="flex gap-2">
                {([['beginner', 'Easy'], ['intermediate', 'Medium'], ['advanced', 'Hard']] as [Level, string][]).map(([lvl, label]) => {
                  const active = custLevel === lvl;
                  return (
                    <button
                      key={lvl}
                      onClick={() => setCustLevel(lvl)}
                      className={`flex-1 py-3 rounded-full text-[13px] font-bold border transition-all active:scale-95 ${
                        active ? 'border-white/60 text-[#0b0d10]' : 'bg-white/[0.05] border-white/10 text-white/55'
                      }`}
                      style={active ? { backgroundColor: '#ffffff' } : undefined}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-white/40 mt-2">
                {custLevel === 'beginner' ? '5 exercises per day' : custLevel === 'intermediate' ? '6 exercises per day' : '7 exercises per day'} · applies to your whole plan
              </p>
            </div>

            {/* Modal actions */}
            <div className="flex gap-2.5 px-6 py-5 shrink-0 border-t border-white/10">
              <button onClick={() => setShowCustomize(false)} className="flex-1 py-3.5 rounded-full text-[14px] font-bold bg-white/[0.07] border border-white/10 text-white/70 active:scale-[0.98] transition-all">
                Cancel
              </button>
              <button
                onClick={handleSaveCustomize}
                disabled={custCategories.length === 0}
                className="flex-[1.4] py-3.5 rounded-full text-[14px] font-black active:scale-[0.98] transition-all disabled:opacity-40"
                style={{ backgroundColor: '#ffffff', color: '#0b0d10' }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Replace Exercise Modal ─── */}
      {replaceExercise && (() => {
        const currentEx = replaceExercise.exercise;
        const currentDet = EXERCISE_DETAILS[currentEx.name];
        const currentCategories = currentDet?.categories || [];
        const searchLower = replaceSearch.toLowerCase();

        // Find similar exercises (same categories, excluding current)
        const similar = ALL_EXERCISES.filter((ex) => {
          if (ex.name === currentEx.name) return false;
          const det = EXERCISE_DETAILS[ex.name];
          if (!det) return false;
          return det.categories.some((c) => currentCategories.includes(c));
        });

        // All exercises matching search
        const allMatching = ALL_EXERCISES.filter((ex) => {
          if (ex.name === currentEx.name) return false;
          if (!searchLower) return true;
          return ex.name.toLowerCase().includes(searchLower);
        });

        // Group alphabetically
        const grouped: Record<string, typeof ALL_EXERCISES> = {};
        allMatching.forEach((ex) => {
          const letter = ex.name[0].toUpperCase();
          if (!grouped[letter]) grouped[letter] = [];
          grouped[letter].push(ex);
        });

        return (
          <div className="fixed inset-0 z-[160] flex flex-col animate-fade-in" style={{ backgroundColor: 'var(--bg-page)' }}>
            {/* Header */}
            <div className="px-5 pt-5 pb-3 safe-area-top">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 bg-white/[0.07] backdrop-blur-xl border border-white/10">
                    <Dumbbell className="w-5 h-5 text-white/60" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-white/45">Current: {currentEx.name}</p>
                    <p className="text-[15px] sm:text-[16px] font-black text-white">Replace it with...</p>
                  </div>
                </div>
                <button onClick={() => { setReplaceExercise(null); setReplaceSearch(''); }} className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 touch-manipulation bg-white/[0.08] border border-white/10 backdrop-blur-xl">
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Search exercises"
                  value={replaceSearch}
                  onChange={(e) => setReplaceSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl text-[14px] font-medium outline-none bg-white/[0.06] border border-white/10 text-white placeholder-white/30 backdrop-blur-xl"
                  autoFocus
                />
              </div>
            </div>

            {/* Exercise list */}
            <div className="flex-1 overflow-y-auto px-5 pb-8">
              <div className="max-w-lg mx-auto">
                {/* Recommended (similar) */}
                {!searchLower && similar.length > 0 && (
                  <>
                    <p className="text-[12px] font-bold uppercase tracking-widest mt-4 mb-2.5 text-white/45">Recommended</p>
                    <div className="space-y-2">
                      {similar.slice(0, 5).map((ex) => {
                        const det = EXERCISE_DETAILS[ex.name];
                        const sameDifficulty = det && currentDet && det.categories.some((c) => currentDet.categories.includes(c));
                        return (
                          <button
                            key={ex.name}
                            onClick={() => handleReplaceExercise(replaceExercise.dayKey, replaceExercise.exerciseIdx, { name: ex.name, duration: currentEx.duration })}
                            className="w-full flex items-center gap-3 px-3.5 sm:px-4 py-3.5 rounded-2xl text-left transition-all active:scale-[0.98] touch-manipulation bg-white/[0.06] border border-white/10 backdrop-blur-xl hover:bg-white/[0.10]"
                          >
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white/[0.08] border border-white/10">
                              <Dumbbell className="w-5 h-5 text-white/40" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-bold truncate text-white">{ex.name}</p>
                              {det && <p className="text-[11px] truncate mt-0.5 text-white/45">{det.musclesWorked}</p>}
                            </div>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 bg-white/10 text-white/50">
                              {sameDifficulty ? 'Similar' : 'Easier'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* Alphabetical */}
                {Object.keys(grouped).sort().map((letter) => (
                  <div key={letter}>
                    <p className="text-[18px] font-black mt-5 mb-2 text-white/40">{letter}</p>
                    <div className="space-y-2">
                      {grouped[letter].map((ex) => {
                        const det = EXERCISE_DETAILS[ex.name];
                        return (
                          <button
                            key={ex.name}
                            onClick={() => handleReplaceExercise(replaceExercise.dayKey, replaceExercise.exerciseIdx, { name: ex.name, duration: currentEx.duration })}
                            className="w-full flex items-center gap-3 px-3.5 sm:px-4 py-3.5 rounded-2xl text-left transition-all active:scale-[0.98] touch-manipulation bg-white/[0.06] border border-white/10 backdrop-blur-xl hover:bg-white/[0.10]"
                          >
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white/[0.08] border border-white/10">
                              <Dumbbell className="w-5 h-5 text-white/40" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-bold truncate text-white">{ex.name}</p>
                              {det && <p className="text-[11px] truncate mt-0.5 text-white/45">{det.musclesWorked}</p>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ─── Day Complete Celebration ─── */}
      {celebrateDay !== null && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center overflow-hidden animate-fade-in" style={{ backgroundColor: 'rgba(5,6,8,0.88)', backdropFilter: 'blur(14px)' }}>
          {/* Confetti */}
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-[2px]"
              style={{
                left: `${(i * 61) % 100}%`,
                top: '-6%',
                width: i % 3 === 0 ? 10 : 7,
                height: i % 3 === 0 ? 14 : 10,
                backgroundColor: ['#ffffff', '#8b9a7b', '#e8b04b', '#6f9bd1', '#c96f6f'][i % 5],
                animation: `confetti-fall ${2.4 + (i % 5) * 0.5}s linear ${(i % 12) * 0.18}s infinite`,
              }}
            />
          ))}
          <div className="relative text-center px-8 py-10 rounded-[32px] bg-white/[0.07] backdrop-blur-2xl border border-white/15 shadow-2xl max-w-sm mx-5" style={{ animation: 'pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both' }}>
            <div className="text-[64px] leading-none">🎉</div>
            <div className="mt-4 flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5 text-[#e8b04b]" />
              <p className="text-[12px] font-bold tracking-[0.2em] uppercase text-white/60">Day {celebrateDay} complete</p>
            </div>
            <h3 className="text-[28px] font-black text-white mt-2 tracking-tight">You did it!</h3>
            <p className="text-[13px] text-white/55 mt-2">Every exercise finished. That ring is 100% yours.</p>
            <button
              onClick={() => setCelebrateDay(null)}
              className="mt-7 w-full py-3.5 rounded-full text-[14px] font-black tracking-[0.2em] transition-all active:scale-[0.98]"
              style={{ backgroundColor: '#ffffff', color: '#0b0d10' }}
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
