import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, X, RotateCcw } from 'lucide-react';
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
  return m > 0 ? `${m}:${String(s).padStart(2, '0')}` : `${s}`;
}

interface ExerciseTimerProps {
  exerciseName: string;
  duration: string;
  color: string;
  onComplete: () => void;
}

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const ExerciseTimer: React.FC<ExerciseTimerProps> = ({
  exerciseName, duration, color, onComplete,
}) => {
  const totalSeconds = parseDuration(duration);
  const [remaining, setRemaining] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const { settings } = useTimerSettings();

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => { return clearTimer; }, [clearTimer]);

  useEffect(() => {
    if (!isRunning || isDone) return;
    intervalRef.current = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearTimer();
          setIsDone(true);
          setIsRunning(false);
          playSound(settings.sound, settings.volume);
          return 0;
        }
        if (prev <= 4 && settings.tickEnabled) playTick(settings.volume);
        return prev - 1;
      });
    }, 1000);
    return clearTimer;
  }, [isRunning, isDone, clearTimer, settings]);

  const progress = 1 - remaining / totalSeconds;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const handleStart = () => { setIsDone(false); setIsRunning(true); };
  const handlePause = () => setIsRunning(false);
  const handleResume = () => setIsRunning(true);
  const handleReset = () => { clearTimer(); setRemaining(totalSeconds); setIsRunning(false); setIsDone(false); };
  const handleClose = () => { clearTimer(); onComplete(); };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={handleClose} />
      <div className="relative bg-[var(--bg-card)] rounded-3xl border border-[var(--border-soft)] shadow-2xl w-full max-w-[340px] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="px-5 pt-5 pb-3 flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Now Playing</p>
            <h3 className="text-[17px] font-black text-[var(--text-primary)] tracking-tight mt-1 truncate">{exerciseName}</h3>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--bg-soft)] hover:bg-[var(--border-medium)] transition-all active:scale-95 shrink-0"
          >
            <X className="w-4 h-4 text-[var(--text-primary)]" />
          </button>
        </div>

        {/* Timer Ring */}
        <div className="flex items-center justify-center py-6">
          <div className="relative w-[130px] h-[130px]">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={RADIUS} fill="transparent" stroke="var(--border-soft)" strokeWidth="6" />
              <circle
                cx="60" cy="60" r={RADIUS}
                fill="transparent"
                stroke={isDone ? 'var(--success-deep)' : color}
                strokeWidth="6"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {isDone ? (
                <span className="text-[28px] font-black" style={{ color: 'var(--success-deep)' }}>Done!</span>
              ) : (
                <>
                  <span className="text-[36px] font-black text-[var(--text-primary)] leading-none tabular-nums">
                    {formatTime(remaining)}
                  </span>
                  <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">
                    {Math.round(progress * 100)}%
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="px-5 pb-5 flex items-center justify-center gap-3">
          <button
            onClick={handleReset}
            className="w-11 h-11 rounded-full flex items-center justify-center bg-[var(--bg-soft)] border border-[var(--border-soft)] hover:bg-[var(--border-medium)] transition-all active:scale-95"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4 text-[var(--text-primary)]" />
          </button>

          {isDone ? (
            <button
              onClick={handleClose}
              className="flex-1 h-12 rounded-full flex items-center justify-center gap-2 text-[14px] font-bold transition-all active:scale-[0.98]"
              style={{ backgroundColor: color, color: '#fff' }}
            >
              Finish
            </button>
          ) : isRunning ? (
            <button
              onClick={handlePause}
              className="flex-1 h-12 rounded-full flex items-center justify-center gap-2 text-[14px] font-bold transition-all active:scale-[0.98]"
              style={{ backgroundColor: color, color: '#fff' }}
            >
              <Pause className="w-4 h-4" fill="currentColor" />
              Pause
            </button>
          ) : remaining < totalSeconds ? (
            <button
              onClick={handleResume}
              className="flex-1 h-12 rounded-full flex items-center justify-center gap-2 text-[14px] font-bold transition-all active:scale-[0.98]"
              style={{ backgroundColor: color, color: '#fff' }}
            >
              <Play className="w-4 h-4" fill="currentColor" />
              Resume
            </button>
          ) : (
            <button
              onClick={handleStart}
              className="flex-1 h-12 rounded-full flex items-center justify-center gap-2 text-[14px] font-bold transition-all active:scale-[0.98]"
              style={{ backgroundColor: color, color: '#fff' }}
            >
              <Play className="w-4 h-4" fill="currentColor" />
              Start
            </button>
          )}
        </div>

        {/* Duration label */}
        <div className="px-5 pb-4 text-center">
          <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
            {duration}
          </span>
        </div>
      </div>
    </div>
  );
};
