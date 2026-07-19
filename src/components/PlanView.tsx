import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, Calendar, Trophy, Dumbbell, Flame, Star, Check } from 'lucide-react';
import { WorkoutPlan, WORKOUT_PLANS, getDayPlan, MonthPlan } from '../utils/workoutPlans';
import { Exercise } from '../utils/workouts';

const PLAN_STORAGE = 'habit-tracker-active-plan';

interface SavedPlan {
  planId: string;
  months: number;
  currentDay: number;
  startedAt: number;
}

function loadSavedPlan(): SavedPlan | null {
  try {
    const raw = localStorage.getItem(PLAN_STORAGE);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function savePlan(p: SavedPlan | null) {
  try {
    if (p) localStorage.setItem(PLAN_STORAGE, JSON.stringify(p));
    else localStorage.removeItem(PLAN_STORAGE);
  } catch {}
}

const LEVEL_COLORS: Record<string, string> = {
  beginner: '#8b9a7b',
  intermediate: '#5a6577',
  advanced: '#8b3a3a',
};

interface PlanViewProps {
  onStartWorkout: (exercises: Exercise[], name: string) => void;
}

export const PlanView: React.FC<PlanViewProps> = ({ onStartWorkout }) => {
  const saved = loadSavedPlan();
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(
    saved ? WORKOUT_PLANS.find((p) => p.id === saved.planId) ?? null : null
  );
  const [selectedMonths, setSelectedMonths] = useState(saved?.months ?? 1);
  const [currentDay, setCurrentDay] = useState(saved?.currentDay ?? 0);
  const [showSelect, setShowSelect] = useState(!saved);

  useEffect(() => {
    if (selectedPlan) {
      savePlan({ planId: selectedPlan.id, months: selectedMonths, currentDay, startedAt: saved?.startedAt ?? Date.now() });
    }
  }, [selectedPlan, selectedMonths, currentDay]);

  const totalDays = selectedPlan ? Math.min(selectedMonths * 4 * 5, selectedPlan.months.reduce((sum, m) => sum + m.weeks.reduce((ws, w) => ws + w.days.length, 0), 0)) : 0;
  const dayInfo = selectedPlan ? getDayPlan(selectedPlan, currentDay) : null;
  const progress = totalDays > 0 ? ((currentDay + 1) / totalDays) * 100 : 0;

  const handleStartPlan = useCallback((plan: WorkoutPlan, months: number) => {
    setSelectedPlan(plan);
    setSelectedMonths(months);
    setCurrentDay(0);
    setShowSelect(false);
    savePlan({ planId: plan.id, months, currentDay: 0, startedAt: Date.now() });
  }, []);

  const handleStartToday = useCallback(() => {
    if (!dayInfo) return;
    onStartWorkout(dayInfo.day.exercises.filter((e) => !e.name.toLowerCase().includes('rest')), `Day ${currentDay + 1}: ${dayInfo.day.day}`);
  }, [dayInfo, currentDay, onStartWorkout]);

  const handleNextDay = useCallback(() => {
    if (currentDay < totalDays - 1) setCurrentDay((d) => d + 1);
  }, [currentDay, totalDays]);

  const handlePrevDay = useCallback(() => {
    if (currentDay > 0) setCurrentDay((d) => d - 1);
  }, [currentDay]);

  const handleResetPlan = useCallback(() => {
    setSelectedPlan(null);
    setCurrentDay(0);
    setShowSelect(true);
    savePlan(null);
  }, []);

  if (showSelect || !selectedPlan) {
    return (
      <div className="space-y-4 animate-slide-up">
        <div className="text-center mb-6">
          <h2 className="text-[20px] font-black text-[var(--text-primary)] tracking-tight">Workout Programs</h2>
          <p className="text-[13px] text-[var(--text-muted)] mt-1">Choose a plan. Commit to the journey.</p>
        </div>

        {WORKOUT_PLANS.map((plan) => (
          <div key={plan.id} className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-card)] overflow-hidden">
            <div className="p-4">
              <h3 className="text-[16px] font-black text-[var(--text-primary)]">{plan.name}</h3>
              <p className="text-[12px] text-[var(--text-muted)] mt-1">{plan.description}</p>

              <div className="flex items-center gap-2 mt-3">
                {[1, 2, 3].map((m) => (
                  <button
                    key={m}
                    onClick={() => setSelectedMonths(m)}
                    className={`flex-1 py-2 rounded-xl text-[12px] font-bold transition-all ${
                      selectedMonths === m
                        ? 'bg-[var(--brand)] text-white'
                        : 'bg-[var(--bg-soft)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {m} Month{m > 1 ? 's' : ''}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 mt-3">
                {plan.months.slice(0, selectedMonths).map((m) => (
                  <div key={m.month} className="flex-1 text-center">
                    <div
                      className="w-8 h-8 rounded-full mx-auto flex items-center justify-center text-[11px] font-bold text-white mb-1"
                      style={{ backgroundColor: LEVEL_COLORS[m.level] }}
                    >
                      {m.month}
                    </div>
                    <span className="text-[10px] text-[var(--text-muted)] capitalize">{m.level}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleStartPlan(plan, selectedMonths)}
              className="w-full py-3 text-[13px] font-bold border-t border-[var(--border-soft)] text-[var(--brand)] hover:bg-[var(--bg-soft)] transition-all"
            >
              Start This Plan
            </button>
          </div>
        ))}
      </div>
    );
  }

  if (!dayInfo) {
    return (
      <div className="text-center py-12 animate-slide-up">
        <Trophy className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--brand)' }} />
        <h2 className="text-[18px] font-black text-[var(--text-primary)]">Program Complete!</h2>
        <p className="text-[13px] text-[var(--text-muted)] mt-2">You finished all {totalDays} days. Incredible work.</p>
        <button
          onClick={handleResetPlan}
          className="mt-4 px-6 py-2.5 rounded-xl text-[13px] font-bold bg-[var(--brand)] text-white"
        >
          Start New Plan
        </button>
      </div>
    );
  }

  const levelColor = LEVEL_COLORS[dayInfo.month.level] || 'var(--brand)';

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Progress bar */}
      <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-card)] p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Day {currentDay + 1} of {totalDays}
          </span>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white capitalize"
            style={{ backgroundColor: levelColor }}
          >
            {dayInfo.month.level}
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-[var(--bg-soft)] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: levelColor }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <button
            onClick={handlePrevDay}
            disabled={currentDay === 0}
            className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 hover:bg-[var(--bg-soft)] transition-all"
          >
            <ChevronLeft className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
          </button>
          <span className="text-[12px] font-bold text-[var(--text-primary)]">
            {dayInfo.month.title} — {dayInfo.week.label}
          </span>
          <button
            onClick={handleNextDay}
            disabled={currentDay >= totalDays - 1}
            className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-30 hover:bg-[var(--bg-soft)] transition-all"
          >
            <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
          </button>
        </div>
      </div>

      {/* Coach message */}
      <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-card)] p-4">
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${levelColor}20` }}
          >
            <Dumbbell className="w-4 h-4" style={{ color: levelColor }} />
          </div>
          <div>
            <p className="text-[12px] font-bold text-[var(--text-primary)]">Coach says:</p>
            <p className="text-[12px] text-[var(--text-muted)] mt-0.5">{dayInfo.day.coachTip}</p>
          </div>
        </div>
      </div>

      {/* Today's exercises */}
      <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-card)] p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4" style={{ color: levelColor }} />
          <span className="text-[13px] font-bold text-[var(--text-primary)]">{dayInfo.day.day}'s Workout</span>
        </div>
        <div className="space-y-1.5">
          {dayInfo.day.exercises
            .filter((e) => !e.name.toLowerCase().includes('rest'))
            .map((ex, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--bg-soft)]">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                  style={{ backgroundColor: levelColor }}
                >
                  {i + 1}
                </div>
                <span className="text-[12px] font-medium text-[var(--text-primary)] flex-1">{ex.name}</span>
                <span className="text-[11px] text-[var(--text-muted)]">{ex.duration}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Start button */}
      <button
        onClick={handleStartToday}
        className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 text-[14px] font-bold text-white transition-all active:scale-[0.98] shadow-lg"
        style={{ backgroundColor: levelColor }}
      >
        <Play className="w-5 h-5" fill="currentColor" />
        Start Today's Workout
      </button>

      {/* Reset */}
      <button
        onClick={handleResetPlan}
        className="w-full py-2.5 rounded-xl text-[12px] font-bold text-[var(--text-muted)] hover:text-red-500 transition-all"
      >
        Reset Plan
      </button>
    </div>
  );
};
