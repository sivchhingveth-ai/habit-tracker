import React, { useState, useCallback } from 'react';
import { Sparkles, User, Timer, Repeat, Play, Check } from 'lucide-react';
import { Tabs } from './Tabs';
import { ExerciseTimer } from './ExerciseTimer';
import { WORKOUTS, WORKOUT_QUOTES, Gender, Level, Workout, Exercise } from '../utils/workouts';

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

  const quote = WORKOUT_QUOTES[Math.floor(Math.random() * WORKOUT_QUOTES.length)];
  const workout: Workout | undefined = WORKOUTS.find(
    (w) => w.gender === gender && w.level === level
  );
  const levelMeta = LEVELS.find((l) => l.key === level)!;

  const handleExerciseClick = useCallback((index: number, exercise: Exercise) => {
    setActiveTimer({ exerciseIndex: index, exercise });
  }, []);

  const handleTimerComplete = useCallback(() => {
    if (activeTimer) {
      setCompletedExercises((prev) => new Set(prev).add(activeTimer.exerciseIndex));
      setActiveTimer(null);
    }
  }, [activeTimer]);

  const handleStartWorkout = useCallback(() => {
    setCompletedExercises(new Set());
    if (workout) {
      const firstExIndex = workout.exercises.findIndex(
        (ex) => !ex.name.toLowerCase().includes('rest') && !ex.name.toLowerCase().includes('repeat')
      );
      if (firstExIndex >= 0) {
        setActiveTimer({ exerciseIndex: firstExIndex, exercise: workout.exercises[firstExIndex] });
      }
    }
  }, [workout]);

  const handleWorkoutComplete = useCallback(() => {
    setCompletedExercises(new Set());
  }, []);

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
          className="p-5 md:p-6 space-y-5 animate-slide-up"
          style={{ paddingBottom: 'max(8rem, env(safe-area-inset-bottom) + 4rem)' }}
        >
          <div>
            <h2 className="text-[22px] md:text-[26px] font-black text-[var(--text-primary)] leading-tight tracking-tight">
              Gym
            </h2>
            <p className="text-[var(--text-muted)] text-[13px] font-medium mt-1">
              Pick a level. Show up. Earn it.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-[var(--border-soft)] bg-gradient-to-br from-[#f7cd63]/15 to-[#fc8fc6]/10 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-[#b08d2e] shrink-0 mt-0.5" />
            <p className="text-[13px] md:text-[14px] text-[var(--text-primary)] font-bold leading-snug italic">
              "{quote}"
            </p>
          </div>

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

          {workout && (
            <div
              className="rounded-2xl border border-[var(--border-soft)] overflow-hidden bg-[var(--bg-card)] animate-fade-in shadow-sm"
              key={`${gender}-${level}`}
            >
              <div
                className="p-4 border-b border-[var(--border-soft)]"
                style={{
                  background: `linear-gradient(135deg, ${levelMeta.color}15 0%, transparent 100%)`,
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-[18px] md:text-[20px] font-black text-[var(--text-primary)] tracking-tight">
                      {workout.title}
                    </h3>
                    <p className="text-[var(--text-secondary)] text-[12px] font-medium mt-1 leading-snug">
                      {workout.tagline}
                    </p>
                  </div>
                  <div
                    className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                    style={{ backgroundColor: `${levelMeta.color}25`, color: levelMeta.color }}
                  >
                    {workout.duration}
                  </div>
                </div>

                {/* Start Workout Button */}
                <button
                  onClick={handleStartWorkout}
                  className="mt-3 w-full py-2.5 rounded-xl flex items-center justify-center gap-2 text-[12px] font-black uppercase tracking-wider transition-all active:scale-[0.98] border"
                  style={{
                    backgroundColor: completedExercises.size > 0 ? `${levelMeta.color}15` : levelMeta.color,
                    color: completedExercises.size > 0 ? levelMeta.color : '#fff',
                    borderColor: completedExercises.size > 0 ? `${levelMeta.color}40` : 'transparent',
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
                  return workout.exercises.map((ex, i) => {
                    const isRepeat = ex.name.toLowerCase().includes('repeat');
                    const isRest = isRepeat || ex.name.toLowerCase().includes('rest');

                    if (isRest) {
                      const BreakIcon = isRepeat ? Repeat : Timer;
                      return (
                        <div key={i} className="flex items-center gap-2.5 py-1">
                          <div className="flex-1 border-t border-dashed border-[var(--border-medium)]" />
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-[var(--border-medium)] bg-[var(--bg-soft)] shrink-0">
                            <BreakIcon className="w-3 h-3 text-[var(--text-muted)]" strokeWidth={2.5} />
                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] whitespace-nowrap">
                              {ex.name} · {ex.duration}
                            </span>
                          </div>
                          <div className="flex-1 border-t border-dashed border-[var(--border-medium)]" />
                        </div>
                      );
                    }

                    exerciseNumber += 1;
                    const isCompleted = completedExercises.has(i);
                    const isCurrentlyActive = activeTimer?.exerciseIndex === i;

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
                              : `linear-gradient(135deg, ${levelMeta.color}28 0%, ${levelMeta.color}10 100%)`,
                            color: isCompleted ? '#fff' : levelMeta.color,
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
                              backgroundColor: isCompleted ? 'var(--success-deep)' : `${levelMeta.color}18`,
                              color: isCompleted ? '#fff' : levelMeta.color,
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
                      {workout.tip}
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
      {activeTimer && workout && (
        <ExerciseTimer
          key={`${activeTimer.exerciseIndex}-${activeTimer.exercise.name}`}
          exerciseName={activeTimer.exercise.name}
          duration={activeTimer.exercise.duration}
          color={levelMeta.color}
          onComplete={handleTimerComplete}
        />
      )}
    </div>
  );
};
