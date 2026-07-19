import React from 'react';
import { X, ChevronLeft, ChevronRight, AlertTriangle, Dumbbell } from 'lucide-react';
import { EXERCISE_DETAILS, type ExerciseDetail as ExerciseDetailType } from '../utils/workouts';

interface ExerciseDetailProps {
  exerciseName: string;
  duration: string;
  color: string;
  currentIndex: number;
  totalExercises: number;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
}

function ExerciseSilhouette({ color }: { color: string }) {
  return (
    <div className="w-full aspect-[4/3] rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${color}10` }}>
      <svg width="120" height="160" viewBox="0 0 120 160" fill="none">
        {/* Head */}
        <circle cx="60" cy="22" r="14" fill={color} opacity="0.7" />
        {/* Body */}
        <rect x="48" y="36" width="24" height="50" rx="8" fill={color} opacity="0.6" />
        {/* Left arm */}
        <rect x="28" y="40" width="18" height="8" rx="4" fill={color} opacity="0.5" transform="rotate(-15 28 44)" />
        {/* Right arm */}
        <rect x="74" y="40" width="18" height="8" rx="4" fill={color} opacity="0.5" transform="rotate(15 74 44)" />
        {/* Left leg */}
        <rect x="44" y="86" width="10" height="44" rx="5" fill={color} opacity="0.5" transform="rotate(-5 44 86)" />
        {/* Right leg */}
        <rect x="66" y="86" width="10" height="44" rx="5" fill={color} opacity="0.5" transform="rotate(5 66 86)" />
        {/* Left foot */}
        <rect x="38" y="128" width="16" height="6" rx="3" fill={color} opacity="0.4" />
        {/* Right foot */}
        <rect x="66" y="128" width="16" height="6" rx="3" fill={color} opacity="0.4" />
      </svg>
    </div>
  );
}

export const ExerciseDetail: React.FC<ExerciseDetailProps> = ({
  exerciseName, duration, color, currentIndex, totalExercises,
  onClose, onPrevious, onNext,
}) => {
  const detail: ExerciseDetailType | undefined = EXERCISE_DETAILS[exerciseName];

  return (
    <div className="fixed inset-0 z-[250] flex flex-col animate-fade-in" style={{ backgroundColor: 'var(--bg-page)' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 safe-area-top">
        <button
          onClick={onClose}
          className="w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90"
          style={{ backgroundColor: 'var(--bg-soft)' }}
        >
          <X className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevious}
            disabled={!onPrevious}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 disabled:opacity-30"
            style={{ backgroundColor: 'var(--bg-soft)' }}
          >
            <ChevronLeft className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
          </button>
          <span className="text-[13px] font-bold tabular-nums" style={{ color: 'var(--text-muted)' }}>
            {currentIndex + 1}/{totalExercises}
          </span>
          <button
            onClick={onNext}
            disabled={!onNext}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 disabled:opacity-30"
            style={{ backgroundColor: 'var(--bg-soft)' }}
          >
            <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-5 pb-8">
        <div className="max-w-[400px] mx-auto flex flex-col gap-5">
          {/* Exercise name */}
          <h1 className="text-[22px] sm:text-[26px] font-black leading-tight tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {exerciseName}
          </h1>

          {/* Illustration */}
          <ExerciseSilhouette color={color} />

          {/* Duration */}
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-bold" style={{ color: 'var(--text-muted)' }}>Duration</span>
            <span className="text-[15px] font-black tabular-nums" style={{ color: 'var(--text-primary)' }}>{duration}</span>
          </div>

          {/* Description */}
          {detail && (
            <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {detail.description}
            </p>
          )}

          {/* Muscles worked */}
          {detail && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ backgroundColor: `${color}10` }}>
              <Dumbbell className="w-4 h-4 flex-shrink-0" style={{ color }} />
              <span className="text-[12px] font-bold" style={{ color }}>{detail.musclesWorked}</span>
            </div>
          )}

          {/* Common Mistakes */}
          {detail && detail.commonMistakes.length > 0 && (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" style={{ color: '#f59e0b' }} />
                <span className="text-[14px] font-black" style={{ color: '#f59e0b' }}>Common Mistakes</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {detail.commonMistakes.map((mistake, i) => (
                  <div key={i} className="flex items-start gap-2.5 px-3 py-2 rounded-xl" style={{ backgroundColor: 'var(--bg-soft)' }}>
                    <span className="text-[11px] font-bold mt-0.5 flex-shrink-0" style={{ color: '#f59e0b' }}>•</span>
                    <span className="text-[13px] leading-snug" style={{ color: 'var(--text-secondary)' }}>{mistake}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fallback if no detail data */}
          {!detail && (
            <p className="text-[13px] italic" style={{ color: 'var(--text-muted)' }}>
              No detailed instructions available for this exercise yet.
            </p>
          )}
        </div>
      </div>

      {/* Bottom nav */}
      <div
        className="px-5 pb-6 pt-3 safe-area-bottom flex items-center justify-between"
        style={{ borderTop: '1px solid var(--border-soft)' }}
      >
        <button
          onClick={onPrevious}
          disabled={!onPrevious}
          className="h-11 px-5 rounded-xl flex items-center justify-center gap-1.5 text-[13px] font-bold transition-all active:scale-[0.97] disabled:opacity-30"
          style={{ backgroundColor: 'var(--bg-soft)', color: 'var(--text-primary)' }}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        <button
          onClick={onClose}
          className="h-11 px-6 rounded-xl flex items-center justify-center text-[13px] font-bold transition-all active:scale-[0.97]"
          style={{ backgroundColor: color, color: '#fff' }}
        >
          Close
        </button>
        <button
          onClick={onNext}
          disabled={!onNext}
          className="h-11 px-5 rounded-xl flex items-center justify-center gap-1.5 text-[13px] font-bold transition-all active:scale-[0.97] disabled:opacity-30"
          style={{ backgroundColor: 'var(--bg-soft)', color: 'var(--text-primary)' }}
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
