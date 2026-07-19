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
  onClose?: () => void;
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
  autoStart?: boolean;
  restDuration?: number;
}

function speakDuration(dur: string): string {
  const s = dur.toLowerCase().trim();
  const minMatch = s.match(/(\d+)\s*min/);
  const secMatch = s.match(/(\d+)\s*sec/);
  let parts: string[] = [];
  if (minMatch) {
    const m = parseInt(minMatch[1], 10);
    parts.push(m === 1 ? '1 minute' : `${m} minutes`);
  }
  if (secMatch) {
    const sec = parseInt(secMatch[1], 10);
    parts.push(sec === 1 ? '1 second' : `${sec} seconds`);
  }
  if (parts.length === 0) {
    const num = s.match(/(\d+)/);
    if (num) parts.push(`${num[1]} seconds`);
  }
  return parts.join(', ') || dur;
}

function cleanForSpeech(text: string): string {
  return text
    .replace(/-/g, ' ')
    .replace(/\(/g, '')
    .replace(/\)/g, '')
    .replace(/\//g, ' or ')
    .replace(/\bUps\b/gi, 'ups')
    .replace(/\bPush\b/gi, 'push')
    .replace(/\bPull\b/gi, 'pull')
    .replace(/\bSquat\b/gi, 'squat')
    .replace(/\bPlank\b/gi, 'plank')
    .replace(/\bBurpee\b/gi, 'burpee')
    .replace(/\bLunge\b/gi, 'lunge')
    .replace(/\bBridge\b/gi, 'bridge')
    .replace(/\bDip\b/gi, 'dip')
    .replace(/\bHold\b/gi, 'hold')
    .replace(/\bJack\b/gi, 'jack')
    .replace(/\bClimber\b/gi, 'climber')
    .replace(/\bTap\b/gi, 'tap')
    .replace(/\bJump\b/gi, 'jump')
    .replace(/\bSkater\b/gi, 'skater')
    .replace(/\bMarch\b/gi, 'march')
    .replace(/\bStretch\b/gi, 'stretch')
    .replace(/\bKickback\b/gi, 'kickback')
    .replace(/\bRow\b/gi, 'row')
    .replace(/\bRaise\b/gi, 'raise')
    .replace(/\bBend\b/gi, 'bend')
    .replace(/\bHinge\b/gi, 'hinge')
    .replace(/\bStand\b/gi, 'stand')
    .replace(/\bWall\b/gi, 'wall')
    .replace(/\bRegular\b/gi, 'regular')
    .replace(/\bWide[\s-]*Grip\b/gi, 'wide grip')
    .replace(/\bIncline\b/gi, 'incline')
    .replace(/\bKnee\b/gi, 'knee')
    .replace(/\bDiamond\b/gi, 'diamond')
    .replace(/\bArcher\b/gi, 'archer')
    .replace(/\bBulgarian\b/gi, 'bulgarian')
    .replace(/\bPistol\b/gi, 'pistol')
    .replace(/\bForearm\b/gi, 'forearm')
    .replace(/\bSumo\b/gi, 'sumo')
    .replace(/\bReverse\b/gi, 'reverse')
    .replace(/\bWalking\b/gi, 'walking')
    .replace(/\bStanding\b/gi, 'standing')
    .replace(/\bSide\b/gi, 'side')
    .replace(/\bGlute\b/gi, 'glute')
    .replace(/\bCat[\s-]*Cow\b/gi, 'cat cow')
    .replace(/\bShoulder\b/gi, 'shoulder')
    .replace(/\bMountain\b/gi, 'mountain')
    .replace(/\bTricep\b/gi, 'tricep')
    .replace(/\bCalf\b/gi, 'calf')
    .replace(/\bSplayed\b/gi, 'splayed')
    .replace(/\bCross[\s-]*Leg\b/gi, 'cross leg')
    .replace(/\bHip\b/gi, 'hip')
    .replace(/\bRepeat\b/gi, 'repeat')
    .replace(/\bRest\b/gi, 'rest')
    .replace(/\s+/g, ' ')
    .trim();
}

function speak(text: string) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const cleaned = cleanForSpeech(text);
  const u = new SpeechSynthesisUtterance(cleaned);
  u.rate = 0.85;
  u.pitch = 0.7;
  u.volume = 1;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find((v) => v.name.includes('Daniel'));
  const male = voices.find((v) => v.name.toLowerCase().includes('male'));
  const english = voices.find((v) => v.lang.startsWith('en') && v.name.toLowerCase().includes('english'));
  u.voice = preferred || male || english || voices[0];
  window.speechSynthesis.speak(u);
}

const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const ExerciseTimer: React.FC<ExerciseTimerProps> = ({
  exerciseName, duration, color, onComplete, onClose, onNext, onPrevious,
  nextExercise, previousExercise, exerciseNumber, totalExercises,
  isRest = false, allExercises = [], currentIndex = 0, onExerciseDetail, autoStart = false, restDuration = 30,
}) => {
  const totalSeconds = isRest ? restDuration : parseDuration(duration);
  const [remaining, setRemaining] = useState(totalSeconds);
  const [maxSeconds, setMaxSeconds] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [phase, setPhase] = useState<'countdown' | 'ready' | 'active' | 'rest-done'>('ready');
  const [countdownNum, setCountdownNum] = useState(3);
  const [addedFlash, setAddedFlash] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const flashRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const spokenRef = useRef<{ half: boolean; ten: boolean; three: boolean; two: boolean; one: boolean }>({ half: false, ten: false, three: false, two: false, one: false });
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
    startRef.current = Date.now();
    spokenRef.current = { half: false, ten: false, three: false, two: false, one: false };
    const halfMark = Math.round(totalSeconds / 2 / 5) * 5;
    const tick = () => {
      const elapsed = (Date.now() - startRef.current) / 1000;
      const left = Math.max(0, totalSeconds - Math.floor(elapsed));
      setRemaining(left);
      if (!isRest) {
        const elapsedWhole = Math.floor(elapsed);
        if (!spokenRef.current.half && elapsedWhole >= totalSeconds - halfMark) {
          spokenRef.current.half = true;
          speak(`${halfMark} seconds left`);
        }
        if (!spokenRef.current.ten && elapsedWhole >= totalSeconds - 10) {
          spokenRef.current.ten = true;
          speak('10 seconds left');
        }
        if (!spokenRef.current.three && elapsedWhole >= totalSeconds - 3) {
          spokenRef.current.three = true;
          speak('3');
        }
        if (!spokenRef.current.two && elapsedWhole >= totalSeconds - 2) {
          spokenRef.current.two = true;
          speak('2');
        }
        if (!spokenRef.current.one && elapsedWhole >= totalSeconds - 1) {
          spokenRef.current.one = true;
          speak('1');
        }
      }
      if (left <= 0) {
        clearTimer();
        if (isRest) {
          onComplete();
        } else {
          speak('Rest');
          onComplete();
        }
      }
    };
    intervalRef.current = window.setInterval(tick, 250);
    return clearTimer;
  }, [isRunning, isDone, clearTimer, onComplete, isRest, totalSeconds]);

  useEffect(() => {
    if (phase !== 'countdown') return;
    if (countdownNum <= 0) {
      setPhase('active');
      setIsRunning(true);
      return;
    }
    speak(String(countdownNum));
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

  useEffect(() => {
    if (phase !== 'active' || isRest || isDone) return;
    const t = setTimeout(() => {
      speak(`${exerciseName}, ${speakDuration(duration)}`);
    }, 400);
    return () => clearTimeout(t);
  }, [phase, isRest, isDone, exerciseName, duration]);

  useEffect(() => {
    if (phase !== 'ready' || isRest) return;
    if (autoStart) {
      const t = setTimeout(() => {
        setPhase('countdown');
        setCountdownNum(3);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [phase, autoStart, isRest]);

  const progress = Math.min(Math.max(1 - remaining / maxSeconds, 0), 1);
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const handleStart = () => { setPhase('countdown'); setCountdownNum(3); setIsDone(false); setIsRunning(false); };
  const handlePause = () => setIsRunning(false);
  const handleResume = () => setIsRunning(true);
  const handleReset = () => { clearTimer(); setRemaining(totalSeconds); setMaxSeconds(totalSeconds); setIsRunning(false); setIsDone(false); setPhase('ready'); startRef.current = Date.now(); spokenRef.current = { half: false, ten: false, three: false, two: false, one: false }; };
  const handleClose = () => { clearTimer(); onClose?.() || onComplete(); };
  const handleSkip = () => { clearTimer(); onComplete(); };
  const handlePrevious = () => { clearTimer(); onPrevious?.(); };
  const handleAddTime = () => {
    if (flashRef.current) return;
    startRef.current -= 20000;
    setRemaining((p) => p + 20);
    setMaxSeconds((p) => p + 20);
    setAddedFlash(true);
    flashRef.current = window.setTimeout(() => {
      setAddedFlash(false);
      flashRef.current = null;
    }, 800);
  };

  const accentColor = isRest ? 'var(--brand)' : color;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col animate-fade-in" style={{ backgroundColor: 'var(--bg-page)' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 safe-area-top">
          <button
            onClick={handleClose}
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 touch-manipulation"
            style={{ touchAction: 'manipulation', backgroundColor: 'var(--bg-soft)' }}
          >
          <X className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
        </button>
        {exerciseNumber && totalExercises && (
          <div
            className="px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider"
            style={{
              backgroundColor: `${color}15`,
              color: color,
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
              style={{ color: 'var(--text-primary)' }}
            >
              {exerciseName}
            </h2>
            <span
              className="text-[80px] sm:text-[96px] font-black leading-none tabular-nums animate-pop-in"
              key={countdownNum}
              style={{ color: accentColor }}
            >
              {countdownNum === 0 ? 'Go!' : countdownNum}
            </span>
          </div>
        ) : phase === 'ready' && isRest ? (
          /* Rest ready — auto-starts */
          <div className="flex flex-col items-center gap-4 animate-slide-up">
            <p className="text-[13px] font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
              Rest
            </p>
            <span className="text-[72px] sm:text-[80px] font-black leading-none tabular-nums" style={{ color: 'var(--text-primary)' }}>
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
            <p className="text-[13px] font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
              Rest
            </p>

            {/* Timer ring */}
            <div className="relative w-[180px] h-[180px] sm:w-[200px] sm:h-[200px]">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180">
                <circle cx="90" cy="90" r={RADIUS} fill="transparent" stroke="var(--border-soft)" strokeWidth="8" />
                <circle
                  cx="90" cy="90" r={RADIUS} fill="transparent" stroke="#fff" strokeWidth="8"
                  strokeDasharray={CIRCUMFERENCE} strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round" className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[48px] sm:text-[56px] font-black leading-none tabular-nums" style={{ color: 'var(--text-primary)' }}>
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
                  style={{ backgroundColor: 'var(--bg-soft)', color: 'var(--text-primary)' }}
                >
                  <Plus className="w-4 h-4" />
                  +20s
                </button>
                {addedFlash && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[11px] font-black whitespace-nowrap animate-slide-down" style={{ backgroundColor: `${color}20`, color }}>
                    +20s
                  </span>
                )}
              </div>
              <button
                onClick={handleSkip}
                className="h-12 px-6 rounded-full flex items-center justify-center gap-2 text-[14px] font-bold transition-all active:scale-95"
                style={{ backgroundColor: color, color: '#fff' }}
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
                            ? 'var(--text-primary)'
                            : 'transparent',
                        }}
                      >
                        {/* Status indicator */}
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold"
                          style={{
                            backgroundColor: completed
                              ? `${accentColor}20`
                              : current
                                ? accentColor
                                : 'var(--bg-soft)',
                            color: completed
                              ? accentColor
                              : current
                                ? '#fff'
                                : 'var(--text-muted)',
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
                                ? 'var(--text-muted)'
                                : 'var(--text-primary)',
                              textDecoration: completed ? 'line-through' : 'none',
                            }}
                          >
                            {ex.name}
                          </p>
                          <p
                            className="text-[11px] font-medium tabular-nums"
                            style={{
                              color: completed
                                ? 'var(--text-muted)'
                                : accentColor,
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
                      stroke={'var(--border-soft)'}
                      strokeWidth="8"
                    />
                    <circle
                      cx="90" cy="90" r={RADIUS}
                      fill="transparent"
                      stroke={isDone ? ('var(--success-deep)') : '#fff'}
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
                      <span className="text-[32px] sm:text-[40px] font-black" style={{ color: 'var(--success-deep)' }}>
                        {isRest ? '✓' : 'Done!'}
                      </span>
                    ) : (
                      <span className="text-[48px] sm:text-[56px] font-black leading-none tabular-nums" style={{ color: 'var(--text-primary)' }}>
                        {formatTime(remaining)}
                      </span>
                    )}
                  </div>
                </div>
                {!isDone && (
                  <p className="text-[12px] font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>
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
                      backgroundColor: accentColor,
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
                    backgroundColor: 'var(--bg-soft)',
                    color: 'var(--text-primary)',
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
                    backgroundColor: 'var(--bg-soft)',
                  }}
                  title="Reset"
                >
                  <RotateCcw className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
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
          style={{ borderTop: 'var(--border-soft)' }}
        >
          {isRest ? (
            /* Rest: show next exercise with illustration */
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
                    Next {exerciseNumber && totalExercises ? `${exerciseNumber + 1}/${totalExercises}` : ''}
                  </p>
                  <p className="text-[15px] font-black" style={{ color: 'var(--text-primary)' }}>
                    {nextExercise.name}
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-full text-[12px] font-bold" style={{ backgroundColor: `${color}15`, color }}>
                  {nextExercise.duration}
                </div>
              </div>
              {/* Silhouette preview */}
              <div className="w-full h-[140px] rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--bg-soft)' }}>
                <svg width="80" height="120" viewBox="0 0 120 160" fill="none">
                  <circle cx="60" cy="22" r="14" fill="var(--text-muted)" opacity="0.5" />
                  <rect x="48" y="36" width="24" height="50" rx="8" fill="var(--text-muted)" opacity="0.4" />
                  <rect x="28" y="40" width="18" height="8" rx="4" fill="var(--text-muted)" opacity="0.35" transform="rotate(-15 28 44)" />
                  <rect x="74" y="40" width="18" height="8" rx="4" fill="var(--text-muted)" opacity="0.35" transform="rotate(15 74 44)" />
                  <rect x="44" y="86" width="10" height="44" rx="5" fill="var(--text-muted)" opacity="0.35" transform="rotate(-5 44 86)" />
                  <rect x="66" y="86" width="10" height="44" rx="5" fill="var(--text-muted)" opacity="0.35" transform="rotate(5 66 86)" />
                  <rect x="38" y="128" width="16" height="6" rx="3" fill="var(--text-muted)" opacity="0.3" />
                  <rect x="66" y="128" width="16" height="6" rx="3" fill="var(--text-muted)" opacity="0.3" />
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
