import React, { useState, useCallback, useEffect } from 'react';
import { Sparkles, Play, Check, Plus, Pencil, Trash2, Dumbbell, Info, Trophy, Flame, Beef, Calculator, Calendar } from 'lucide-react';
import { Tabs } from './Tabs';
import { ExerciseTimer } from './ExerciseTimer';
import { ExerciseDetail } from './ExerciseDetail';
import { AddWorkoutModal } from './AddWorkoutModal';
import { PlanView } from './PlanView';
import { WORKOUTS, Gender, Level, Workout, Exercise, isRepsExercise } from '../utils/workouts';
import { getCustomWorkouts, deleteCustomWorkout } from '../utils/customWorkouts';
import { addWorkoutLog, estimateCaloriesBurned, addXP } from '../utils/fitnessData';
import { setPlanDayProgress } from '../utils/planProgress';

const LEVELS: { key: Level; label: string; color: string; bg: string; text: string; restSec: number }[] = [
  { key: 'beginner', label: 'Beginner', color: '#8b9a7b', bg: '#8b9a7b', text: '#ffffff', restSec: 10 },
  { key: 'intermediate', label: 'Intermediate', color: '#5a6577', bg: '#5a6577', text: '#ffffff', restSec: 10 },
  { key: 'advanced', label: 'Advanced', color: '#8b3a3a', bg: '#8b3a3a', text: '#ffffff', restSec: 10 },
];

interface ActiveTimer {
  exerciseIndex: number;
  exercise: Exercise;
  workoutId: string;
}

interface GymViewProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  isLoggingOut: boolean;
  gymDropdownOpen?: boolean;
  onGymToggle?: () => void;
  gymDropdownItems?: Array<{ key: string; label: string; icon: React.ReactNode; active: boolean; onClick: () => void }>;
  activeGymSection?: 'plan' | 'calculator';
  onSetActiveGymSection?: (section: 'plan' | 'calculator') => void;
}

export const GymView: React.FC<GymViewProps> = ({
  tabs, activeTab, onTabChange, onLogout, isLoggingOut,
  gymDropdownOpen, onGymToggle, gymDropdownItems,
  activeGymSection: activeGymSectionProp, onSetActiveGymSection
}) => {
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());
  const [customWorkouts, setCustomWorkouts] = useState<Workout[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
  const [detailExercise, setDetailExercise] = useState<{ index: number; exercise: Exercise } | null>(null);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [gender, setGender] = useState<Gender>('men');
  const [level, setLevel] = useState<Level>('beginner');
  const [planWorkout, setPlanWorkout] = useState<Workout | null>(null);
  const [planDayKey, setPlanDayKey] = useState<string | null>(null);
  const activeGymSection = activeGymSectionProp ?? 'plan';
  const setActiveGymSection = onSetActiveGymSection ?? (() => {});

  // Calorie calculator state
  const [calcGender, setCalcGender] = useState<'male' | 'female'>('male');
  const [calcAge, setCalcAge] = useState(25);
  const [calcHeight, setCalcHeight] = useState(170);
  const [calcWeight, setCalcWeight] = useState(70);
  const [calcActivity, setCalcActivity] = useState('sedentary');
  const [calcGoal, setCalcGoal] = useState('maintain');

  const calcResult = React.useMemo(() => {
    let bmr: number;
    if (calcGender === 'male') {
      bmr = 10 * calcWeight + 6.25 * calcHeight - 5 * calcAge + 5;
    } else {
      bmr = 10 * calcWeight + 6.25 * calcHeight - 5 * calcAge - 161;
    }
    const multipliers: Record<string, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
    const tdee = Math.round(bmr * (multipliers[calcActivity] || 1.2));
    const proteinPerKg = calcGoal === 'lose' ? 2.2 : calcGoal === 'gain' ? 2.0 : 1.8;
    const proteinLow = Math.round(calcWeight * 1.6);
    const proteinHigh = Math.round(calcWeight * proteinPerKg);
    const proteinMid = Math.round((proteinLow + proteinHigh) / 2);
    const fatGrams = Math.round((calcGoal === 'lose' ? tdee - 500 : calcGoal === 'gain' ? tdee + 300 : tdee) * 0.25 / 9);
    const targetCal = calcGoal === 'lose' ? tdee - 500 : calcGoal === 'gain' ? tdee + 300 : tdee;
    const carbGrams = Math.round((targetCal - proteinMid * 4 - fatGrams * 9) / 4);
    return {
      bmr: Math.round(bmr),
      tdee,
      proteinLow,
      proteinHigh,
      proteinMid,
      fatGrams,
      carbGrams: Math.max(0, carbGrams),
      lose: tdee - 500,
      maintain: tdee,
      gain: tdee + 300,
      targetCal,
    };
  }, [calcGender, calcAge, calcHeight, calcWeight, calcActivity, calcGoal]);

  const refreshCustom = useCallback(() => {
    setCustomWorkouts(getCustomWorkouts());
  }, []);

  useEffect(() => { refreshCustom(); }, [refreshCustom]);

  const builtinWorkout: Workout | undefined = WORKOUTS.find(
    (w) => w.gender === gender && w.level === level
  );

  const activeWorkout = activeTimer?.workoutId === 'plan-day' && planWorkout
    ? planWorkout
    : selectedWorkoutId
      ? customWorkouts.find((w) => w.id === selectedWorkoutId) || builtinWorkout
      : builtinWorkout;

  const reportPlanProgress = useCallback((completed: Set<number>) => {
    if (!planDayKey || !planWorkout) return;
    const nonRest = planWorkout.exercises
      .map((ex, i) => ({ ex, i }))
      .filter(({ ex }) => {
        const n = ex.name.toLowerCase();
        return !n.includes('rest') && !n.includes('repeat');
      });
    const done = nonRest.filter(({ i }) => completed.has(i)).length;
    setPlanDayProgress(planDayKey, done, nonRest.length);
  }, [planDayKey, planWorkout]);

  const levelMeta = LEVELS.find((l) => l.key === level)!;

  const handleExerciseClick = useCallback((index: number, exercise: Exercise) => {
    if (!activeWorkout) return;
    setActiveTimer({ exerciseIndex: index, exercise, workoutId: activeWorkout.id });
  }, [activeWorkout]);

  const handleTimerComplete = useCallback(() => {
    if (!activeTimer || !activeWorkout) return;
    const updatedCompleted = new Set(completedExercises).add(activeTimer.exerciseIndex);
    setCompletedExercises(updatedCompleted);
    if (activeTimer.workoutId === 'plan-day') reportPlanProgress(updatedCompleted);
    const nextIdx = activeTimer.exerciseIndex + 1;
    if (nextIdx < activeWorkout.exercises.length) {
      setWorkoutStarted(true);
      setActiveTimer({
        exerciseIndex: nextIdx,
        exercise: activeWorkout.exercises[nextIdx],
        workoutId: activeWorkout.id,
      });
    } else {
      const totalExercises = activeWorkout.exercises.filter(
        (ex) => !ex.name.toLowerCase().includes('rest') && !ex.name.toLowerCase().includes('repeat')
      ).length;
      const durationSec = activeWorkout.exercises.reduce((s, ex) => {
        const d = parseInt(ex.duration) || 30;
        return s + (ex.name.toLowerCase().includes('rest') ? 10 : d);
      }, 0);
      const calories = estimateCaloriesBurned(activeWorkout.title, durationSec);
      const xpEarned = totalExercises * 10 + (calories > 200 ? 20 : 0);
      addWorkoutLog({
        date: new Date().toISOString().split('T')[0],
        workoutName: activeWorkout.title,
        duration: Math.round(durationSec / 60),
        exercisesCompleted: totalExercises,
        totalExercises,
        caloriesBurned: calories,
        level: activeWorkout.level,
        xpEarned,
      });
      addXP(xpEarned);
      setActiveTimer(null);
    }
  }, [activeTimer, activeWorkout, completedExercises, reportPlanProgress]);

  const handleNextExercise = useCallback(() => {
    if (!activeWorkout || !activeTimer) return;
    const updatedCompleted = new Set(completedExercises).add(activeTimer.exerciseIndex);
    setCompletedExercises(updatedCompleted);
    if (activeTimer.workoutId === 'plan-day') reportPlanProgress(updatedCompleted);
    for (let j = activeTimer.exerciseIndex + 1; j < activeWorkout.exercises.length; j++) {
      const n = activeWorkout.exercises[j].name.toLowerCase();
      if (!n.includes('rest') && !n.includes('repeat')) {
        setActiveTimer({
          exerciseIndex: j,
          exercise: activeWorkout.exercises[j],
          workoutId: activeWorkout.id,
        });
        return;
      }
    }
    setActiveTimer(null);
  }, [activeWorkout, activeTimer, completedExercises, reportPlanProgress]);

  const handlePreviousExercise = useCallback(() => {
    if (!activeWorkout || !activeTimer) return;
    for (let j = activeTimer.exerciseIndex - 1; j >= 0; j--) {
      const n = activeWorkout.exercises[j].name.toLowerCase();
      if (!n.includes('rest') && !n.includes('repeat')) {
        setActiveTimer({
          exerciseIndex: j,
          exercise: activeWorkout.exercises[j],
          workoutId: activeWorkout.id,
        });
        return;
      }
    }
  }, [activeWorkout, activeTimer]);

  const handleStartWorkout = useCallback(() => {
    setCompletedExercises(new Set());
    setWorkoutStarted(false);
    if (activeWorkout) {
      const firstExIndex = activeWorkout.exercises.findIndex(
        (ex) => !ex.name.toLowerCase().includes('rest') && !ex.name.toLowerCase().includes('repeat')
      );
      if (firstExIndex >= 0) {
        setActiveTimer({
          exerciseIndex: firstExIndex,
          exercise: activeWorkout.exercises[firstExIndex],
          workoutId: activeWorkout.id,
        });
      }
    }
  }, [activeWorkout]);

  const handleWorkoutComplete = useCallback(() => {
    setCompletedExercises(new Set());
  }, []);

  const handleStartPlanWorkout = useCallback((exercises: Exercise[], name: string, dayKey?: string) => {
    const nonRest = exercises.filter((e) => {
      const n = e.name.toLowerCase();
      return !n.includes('rest') && !n.includes('repeat');
    });
    const workout: Workout = {
      id: 'plan-day',
      title: name,
      tagline: '',
      duration: `${nonRest.length * 30}s`,
      level: 'beginner',
      gender: gender,
      exercises: nonRest.flatMap((e, i) => (i < nonRest.length - 1 ? [e, { name: 'Rest', duration: '10 sec' }] : [e])),
      tip: '',
    };
    setSelectedWorkoutId(null);
    setPlanWorkout(workout);
    setPlanDayKey(dayKey ?? null);
    setActiveTimer({
      exerciseIndex: 0,
      exercise: workout.exercises[0],
      workoutId: workout.id,
    });
    setCompletedExercises(new Set());
    setWorkoutStarted(false);
  }, [gender]);

  const handleDeleteWorkout = (id: string) => {
    deleteCustomWorkout(id);
    refreshCustom();
    if (selectedWorkoutId === id) setSelectedWorkoutId(null);
  };

  const timerColor = activeWorkout
    ? (LEVELS.find((l) => l.key === activeWorkout.level)?.color || levelMeta.color)
    : levelMeta.color;

  return (
    <div className="flex flex-col relative w-full h-full">
      <div className="sticky top-0 z-20">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
          onLogout={onLogout}
          isLoggingOut={isLoggingOut}
          gymDropdownOpen={gymDropdownOpen}
          onGymToggle={onGymToggle}
          gymDropdownItems={gymDropdownItems}
        />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div
          className="p-4 sm:p-5 md:p-6 space-y-5 animate-slide-up"
          style={{ paddingBottom: 'max(8rem, env(safe-area-inset-bottom) + 4rem)' }}
        >
          {/* Calorie Calculator Card */}
          {activeGymSection === 'calculator' && (
            <div className="rounded-2xl bg-white/[0.06] backdrop-blur-2xl border border-white/10 p-5 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.08] border border-white/10">
                  <Flame className="w-5 h-5 text-white/60" />
                </div>
                <h2 className="text-[18px] font-black text-white">Calorie Calculator</h2>
              </div>

              {/* Gender */}
              <div>
                <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/40 mb-2">Gender</p>
                <div className="flex gap-2">
                  {(['male', 'female'] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => setCalcGender(g)}
                      className={`flex-1 py-3 rounded-xl text-[13px] font-bold transition-all ${
                        calcGender === g
                          ? 'bg-white/[0.12] border border-white/30 text-white'
                          : 'bg-white/[0.04] border border-white/8 text-white/40'
                      }`}
                    >
                      {g === 'male' ? 'Male' : 'Female'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age / Height / Weight */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/35 mb-1.5">Age</p>
                  <input
                    type="number"
                    value={calcAge}
                    onChange={(e) => setCalcAge(Math.max(13, Math.min(99, +e.target.value || 13)))}
                    className="w-full py-3 px-3 rounded-xl bg-white/[0.04] border border-white/8 text-center text-[16px] font-black text-white outline-none focus:border-white/20 transition-all tabular-nums"
                  />
                  <p className="text-[9px] text-white/25 text-center mt-1">13–99</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/35 mb-1.5">Height</p>
                  <input
                    type="number"
                    value={calcHeight}
                    onChange={(e) => setCalcHeight(Math.max(120, Math.min(220, +e.target.value || 120)))}
                    className="w-full py-3 px-3 rounded-xl bg-white/[0.04] border border-white/8 text-center text-[16px] font-black text-white outline-none focus:border-white/20 transition-all tabular-nums"
                  />
                  <p className="text-[9px] text-white/25 text-center mt-1">cm</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/35 mb-1.5">Weight</p>
                  <input
                    type="number"
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(Math.max(30, Math.min(200, +e.target.value || 30)))}
                    className="w-full py-3 px-3 rounded-xl bg-white/[0.04] border border-white/8 text-center text-[16px] font-black text-white outline-none focus:border-white/20 transition-all tabular-nums"
                  />
                  <p className="text-[9px] text-white/25 text-center mt-1">kg</p>
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/40 mb-2">Activity Level</p>
                <select
                  value={calcActivity}
                  onChange={(e) => setCalcActivity(e.target.value)}
                  className="w-full py-3 px-4 rounded-xl bg-white/[0.04] border border-white/8 text-white text-[13px] font-bold appearance-none cursor-pointer"
                >
                  <option value="sedentary" className="bg-[#0b0c0f]">Sedentary (little/no exercise)</option>
                  <option value="light" className="bg-[#0b0c0f]">Light (exercise 1-3x/week)</option>
                  <option value="moderate" className="bg-[#0b0c0f]">Moderate (exercise 3-5x/week)</option>
                  <option value="active" className="bg-[#0b0c0f]">Active (exercise 6-7x/week)</option>
                  <option value="very_active" className="bg-[#0b0c0f]">Very Active (intense daily)</option>
                </select>
              </div>

              {/* Goal */}
              <div>
                <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/40 mb-2">Goal</p>
                <select
                  value={calcGoal}
                  onChange={(e) => setCalcGoal(e.target.value)}
                  className="w-full py-3 px-4 rounded-xl bg-white/[0.04] border border-white/8 text-white text-[13px] font-bold appearance-none cursor-pointer"
                >
                  <option value="lose" className="bg-[#0b0c0f]">Lose Weight</option>
                  <option value="maintain" className="bg-[#0b0c0f]">Maintain Weight</option>
                  <option value="gain" className="bg-[#0b0c0f]">Gain Weight</option>
                </select>
              </div>

              {/* Calculate button */}
              <button
                onClick={handleCalcCalculate}
                className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 text-[14px] font-bold bg-white/[0.10] backdrop-blur-xl border border-white/15 text-white transition-all active:scale-[0.98]"
              >
                <Calculator className="w-4 h-4" />
                Calculate
              </button>

              {/* Results */}
              {calcResult && (
                <div className="space-y-3 pt-1 animate-slide-up">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/[0.04] border border-white/8 rounded-xl p-4 text-center">
                      <p className="text-[10px] font-bold tracking-widest uppercase text-white/30 mb-1">BMR</p>
                      <p className="text-[24px] font-black text-white tabular-nums">{calcResult.bmr}</p>
                      <p className="text-[10px] text-white/25">cal/day</p>
                    </div>
                    <div className="bg-white/[0.04] border border-white/8 rounded-xl p-4 text-center">
                      <p className="text-[10px] font-bold tracking-widest uppercase text-white/30 mb-1">TDEE</p>
                      <p className="text-[24px] font-black text-white tabular-nums">{calcResult.tdee}</p>
                      <p className="text-[10px] text-white/25">cal/day</p>
                    </div>
                  </div>

                  {/* Protein */}
                  <div className="bg-white/[0.04] border border-white/8 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Beef className="w-4 h-4 text-white/40" />
                      <p className="text-[11px] font-bold tracking-widest uppercase text-white/40">Daily Protein</p>
                    </div>
                    <p className="text-[24px] font-black text-white tabular-nums">{calcResult.proteinLow}–{calcResult.proteinHigh} <span className="text-[12px] text-white/35">g/day</span></p>
                    <p className="text-[10px] text-white/25 mt-1">1.6–2.2g per kg body weight</p>
                  </div>

                  {/* Goal target */}
                  <div className="bg-white/[0.04] border border-white/8 rounded-xl p-4 flex items-center justify-between">
                    <span className="text-[13px] font-bold text-white/50">
                      {calcGoal === 'lose' ? 'Target (lose)' : calcGoal === 'gain' ? 'Target (gain)' : 'Target (maintain)'}
                    </span>
                    <span className="text-[18px] font-black text-white tabular-nums">
                      {calcGoal === 'lose' ? calcResult.lose : calcGoal === 'gain' ? calcResult.gain : calcResult.maintain}
                      <span className="text-[10px] text-white/35 ml-1">cal</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3-Month Plan */}
          {activeGymSection === 'plan' && (
            <PlanView onStartWorkout={handleStartPlanWorkout} />
          )}
        </div>
      </div>

      {/* Timer Overlay */}
      {activeTimer && activeWorkout && (() => {
        const isRestType = activeTimer.exercise.name.toLowerCase().includes('rest') || activeTimer.exercise.name.toLowerCase().includes('repeat');

        const findNextNonRest = (fromIdx: number) => {
          for (let j = fromIdx + 1; j < activeWorkout.exercises.length; j++) {
            const n = activeWorkout.exercises[j].name.toLowerCase();
            if (!n.includes('rest') && !n.includes('repeat')) return activeWorkout.exercises[j];
          }
          return null;
        };
        const findPrevNonRest = (fromIdx: number) => {
          for (let j = fromIdx - 1; j >= 0; j--) {
            const n = activeWorkout.exercises[j].name.toLowerCase();
            if (!n.includes('rest') && !n.includes('repeat')) return activeWorkout.exercises[j];
          }
          return null;
        };

        const nextEx = findNextNonRest(activeTimer.exerciseIndex);
        const prevEx = findPrevNonRest(activeTimer.exerciseIndex);
        const nonRestCount = activeWorkout.exercises.filter(
          (ex) => !ex.name.toLowerCase().includes('rest') && !ex.name.toLowerCase().includes('repeat')
        ).length;
        const currentNonRest = activeWorkout.exercises.slice(0, activeTimer.exerciseIndex + 1).filter(
          (ex) => !ex.name.toLowerCase().includes('rest') && !ex.name.toLowerCase().includes('repeat')
        ).length;
        const isRepsBasedExercise = isRepsExercise(activeTimer.exercise);

        return (
          <ExerciseTimer
            key={`${activeTimer.exerciseIndex}-${activeTimer.exercise.name}`}
            exerciseName={activeTimer.exercise.name}
            duration={activeTimer.exercise.duration}
            color={timerColor}
            onComplete={handleTimerComplete}
            onClose={() => { setActiveTimer(null); setCompletedExercises(new Set()); setWorkoutStarted(false); }}
            onNext={handleNextExercise}
            onPrevious={handlePreviousExercise}
            nextExercise={nextEx ? { name: nextEx.name, duration: nextEx.duration } : null}
            previousExercise={prevEx ? { name: prevEx.name, duration: prevEx.duration } : null}
            exerciseNumber={isRestType ? undefined : currentNonRest}
            totalExercises={isRestType ? undefined : nonRestCount}
            isRest={isRestType}
            allExercises={activeWorkout.exercises
              .filter((ex) => !ex.name.toLowerCase().includes('rest') && !ex.name.toLowerCase().includes('repeat'))
              .map((ex) => ({ name: ex.name, duration: ex.duration }))}
            currentIndex={currentNonRest - 1}
            onExerciseDetail={(name, dur) => {
              const idx = activeWorkout.exercises.findIndex((e) => e.name === name);
              if (idx >= 0) setDetailExercise({ index: idx, exercise: activeWorkout.exercises[idx] });
            }}
            autoStart={workoutStarted}
            restDuration={levelMeta.restSec}
            isRepsBased={isRepsBasedExercise}
            repsLabel={activeTimer.exercise.reps || undefined}
          />
        );
      })()}

      {/* Add/Edit Workout Modal */}
      <AddWorkoutModal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setEditingWorkout(null); }}
        onSave={refreshCustom}
        editWorkout={editingWorkout}
      />

      {/* Exercise Detail */}
      {detailExercise && activeWorkout && (() => {
        const nonRestExercises = activeWorkout.exercises
          .map((ex, i) => ({ ex, i }))
          .filter(({ ex }) => !ex.name.toLowerCase().includes('rest') && !ex.name.toLowerCase().includes('repeat'));
        const nonRestIndex = nonRestExercises.findIndex(({ i }) => i === detailExercise.index);
        const prevNonRest = nonRestIndex > 0 ? nonRestExercises[nonRestIndex - 1] : null;
        const nextNonRest = nonRestIndex < nonRestExercises.length - 1 ? nonRestExercises[nonRestIndex + 1] : null;

        return (
          <ExerciseDetail
            exerciseName={detailExercise.exercise.name}
            duration={detailExercise.exercise.duration}
            color={timerColor}
            currentIndex={nonRestIndex}
            totalExercises={nonRestExercises.length}
            onClose={() => setDetailExercise(null)}
            onPrevious={prevNonRest ? () => setDetailExercise({ index: prevNonRest.i, exercise: prevNonRest.ex }) : undefined}
            onNext={nextNonRest ? () => setDetailExercise({ index: nextNonRest.i, exercise: nextNonRest.ex }) : undefined}
          />
        );
      })()}
    </div>
  );
};
