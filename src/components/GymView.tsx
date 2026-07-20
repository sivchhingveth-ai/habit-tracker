import React, { useState, useCallback, useEffect } from 'react';
import { Sparkles, Play, Check, Plus, Pencil, Trash2, Dumbbell, Info, Trophy } from 'lucide-react';
import { Tabs } from './Tabs';
import { ExerciseTimer } from './ExerciseTimer';
import { ExerciseDetail } from './ExerciseDetail';
import { AddWorkoutModal } from './AddWorkoutModal';
import { PlanView } from './PlanView';
import { CalorieCalculator } from './CalorieCalculator';
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
}

export const GymView: React.FC<GymViewProps> = ({
  tabs, activeTab, onTabChange, onLogout, isLoggingOut,
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
        />
        <CalorieCalculator />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div
          className="p-4 sm:p-5 md:p-6 space-y-5 animate-slide-up"
          style={{ paddingBottom: 'max(8rem, env(safe-area-inset-bottom) + 4rem)' }}
        >
          <PlanView onStartWorkout={handleStartPlanWorkout} />
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
