import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, X, RotateCcw, SkipForward, SkipBack, Plus, Timer } from 'lucide-react';

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
  allExercises?: { name: string; duration: string }[];
  currentIndex?: number;
  onExerciseDetail?: (exerciseName: string, duration: string) => void;
}

const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const ExerciseTimer: React.FC<ExerciseTimerProps> = ({
  exerciseName, duration, color, onComplete, onNext, onPrevious,
  nextExercise, previousExercise, exerciseNumber, totalExercises,
  isRest = false, allExercises = [], currentIndex = 0, onExerciseDetail,
}) => {
  const totalSeconds = parseDuration(duration);
  const [remaining, setRemaining] = useState(totalSeconds);
  const [maxSeconds, setMaxSeconds] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [phase, setPhase] = useState<'countdown' | 'ready' | 'active' | 'rest-done'>('ready');
  const [countdownNum, setCountdownNum] = useState(3);
  const [addedFlash, setAddedFlash] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const flashRef = useRef<number | null>(null);
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
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return clearTimer;
  }, [isRunning, isDone, clearTimer]);

  useEffect(() => {
    if (phase !== 'countdown') return;
    if (countdownNum <= 0) {
      setPhase('active');
      setIsRunning(true);
      return;
    }
    const t = setTimeout(() => setCountdownNum((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdownNum]);

  useEffect(() => {
    if (phase !== 'ready' || !isRest) return;
    const t = setTimeout(() => {
      setPhase('active');
      setIsRunning(true);
    }, 300);
    return () => clearTimeout(t);
  }, [phase, isRest]);

  const progress = Math.min(Math.max(1 - remaining / maxSeconds, 0), 1);
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const handleStart = () => { setPhase('countdown'); setCountdownNum(3); setIsDone(false); setIsRunning(false); };
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
        {phase === 'countdown' ? (
          /* 3-2-1 Countdown */
          <div className="flex flex-col items-center gap-4">
            <h2
              className="text-[22px] sm:text-[26px] font-black text-center leading-tight tracking-tight"
              style={{ color: isRest ? '#fff' : 'var(--text-primary)' }}
            >
              {exerciseName}
            </h2>
            <span
              className="text-[80px] sm:text-[96px] font-black leading-none tabular-nums animate-pop-in"
              key={countdownNum}
              style={{ color: isRest ? '#fff' : accentColor }}
            >
              {countdownNum === 0 ? 'Go!' : countdownNum}
            </span>
          </div>
        ) : phase === 'ready' && isRest ? (
          /* Rest ready — auto-starts */
          <div className="flex flex-col items-center gap-4 animate-slide-up">
            <p className="text-[13px] font-bold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Rest
            </p>
            <span className="text-[72px] sm:text-[80px] font-black leading-none tabular-nums" style={{ color: '#fff' }}>
              {formatTime(remaining)}
            </span>
          </div>
        ) : phase === 'ready' ? (
          /* Exercise ready state */
          <div className="flex flex-col items-center gap-6 animate-slide-up">
            <p className="text-[14px] font-bold tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Ready to go!
            </p>
            <h2
              className="text-[22px] sm:text-[26px] font-black text-center leading-tight tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {exerciseName}
            </h2>
            <p className="text-[13px] font-medium" style={{ color: 'var(--text-muted)' }}>
              {duration}
            </p>
            <button
              onClick={handleStart}
              className="mt-4 w-full max-w-[280px] h-14 rounded-2xl flex items-center justify-center gap-3 text-[15px] font-bold transition-all active:scale-[0.97] shadow-lg"
              style={{ backgroundColor: accentColor, color: '#fff' }}
            >
              <Play className="w-5 h-5" fill="currentColor" />
              Start
            </button>
          </div>
        ) : isRest && !isDone ? (
          /* Active rest state — the main rest screen */
          <div className="flex flex-col items-center gap-5 w-full animate-slide-up">
            <p className="text-[13px] font-bold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Rest
            </p>

            {/* Timer ring */}
            <div className="relative w-[180px] h-[180px] sm:w-[200px] sm:h-[200px]">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180">
                <circle cx="90" cy="90" r={RADIUS} fill="transparent" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
                <circle
                  cx="90" cy="90" r={RADIUS} fill="transparent" stroke="#fff" strokeWidth="8"
                  strokeDasharray={CIRCUMFERENCE} strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round" className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[48px] sm:text-[56px] font-black leading-none tabular-nums" style={{ color: '#fff' }}>
                  {formatTime(remaining)}
                </span>
              </div>
            </div>

            {/* +20s and Skip */}
            <div className="flex items-center gap-3 mt-2">
              <div className="relative">
                <button
                  onClick={handleAddTime}
                  className="h-12 px-6 rounded-full flex items-center justify-center gap-2 text-[14px] font-bold transition-all active:scale-95"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
                >
                  <Plus className="w-4 h-4" />
                  +20s
                </button>
                {addedFlash && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[11px] font-black whitespace-nowrap animate-slide-down" style={{ backgroundColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>
                    +20s
                  </span>
                )}
              </div>
              <button
                onClick={handleSkip}
                className="h-12 px-6 rounded-full flex items-center justify-center gap-2 text-[14px] font-bold transition-all active:scale-95"
                style={{ backgroundColor: '#fff', color: accentColor }}
              >
                Skip
              </button>
            </div>
          </div>
        ) : (
          /* Active / Done state (exercise) */
          <div className="flex flex-col items-center gap-5 w-full">
            <h2
              className="text-[18px] sm:text-[20px] font-black text-center leading-tight tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {isDone ? 'Well Done!' : exerciseName}
            </h2>

            {isDone && allExercises.length > 0 ? (
              /* Exercise list view */
              <div className="w-full max-w-[360px] flex-1 overflow-y-auto -mx-2 px-2 pb-4">
                <div className="flex flex-col gap-1.5">
                  {allExercises.map((ex, i) => {
                    const completed = i < currentIndex;
                    const current = i === currentIndex;
                    return (
                      <button
                        key={i}
                        onClick={() => onExerciseDetail?.(ex.name, ex.duration)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left active:scale-[0.98]"
                        style={{
                          backgroundColor: current
                            ? isRest ? 'rgba(255,255,255,0.2)' : `${accentColor}15`
                            : 'transparent',
                        }}
                      >
                        {/* Status indicator */}
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold"
                          style={{
                            backgroundColor: completed
                              ? isRest ? 'rgba(255,255,255,0.25)' : `${accentColor}20`
                              : current
                                ? isRest ? '#fff' : accentColor
                                : isRest ? 'rgba(255,255,255,0.1)' : 'var(--bg-soft)',
                            color: completed
                              ? isRest ? '#fff' : accentColor
                              : current
                                ? '#fff'
                                : isRest ? 'rgba(255,255,255,0.4)' : 'var(--text-muted)',
                          }}
                        >
                          {completed ? '✓' : i + 1}
                        </div>

                        {/* Name + duration */}
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-[13px] font-bold truncate leading-tight"
                            style={{
                              color: completed
                                ? isRest ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)'
                                : isRest ? '#fff' : 'var(--text-primary)',
                              textDecoration: completed ? 'line-through' : 'none',
                            }}
                          >
                            {ex.name}
                          </p>
                          <p
                            className="text-[11px] font-medium tabular-nums"
                            style={{
                              color: completed
                                ? isRest ? 'rgba(255,255,255,0.4)' : 'var(--text-muted)'
                                : isRest ? 'rgba(255,255,255,0.7)' : accentColor,
                            }}
                          >
                            {ex.duration}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Timer ring */
              <>
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
                {!isDone && (
                  <p className="text-[12px] font-bold tracking-wider" style={{ color: isRest ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)' }}>
                    {Math.round(progress * 100)}% COMPLETE
                  </p>
                )}
              </>
            )}

            {/* Controls */}
            {isDone ? (
              <div className="flex flex-col items-center gap-3 w-full max-w-[320px] mt-2">
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
                    Continue
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="w-full h-12 rounded-2xl flex items-center justify-center gap-2 text-[14px] font-bold transition-all active:scale-[0.97]"
                  style={{
                    backgroundColor: isRest ? 'rgba(255,255,255,0.15)' : 'var(--bg-soft)',
                    color: isRest ? '#fff' : 'var(--text-primary)',
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                  Restart
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

                {/* Skip */}
                {nextExercise && (
                  <button
                    onClick={handleSkip}
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-all active:scale-90"
                    style={{
                      backgroundColor: 'var(--bg-soft)',
                    }}
                    title="Skip to next"
                  >
                    <SkipForward className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
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
          {isRest ? (
            /* Rest: show next exercise with illustration */
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    Next {exerciseNumber && totalExercises ? `${exerciseNumber + 1}/${totalExercises}` : ''}
                  </p>
                  <p className="text-[15px] font-black" style={{ color: '#fff' }}>
                    {nextExercise.name}
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-full text-[12px] font-bold" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff' }}>
                  {nextExercise.duration}
                </div>
              </div>
              {/* Silhouette preview */}
              <div className="w-full h-[140px] rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <svg width="80" height="120" viewBox="0 0 120 160" fill="none">
                  <circle cx="60" cy="22" r="14" fill="#fff" opacity="0.5" />
                  <rect x="48" y="36" width="24" height="50" rx="8" fill="#fff" opacity="0.4" />
                  <rect x="28" y="40" width="18" height="8" rx="4" fill="#fff" opacity="0.35" transform="rotate(-15 28 44)" />
                  <rect x="74" y="40" width="18" height="8" rx="4" fill="#fff" opacity="0.35" transform="rotate(15 74 44)" />
                  <rect x="44" y="86" width="10" height="44" rx="5" fill="#fff" opacity="0.35" transform="rotate(-5 44 86)" />
                  <rect x="66" y="86" width="10" height="44" rx="5" fill="#fff" opacity="0.35" transform="rotate(5 66 86)" />
                  <rect x="38" y="128" width="16" height="6" rx="3" fill="#fff" opacity="0.3" />
                  <rect x="66" y="128" width="16" height="6" rx="3" fill="#fff" opacity="0.3" />
                </svg>
              </div>
            </div>
          ) : (
            /* Exercise: simple next preview */
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
                  Next
                </p>
                <p className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>
                  {nextExercise.name}
                </p>
              </div>
              <div className="px-3 py-1.5 rounded-full text-[12px] font-bold" style={{ backgroundColor: `${color}15`, color }}>
                {nextExercise.duration}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
