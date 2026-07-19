import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, X, RotateCcw, SkipForward, SkipBack, Plus, Timer } from 'lucide-react';
import { useTimerSettings, playSound, playTick } from '../utils/timerSettings';

function parseDuration(str: string): number {
  const s = str.toLowerCase().trim();
  const minMatch = s.match(/(\d+)\s*min/);
  const secMatch = s.match(/(\d+)\s*sec/);
  let seconds = 0;
  if (minMatch) seconds += parseInt(minMatch[1], 10) * 60;
  if (secMatch) seconds += parseInt(secMatch[1], 10);
  if (seconds === 0) {
    const num = s.match(/(\d+)/);
    if (num) seconds = parseInt(num[1], 10);
  }
  return Math.max(seconds, 1);
}

function formatTime(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const REST_QUOTES = [
  'Pause to breathe, not to quit — growth never sleeps!',
  'Rest is part of the workout. Own it.',
  'Breathe. Recover. Come back stronger.',
  'The break makes the next set count.',
  'Strength is built in the pauses.',
];

interface ExerciseTimerProps {
  exerciseName: string;
  duration: string;
  color: string;
  onComplete: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  nextExercise?: { name: string; duration: string } | null;
  previousExercise?: { name: string; duration: string } | null;
  exerciseNumber?: number;
  totalExercises?: number;
  isRest?: boolean;
}

const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const ExerciseTimer: React.FC<ExerciseTimerProps> = ({
  exerciseName, duration, color, onComplete, onNext, onPrevious,
  nextExercise, previousExercise, exerciseNumber, totalExercises,
  isRest = false,
}) => {
  const totalSeconds = parseDuration(duration);
  const [remaining, setRemaining] = useState(totalSeconds);
  const [maxSeconds, setMaxSeconds] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [phase, setPhase] = useState<'ready' | 'active' | 'rest-done'>('ready');
  const [addedFlash, setAddedFlash] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const flashRef = useRef<number | null>(null);
  const { settings } = useTimerSettings();
  const quote = REST_QUOTES[Math.floor(Math.random() * REST_QUOTES.length)];

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTimer();
      if (flashRef.current) clearTimeout(flashRef.current);
    };
  }, [clearTimer]);

  useEffect(() => {
    if (!isRunning || isDone) return;
    intervalRef.current = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearTimer();
          setIsDone(true);
          setIsRunning(false);
          setPhase('rest-done');
          playSound(settings.sound, settings.volume);
          return 0;
        }
        if (prev <= 4 && settings.tickEnabled) playTick(settings.volume);
        return prev - 1;
      });
    }, 1000);
    return clearTimer;
  }, [isRunning, isDone, clearTimer, settings]);

  const progress = Math.min(Math.max(1 - remaining / maxSeconds, 0), 1);
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const handleStart = () => { setPhase('active'); setIsDone(false); setIsRunning(true); };
  const handlePause = () => setIsRunning(false);
  const handleResume = () => setIsRunning(true);
  const handleReset = () => { clearTimer(); setRemaining(totalSeconds); setMaxSeconds(totalSeconds); setIsRunning(false); setIsDone(false); setPhase('ready'); };
  const handleClose = () => { clearTimer(); onComplete(); };
  const handleSkip = () => { clearTimer(); onComplete(); };
  const handlePrevious = () => { clearTimer(); onPrevious?.(); };
  const handleAddTime = () => {
    setRemaining((p) => p + 20);
    setMaxSeconds((p) => p + 20);
    setAddedFlash(true);
    if (flashRef.current) clearTimeout(flashRef.current);
    flashRef.current = window.setTimeout(() => setAddedFlash(false), 800);
  };
  const handleFinish = () => { clearTimer(); onComplete(); };

  const accentColor = isRest ? '#4e8ef7' : color;
  const isLightBg = !isRest;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col animate-fade-in" style={{ backgroundColor: isRest ? accentColor : 'var(--bg-page)' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 safe-area-top">
          <button
            onClick={handleClose}
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 touch-manipulation"
            style={{ touchAction: 'manipulation', backgroundColor: isRest ? 'rgba(255,255,255,0.15)' : 'var(--bg-soft)' }}
          >
          <X className="w-5 h-5" style={{ color: isRest ? '#fff' : 'var(--text-primary)' }} />
        </button>
        {exerciseNumber && totalExercises && (
          <div
            className="px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider"
            style={{
              backgroundColor: isRest ? 'rgba(255,255,255,0.15)' : `${color}15`,
              color: isRest ? '#fff' : color,
            }}
          >
            {exerciseNumber}/{totalExercises}
          </div>
        )}
        <div className="w-11 h-11" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {phase === 'ready' ? (
          /* Ready state */
          <div className="flex flex-col items-center gap-6 animate-slide-up">
            <p className="text-[14px] font-bold tracking-wide" style={{ color: isRest ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}>
              {isRest ? 'Take a break' : 'Ready to go!'}
            </p>
            <h2
              className="text-[22px] sm:text-[26px] font-black text-center leading-tight tracking-tight"
              style={{ color: isRest ? '#fff' : 'var(--text-primary)' }}
            >
              {exerciseName}
            </h2>
            {!isRest && (
              <p className="text-[13px] font-medium" style={{ color: 'var(--text-muted)' }}>
                {duration}
              </p>
            )}
            {isRest && (
              <p className="text-[13px] font-medium text-center max-w-[280px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                "{quote}"
              </p>
            )}

            {/* Start button */}
            <button
              onClick={handleStart}
              className="mt-4 w-full max-w-[280px] h-14 rounded-2xl flex items-center justify-center gap-3 text-[15px] font-bold transition-all active:scale-[0.97] shadow-lg"
              style={{
                backgroundColor: isRest ? '#fff' : accentColor,
                color: isRest ? accentColor : '#fff',
              }}
            >
              <Play className="w-5 h-5" fill="currentColor" />
              Start
            </button>
          </div>
        ) : (
          /* Active / Done state */
          <div className="flex flex-col items-center gap-5">
            {/* Exercise name */}
            <h2
              className="text-[18px] sm:text-[20px] font-black text-center leading-tight tracking-tight"
              style={{ color: isRest ? '#fff' : 'var(--text-primary)' }}
            >
              {isDone ? (isRest ? 'Rest Complete!' : 'Well Done!') : exerciseName}
            </h2>

            {/* Timer ring */}
            <div className="relative w-[200px] h-[200px] sm:w-[240px] sm:h-[240px]">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180">
                <circle
                  cx="90" cy="90" r={RADIUS}
                  fill="transparent"
                  stroke={isRest ? 'rgba(255,255,255,0.15)' : 'var(--border-soft)'}
                  strokeWidth="8"
                />
                <circle
                  cx="90" cy="90" r={RADIUS}
                  fill="transparent"
                  stroke={isDone ? (isRest ? '#fff' : 'var(--success-deep)') : '#fff'}
                  strokeWidth="8"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-linear"
                  style={{ filter: isRest ? 'none' : `drop-shadow(0 0 8px ${accentColor}40)` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {isDone ? (
                  <span className="text-[32px] sm:text-[40px] font-black" style={{ color: isRest ? '#fff' : 'var(--success-deep)' }}>
                    {isRest ? '✓' : 'Done!'}
                  </span>
                ) : (
                  <span className="text-[48px] sm:text-[56px] font-black leading-none tabular-nums" style={{ color: isRest ? '#fff' : 'var(--text-primary)' }}>
                    {formatTime(remaining)}
                  </span>
                )}
              </div>
            </div>

            {/* Progress text */}
            {!isDone && (
              <p className="text-[12px] font-bold tracking-wider" style={{ color: isRest ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)' }}>
                {Math.round(progress * 100)}% COMPLETE
              </p>
            )}

            {/* Controls */}
            {isDone ? (
              <div className="flex flex-col items-center gap-3 w-full max-w-[280px] mt-2">
                {nextExercise && (
                  <button
                    onClick={onNext}
                    className="w-full h-14 rounded-2xl flex items-center justify-center gap-3 text-[15px] font-bold transition-all active:scale-[0.97] shadow-lg"
                    style={{
                      backgroundColor: isRest ? '#fff' : accentColor,
                      color: isRest ? accentColor : '#fff',
                    }}
                  >
                    <SkipForward className="w-5 h-5" />
                    Next: {nextExercise.name}
                  </button>
                )}
                <button
                  onClick={handleFinish}
                  className="w-full h-12 rounded-2xl flex items-center justify-center gap-2 text-[14px] font-bold transition-all active:scale-[0.97]"
                  style={{
                    backgroundColor: isRest ? 'rgba(255,255,255,0.15)' : 'var(--bg-soft)',
                    color: isRest ? '#fff' : 'var(--text-primary)',
                  }}
                >
                  Finish Workout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 w-full max-w-[280px] mt-2">
                {/* Reset */}
                <button
                  onClick={handleReset}
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-90"
                  style={{
                    backgroundColor: isRest ? 'rgba(255,255,255,0.15)' : 'var(--bg-soft)',
                  }}
                  title="Reset"
                >
                  <RotateCcw className="w-4 h-4" style={{ color: isRest ? '#fff' : 'var(--text-primary)' }} />
                </button>

                {/* Play/Pause */}
                {isRunning ? (
                  <button
                    onClick={handlePause}
                    className="flex-1 h-14 rounded-2xl flex items-center justify-center gap-2 text-[15px] font-bold transition-all active:scale-[0.97] shadow-lg"
                    style={{ backgroundColor: '#fff', color: accentColor }}
                  >
                    <Pause className="w-5 h-5" fill="currentColor" />
                    Pause
                  </button>
                ) : remaining < totalSeconds ? (
                  <button
                    onClick={handleResume}
                    className="flex-1 h-14 rounded-2xl flex items-center justify-center gap-2 text-[15px] font-bold transition-all active:scale-[0.97] shadow-lg"
                    style={{ backgroundColor: '#fff', color: accentColor }}
                  >
                    <Play className="w-5 h-5" fill="currentColor" />
                    Resume
                  </button>
                ) : (
                  <button
                    onClick={handleStart}
                    className="flex-1 h-14 rounded-2xl flex items-center justify-center gap-2 text-[15px] font-bold transition-all active:scale-[0.97] shadow-lg"
                    style={{ backgroundColor: '#fff', color: accentColor }}
                  >
                    <Play className="w-5 h-5" fill="currentColor" />
                    Start
                  </button>
                )}

                {/* Add 20s */}
                <div className="relative">
                  <button
                    onClick={handleAddTime}
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-90"
                    style={{
                      backgroundColor: isRest ? 'rgba(255,255,255,0.15)' : 'var(--bg-soft)',
                    }}
                    title="+20 seconds"
                  >
                    <Plus className="w-4 h-4" style={{ color: isRest ? '#fff' : 'var(--text-primary)' }} />
                  </button>
                  {addedFlash && (
                    <span
                      className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[11px] font-black whitespace-nowrap animate-slide-down"
                      style={{
                        backgroundColor: isRest ? 'rgba(255,255,255,0.25)' : `${color}20`,
                        color: isRest ? '#fff' : color,
                      }}
                    >
                      +20s
                    </span>
                  )}
                </div>

                {/* Next / Skip */}
                {nextExercise && (
                  <button
                    onClick={handleSkip}
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-90"
                    style={{
                      backgroundColor: isRest ? 'rgba(255,255,255,0.15)' : 'var(--bg-soft)',
                    }}
                    title="Skip to next"
                  >
                    <SkipForward className="w-4 h-4" style={{ color: isRest ? '#fff' : 'var(--text-primary)' }} />
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom: next exercise preview */}
      {nextExercise && !isDone && (
        <div
          className="px-6 pb-8 pt-4 safe-area-bottom"
          style={{ borderTop: isRest ? '1px solid rgba(255,255,255,0.1)' : '1px solid var(--border-soft)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: isRest ? 'rgba(255,255,255,0.5)' : 'var(--text-muted)' }}>
                Next
              </p>
              <p className="text-[14px] font-bold" style={{ color: isRest ? '#fff' : 'var(--text-primary)' }}>
                {nextExercise.name}
              </p>
            </div>
            <div
              className="px-3 py-1.5 rounded-full text-[12px] font-bold"
              style={{
                backgroundColor: isRest ? 'rgba(255,255,255,0.15)' : `${color}15`,
                color: isRest ? '#fff' : color,
              }}
            >
              {nextExercise.duration}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
