import React, { useState, useCallback, useEffect } from 'react';
import { Sparkles, User, Timer, Repeat, Play, Check, Plus, Pencil, Trash2, Dumbbell } from 'lucide-react';
import { Tabs } from './Tabs';
import { ExerciseTimer } from './ExerciseTimer';
import { AddWorkoutModal } from './AddWorkoutModal';
import { WORKOUTS, Gender, Level, Workout, Exercise } from '../utils/workouts';
import { getCustomWorkouts, deleteCustomWorkout } from '../utils/customWorkouts';

const LEVELS: { key: Level; label: string; color: string; bg: string; text: string }[] = [
  { key: 'beginner', label: 'Beginner', color: '#6fa83b', bg: '#b8eb6c', text: '#3d5d1c' },
  { key: 'intermediate', label: 'Intermediate', color: '#4e55e0', bg: '#4e55e0', text: '#ffffff' },
  { key: 'advanced', label: 'Advanced', color: '#d05a96', bg: '#fc8fc6', text: '#6b1a40' },
];

const PHASE_COLORS: Record<Gender, string> = {
  men: '#4e55e0',
  women: '#d05a96',
};

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
  const [gender, setGender] = useState<Gender>('men');
  const [level, setLevel] = useState<Level>('beginner');
  const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());
  const [customWorkouts, setCustomWorkouts] = useState<Workout[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);

  const refreshCustom = useCallback(() => {
    setCustomWorkouts(getCustomWorkouts());
  }, []);

  useEffect(() => { refreshCustom(); }, [refreshCustom]);

  const builtinWorkout: Workout | undefined = WORKOUTS.find(
    (w) => w.gender === gender && w.level === level
  );

  const activeWorkout = selectedWorkoutId
    ? customWorkouts.find((w) => w.id === selectedWorkoutId) || builtinWorkout
    : builtinWorkout;

  const levelMeta = LEVELS.find((l) => l.key === level)!;

  const handleExerciseClick = useCallback((index: number, exercise: Exercise) => {
    if (!activeWorkout) return;
    setActiveTimer({ exerciseIndex: index, exercise, workoutId: activeWorkout.id });
  }, [activeWorkout]);

  const handleTimerComplete = useCallback(() => {
    if (activeTimer && activeWorkout) {
      setCompletedExercises((prev) => new Set(prev).add(activeTimer.exerciseIndex));
      // Auto-start the next exercise (or rest) after current completes
      const nextIndex = activeTimer.exerciseIndex + 1;
      if (nextIndex < activeWorkout.exercises.length) {
        const nextEx = activeWorkout.exercises[nextIndex];
        setActiveTimer({ exerciseIndex: nextIndex, exercise: nextEx, workoutId: activeWorkout.id });
      } else {
        setActiveTimer(null);
      }
    }
  }, [activeTimer, activeWorkout]);

  const handleStartWorkout = useCallback(() => {
    setCompletedExercises(new Set());
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
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div
          className="p-4 sm:p-5 md:p-6 space-y-5 animate-slide-up"
          style={{ paddingBottom: 'max(8rem, env(safe-area-inset-bottom) + 4rem)' }}
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[20px] sm:text-[22px] md:text-[26px] font-black text-[var(--text-primary)] leading-tight tracking-tight">
                Gym
              </h2>
              <p className="text-[var(--text-muted)] text-[13px] font-medium mt-1">
                Pick a level. Show up. Earn it.
              </p>
            </div>
            <button
              onClick={() => { setEditingWorkout(null); setShowAddModal(true); }}
              className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center bg-[var(--accent)] text-white shadow-md hover:shadow-lg hover:brightness-110 transition-all active:scale-90 touch-manipulation"
              style={{ touchAction: 'manipulation' }}
            >
              <Plus className="w-4 h-4" strokeWidth={3} />
            </button>
          </div>

          {/* Custom Workouts Section */}
          {customWorkouts.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2.5 px-1">
                <Dumbbell className="w-3.5 h-3.5 text-[var(--accent)]" />
                <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">My Workouts</p>
                <span className="ml-auto text-[10px] font-bold text-[var(--text-muted)]">{customWorkouts.length}</span>
              </div>
              <div className="space-y-2">
                {customWorkouts.map((cw) => {
                  const isSelected = selectedWorkoutId === cw.id;
                  const cwLevelMeta = LEVELS.find((l) => l.key === cw.level);
                  return (
                    <div
                      key={cw.id}
                      className={`rounded-2xl border transition-all overflow-hidden ${
                        isSelected
                          ? 'border-[var(--accent)] shadow-md bg-[var(--bg-card)]'
                          : 'border-[var(--border-soft)] bg-[var(--bg-card)] hover:border-[var(--border-medium)]'
                      }`}
                    >
                      <button
                        onClick={() => {
                          setSelectedWorkoutId(isSelected ? null : cw.id);
                          setCompletedExercises(new Set());
                        }}
                        className="w-full p-3.5 text-left"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[14px] font-bold text-[var(--text-primary)] truncate">{cw.title}</p>
                            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 truncate">{cw.tagline}</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span
                              className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase"
                              style={{ backgroundColor: `${cwLevelMeta?.color}20`, color: cwLevelMeta?.color }}
                            >
                              {cw.level}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-[var(--bg-soft)] text-[var(--text-muted)]">
                              {cw.duration}
                            </span>
                          </div>
                        </div>
                      </button>
                      {isSelected && (
                        <div className="px-3.5 pb-3 flex items-center gap-2 border-t border-[var(--border-soft)] pt-2.5">
                          <button
                            onClick={(e) => { e.stopPropagation(); setEditingWorkout(cw); setShowAddModal(true); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-[var(--bg-soft)] text-[var(--text-secondary)] hover:bg-[var(--border-medium)] transition-all active:scale-95"
                          >
                            <Pencil className="w-3 h-3" /> Edit
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteWorkout(cw.id); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-all active:scale-95"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                          <div className="flex-1" />
                          <span className="text-[10px] text-[var(--text-muted)]">{cw.exercises.length} exercises</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Built-in: Choose Path */}
          {!selectedWorkoutId && (
            <>
              <div>
                <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2.5 px-1">Choose Path</p>
                <div className="grid grid-cols-2 gap-2">
                  {(['men', 'women'] as Gender[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => { setGender(g); setCompletedExercises(new Set()); }}
                      className={`py-3.5 rounded-2xl text-[12px] md:text-[13px] font-black uppercase tracking-wider border transition-all ${
                        gender === g
                          ? 'bg-[var(--text-primary)] text-[var(--bg-card)] border-[var(--text-primary)] shadow-md'
                          : 'bg-[var(--bg-card)] border-[var(--border-soft)] text-[var(--text-secondary)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <User className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5" />
                      {g === 'men' ? 'Men' : 'Women'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2.5 px-1">Difficulty</p>
                <div className="grid grid-cols-3 gap-2">
                  {LEVELS.map((l) => (
                    <button
                      key={l.key}
                      onClick={() => { setLevel(l.key); setCompletedExercises(new Set()); }}
                      className={`py-3 rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-wider border transition-all ${
                        level === l.key
                          ? 'border-transparent shadow-md'
                          : 'bg-[var(--bg-card)] border-[var(--border-soft)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                      style={level === l.key ? { backgroundColor: l.color, color: '#fff' } : {}}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Active Workout Card */}
          {activeWorkout && (
            <div
              className="rounded-2xl border border-[var(--border-soft)] overflow-hidden bg-[var(--bg-card)] animate-fade-in shadow-sm"
              key={activeWorkout.id}
            >
              <div
                className="p-4 border-b border-[var(--border-soft)]"
                style={{
                  background: `linear-gradient(135deg, ${timerColor}15 0%, transparent 100%)`,
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-[18px] md:text-[20px] font-black text-[var(--text-primary)] tracking-tight">
                      {activeWorkout.title}
                    </h3>
                    <p className="text-[var(--text-secondary)] text-[12px] font-medium mt-1 leading-snug">
                      {activeWorkout.tagline}
                    </p>
                  </div>
                  <div
                    className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                    style={{ backgroundColor: `${timerColor}25`, color: timerColor }}
                  >
                    {activeWorkout.duration}
                  </div>
                </div>

                {/* Start Workout Button */}
                <button
                  onClick={handleStartWorkout}
                  className="mt-3 w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-[12px] font-black uppercase tracking-wider transition-all active:scale-[0.98] border"
                  style={{
                    backgroundColor: completedExercises.size > 0 ? `${timerColor}15` : timerColor,
                    color: completedExercises.size > 0 ? timerColor : '#fff',
                    borderColor: completedExercises.size > 0 ? `${timerColor}40` : 'transparent',
                  }}
                >
                  {completedExercises.size > 0 ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Workout Complete — Restart
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" fill="currentColor" />
                      Start Workout
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 space-y-1.5">
                {(() => {
                  let exerciseNumber = 0;
                  return activeWorkout.exercises.map((ex, i) => {
                    const isRepeat = ex.name.toLowerCase().includes('repeat');
                    const isRest = isRepeat || ex.name.toLowerCase().includes('rest');

                    if (isRest) {
                      const BreakIcon = isRepeat ? Repeat : Timer;
                      exerciseNumber += 1;
                      const isCompleted = completedExercises.has(i);
                      const isCurrentlyActive = activeTimer?.exerciseIndex === i && activeTimer?.workoutId === activeWorkout.id;

                      return (
                        <button
                          key={i}
                          onClick={() => handleExerciseClick(i, ex)}
                          className={`w-full flex items-center gap-3 p-2.5 rounded-xl border transition-all text-left ${
                            isCurrentlyActive
                              ? 'border-[var(--brand)] bg-[var(--brand-soft)] shadow-sm'
                              : isCompleted
                              ? 'border-[var(--success-deep)]/30 bg-[var(--success-deep)]/5'
                              : 'bg-[var(--bg-soft)] border-dashed border-[var(--border-medium)] hover:border-[var(--border-soft)] hover:shadow-sm'
                          }`}
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            style={{
                              background: isCompleted
                                ? 'var(--success-deep)'
                                : `${timerColor}12`,
                            }}
                          >
                            <BreakIcon
                              className={`w-3.5 h-3.5 ${isCompleted ? 'text-white' : 'text-[var(--text-muted)]'}`}
                              strokeWidth={2.5}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-[12px] font-bold truncate ${
                              isCompleted ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-secondary)]'
                            }`}>
                              {isRepeat ? 'Repeat' : 'Rest'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {isCompleted && (
                              <span className="text-[9px] font-black text-[var(--success-deep)] uppercase tracking-wider">Done</span>
                            )}
                            <div
                              className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap"
                              style={{
                                backgroundColor: isCompleted ? 'var(--success-deep)' : `${timerColor}18`,
                                color: isCompleted ? '#fff' : timerColor,
                              }}
                            >
                              {ex.duration}
                            </div>
                          </div>
                        </button>
                      );
                    }

                    exerciseNumber += 1;
                    const isCompleted = completedExercises.has(i);
                    const isCurrentlyActive = activeTimer?.exerciseIndex === i && activeTimer?.workoutId === activeWorkout.id;

                    return (
                      <button
                        key={i}
                        onClick={() => handleExerciseClick(i, ex)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                          isCurrentlyActive
                            ? 'border-[var(--brand)] bg-[var(--brand-soft)] shadow-sm'
                            : isCompleted
                            ? 'border-[var(--success-deep)]/30 bg-[var(--success-deep)]/5'
                            : 'bg-[var(--bg-soft)] border-transparent hover:border-[var(--border-soft)] hover:shadow-sm'
                        }`}
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-black shrink-0"
                          style={{
                            background: isCompleted
                              ? 'var(--success-deep)'
                              : `linear-gradient(135deg, ${timerColor}28 0%, ${timerColor}10 100%)`,
                            color: isCompleted ? '#fff' : timerColor,
                          }}
                        >
                          {isCompleted ? (
                            <Check className="w-4 h-4" strokeWidth={3} />
                          ) : (
                            exerciseNumber
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[13px] md:text-[14px] font-bold truncate ${
                            isCompleted ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-primary)]'
                          }`}>
                            {ex.name}
                          </p>
                          {ex.reps && (
                            <p className="text-[10px] md:text-[11px] text-[var(--text-muted)] font-medium mt-0.5 truncate">{ex.reps}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {isCompleted && (
                            <span className="text-[9px] font-black text-[var(--success-deep)] uppercase tracking-wider">Done</span>
                          )}
                          <div
                            className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap"
                            style={{
                              backgroundColor: isCompleted ? 'var(--success-deep)' : `${timerColor}18`,
                              color: isCompleted ? '#fff' : timerColor,
                            }}
                          >
                            {ex.duration}
                          </div>
                        </div>
                      </button>
                    );
                  });
                })()}
              </div>

              <div className="p-4 bg-[var(--bg-soft)] border-t border-[var(--border-soft)]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[#f7cd63]/25">
                    <Sparkles className="w-4 h-4 text-[#b08d2e]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">Coach Tip</p>
                    <p className="text-[12px] md:text-[13px] text-[var(--text-primary)] font-medium leading-snug">
                      {activeWorkout.tip}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <p className="text-[10px] text-[var(--text-muted)] font-medium text-center px-2 leading-relaxed pt-2">
            Warm up for 3 minutes before starting. Stop immediately if you feel sharp pain.
          </p>
        </div>
      </div>

      {/* Timer Overlay */}
      {activeTimer && activeWorkout && (
        <ExerciseTimer
          key={`${activeTimer.exerciseIndex}-${activeTimer.exercise.name}`}
          exerciseName={activeTimer.exercise.name}
          duration={activeTimer.exercise.duration}
          color={timerColor}
          onComplete={handleTimerComplete}
        />
      )}

      {/* Add/Edit Workout Modal */}
      <AddWorkoutModal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setEditingWorkout(null); }}
        onSave={refreshCustom}
        editWorkout={editingWorkout}
      />
    </div>
  );
};
