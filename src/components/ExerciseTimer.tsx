import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, X, RotateCcw, SkipForward, SkipBack, Plus, Timer, Volume2, VolumeX, Check, Dumbbell } from 'lucide-react';
import { startMusic, stopMusic, setMusicVolume } from '../utils/backgroundMusic';

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
  isRepsBased?: boolean;
  repsLabel?: string;
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
  isRepsBased = false, repsLabel,
}) => {
  const totalSeconds = isRest ? restDuration : parseDuration(duration);
  const [remaining, setRemaining] = useState(totalSeconds);
  const [maxSeconds, setMaxSeconds] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [phase, setPhase] = useState<'countdown' | 'ready' | 'active' | 'rest-done'>('ready');
  const [countdownNum, setCountdownNum] = useState(3);
  const [addedFlash, setAddedFlash] = useState(false);
  const [muted, setMuted] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const flashRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const spokenRef = useRef<{ half: boolean; ten: boolean; three: boolean; two: boolean; one: boolean; restHalf: boolean }>({ half: false, ten: false, three: false, two: false, one: false, restHalf: false });
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
    spokenRef.current = { half: false, ten: false, three: false, two: false, one: false, restHalf: false };
    const tick = () => {
      const elapsed = (Date.now() - startRef.current) / 1000;
      const left = Math.max(0, totalSeconds - Math.floor(elapsed));
      setRemaining(left);
      if (!isRest) {
        const elapsedWhole = Math.floor(elapsed);
        if (!spokenRef.current.half && elapsedWhole >= totalSeconds - 20) {
          spokenRef.current.half = true;
          speak('20 seconds left');
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
      } else {
        if (!spokenRef.current.restHalf && elapsed >= 1 && nextExercise) {
          spokenRef.current.restHalf = true;
          speak(`Next is ${cleanForSpeech(nextExercise.name)}, ${speakDuration(nextExercise.duration)}`);
        }
      }
      if (left <= 0) {
        clearTimer();
        if (isRest) {
          onComplete();
        } else {
          stopMusic();
          speak('Rest Session');
          onComplete();
        }
      }
    };
    intervalRef.current = window.setInterval(tick, 250);
    return clearTimer;
  }, [isRunning, isDone, clearTimer, onComplete, isRest, totalSeconds, nextExercise]);

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

  useEffect(() => {
    if (phase === 'active' && !isRest && !isDone && !muted) {
      startMusic();
    }
    return () => {};
  }, [phase, isRest, isDone, muted]);

  useEffect(() => {
    return () => { stopMusic(); };
  }, []);

  useEffect(() => {
    setMusicVolume(muted ? 0 : 0.5);
  }, [muted]);

  const progress = Math.min(Math.max(1 - remaining / maxSeconds, 0), 1);
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const handleStart = () => { setPhase('countdown'); setCountdownNum(3); setIsDone(false); setIsRunning(false); };
  const handlePause = () => { clearTimer(); setIsRunning(false); };
  const handleResume = () => { setRemaining(totalSeconds); setMaxSeconds(totalSeconds); startRef.current = Date.now(); spokenRef.current = { half: false, ten: false, three: false, two: false, one: false, restHalf: false }; setIsRunning(true); };
  const handleReset = () => { clearTimer(); stopMusic(); setRemaining(totalSeconds); setMaxSeconds(totalSeconds); setIsRunning(false); setIsDone(false); setPhase('ready'); startRef.current = Date.now(); spokenRef.current = { half: false, ten: false, three: false, two: false, one: false, restHalf: false }; };
  const handleClose = () => { clearTimer(); stopMusic(); if (onClose) { onClose(); } else { onComplete(); } };
  const handleSkip = () => { clearTimer(); stopMusic(); if (onNext) { onNext(); } else { onComplete(); } };
  const handlePrevious = () => { clearTimer(); stopMusic(); onPrevious?.(); };
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

  const accentColor = isRest ? color : color;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col animate-fade-in" style={{ backgroundColor: 'var(--bg-page)' }}>
      {/* Top bar — glass */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 safe-area-top">
        <button
          onClick={handleClose}
          className="w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 touch-manipulation bg-white/[0.08] backdrop-blur-xl border border-white/10"
          style={{ touchAction: 'manipulation' }}
        >
          <X className="w-5 h-5 text-white/80" />
        </button>
        {exerciseNumber && totalExercises && (
          <div className="px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider bg-white/[0.08] backdrop-blur-xl border border-white/15 text-white/70">
            {exerciseNumber}/{totalExercises}
          </div>
        )}
        <button
          onClick={() => setMuted((m) => !m)}
          className="w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90 touch-manipulation bg-white/[0.08] backdrop-blur-xl border border-white/10"
          style={{ touchAction: 'manipulation' }}
        >
          {muted ? <VolumeX className="w-5 h-5 text-white/80" /> : <Volume2 className="w-5 h-5 text-white/80" />}
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {phase === 'countdown' ? (
          /* 3-2-1 Countdown — dramatic glass */
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-[20px] sm:text-[24px] font-black text-center leading-tight tracking-tight text-white/90">
              {exerciseName}
            </h2>
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/10 scale-150" />
              <span
                className="relative text-[100px] sm:text-[120px] font-black leading-none tabular-nums animate-pop-in block"
                key={countdownNum}
                style={{ color: '#fff', textShadow: `0 0 60px ${accentColor}60, 0 0 120px ${accentColor}30` }}
              >
                {countdownNum === 0 ? 'Go!' : countdownNum}
              </span>
            </div>
          </div>
        ) : phase === 'ready' && isRest ? (
          /* Rest ready — auto-starts */
          <div className="flex flex-col items-center gap-6 animate-slide-up">
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50">
              Rest Session
            </p>
            {/* Timer ring — glass container */}
            <div className="relative w-[220px] h-[220px] sm:w-[260px] sm:h-[260px]">
              <div className="absolute inset-0 rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_0_60px_rgba(255,255,255,0.03)]" />
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 180 180">
                <circle cx="90" cy="90" r={RADIUS} fill="transparent" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                <circle
                  cx="90" cy="90" r={RADIUS} fill="transparent" stroke="#fff" strokeWidth="6"
                  strokeDasharray={CIRCUMFERENCE} strokeDashoffset={CIRCUMFERENCE * (1 - remaining / maxSeconds)}
                  strokeLinecap="round" className="transition-[stroke-dashoffset] duration-200 ease-linear"
                  style={{ filter: `drop-shadow(0 0 12px rgba(255,255,255,0.4))` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[52px] sm:text-[60px] font-black leading-none tabular-nums text-white">
                  {formatTime(remaining)}
                </span>
              </div>
            </div>
          </div>
        ) : phase === 'ready' ? (
          /* Exercise ready state — premium glass card */
          <div className="flex flex-col items-center gap-6 animate-slide-up w-full max-w-[340px]">
            <div className="w-full bg-white/[0.06] backdrop-blur-2xl border border-white/10 rounded-[28px] px-8 py-10 flex flex-col items-center gap-6">
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50">
                Ready to go
              </p>
              <h2 className="text-[24px] sm:text-[28px] font-black text-center leading-tight tracking-tight text-white">
                {exerciseName}
              </h2>
              <div className="px-4 py-2 rounded-full bg-white/[0.08] border border-white/10">
                <p className="text-[13px] font-bold text-white/60">
                  {duration}
                </p>
              </div>
            </div>
            <button
              onClick={handleStart}
              className="w-full h-14 rounded-2xl flex items-center justify-center gap-3 text-[15px] font-bold transition-all active:scale-[0.97] bg-white/[0.12] backdrop-blur-xl border border-white/20 text-white shadow-[0_0_30px_rgba(255,255,255,0.06)]"
            >
              <Play className="w-5 h-5" fill="currentColor" />
              Start
            </button>
          </div>
        ) : isRest && !isDone ? (
          /* Active rest state — premium glass */
          <div className="flex flex-col items-center gap-6 w-full animate-slide-up">
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50">
              Rest Session
            </p>

            {/* Timer ring — glass container */}
            <div className="relative w-[220px] h-[220px] sm:w-[260px] sm:h-[260px]">
              <div className="absolute inset-0 rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_0_60px_rgba(255,255,255,0.03)]" />
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 180 180">
                <circle cx="90" cy="90" r={RADIUS} fill="transparent" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                <circle
                  cx="90" cy="90" r={RADIUS} fill="transparent" stroke="#fff" strokeWidth="6"
                  strokeDasharray={CIRCUMFERENCE} strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round" className="transition-[stroke-dashoffset] duration-200 ease-linear"
                  style={{ filter: `drop-shadow(0 0 12px rgba(255,255,255,0.4))` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[52px] sm:text-[60px] font-black leading-none tabular-nums text-white">
                  {formatTime(remaining)}
                </span>
              </div>
            </div>
            {!isDone && (
              <p className="text-[11px] font-bold tracking-[0.15em] text-white/40">
                {Math.round(progress * 100)}% COMPLETE
              </p>
            )}

            {/* +20s and Skip — glass buttons */}
            <div className="flex items-center gap-3 mt-2">
              <div className="relative">
                <button
                  onClick={handleAddTime}
                  className="h-12 px-6 rounded-full flex items-center justify-center gap-2 text-[14px] font-bold transition-all active:scale-95 bg-white/[0.08] backdrop-blur-xl border border-white/10 text-white/70"
                >
                  <Plus className="w-4 h-4" />
                  +20s
                </button>
                {addedFlash && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[11px] font-black whitespace-nowrap animate-slide-down bg-white/[0.12] border border-white/15 text-white">
                    +20s
                  </span>
                )}
              </div>
              <button
                onClick={handleSkip}
                className="h-12 px-6 rounded-full flex items-center justify-center gap-2 text-[14px] font-bold transition-all active:scale-95 bg-white/[0.12] backdrop-blur-xl border border-white/20 text-white shadow-[0_0_20px_rgba(255,255,255,0.06)]"
              >
                Skip
              </button>
            </div>
          </div>
        ) : isRepsBased && !isDone ? (
          /* Rep-based exercise — glass card */
          <div className="flex flex-col items-center gap-6 animate-slide-up w-full max-w-[340px]">
            <div className="w-full bg-white/[0.06] backdrop-blur-2xl border border-white/10 rounded-[28px] px-8 py-10 flex flex-col items-center gap-5">
              <h2 className="text-[22px] sm:text-[26px] font-black text-center leading-tight tracking-tight text-white">
                {exerciseName}
              </h2>
              {repsLabel && (
                <p className="text-[14px] font-bold tracking-wide text-white/60">
                  {repsLabel}
                </p>
              )}
              <div className="w-[120px] h-[120px] rounded-full flex items-center justify-center bg-white/[0.06] border border-white/10">
                <Dumbbell className="w-14 h-14 text-white/40" />
              </div>
              <p className="text-[13px] font-medium text-center text-white/50 leading-relaxed">
                Do the exercise at your own pace.<br/>Press Done when finished.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full">
              {onPrevious && (
                <button
                  onClick={handlePrevious}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-90 bg-white/[0.08] backdrop-blur-xl border border-white/10"
                >
                  <SkipBack className="w-5 h-5 text-white/70" />
                </button>
              )}
              <button
                onClick={() => { setIsDone(true); onComplete(); }}
                className="flex-1 h-14 rounded-2xl flex items-center justify-center gap-3 text-[15px] font-bold transition-all active:scale-[0.97] bg-white/[0.12] backdrop-blur-xl border border-white/20 text-white shadow-[0_0_30px_rgba(255,255,255,0.06)]"
              >
                <Check className="w-5 h-5" strokeWidth={3} />
                Done
              </button>
              {nextExercise && (
                <button
                  onClick={handleSkip}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-90 bg-white/[0.08] backdrop-blur-xl border border-white/10"
                  title="Skip"
                >
                  <SkipForward className="w-5 h-5 text-white/70" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Active / Done state (exercise) */
          <div className="flex flex-col items-center gap-5 w-full">
            <h2 className="text-[20px] sm:text-[24px] font-black text-center leading-tight tracking-tight text-white">
              {isDone ? 'Well Done!' : exerciseName}
            </h2>

            {isDone && allExercises.length > 0 ? (
              /* Exercise list view — glass card */
              <div className="w-full max-w-[360px] flex-1 overflow-y-auto -mx-2 px-2 pb-4">
                <div className="flex flex-col gap-1.5">
                  {allExercises.map((ex, i) => {
                    const completed = i < currentIndex;
                    const current = i === currentIndex;
                    return (
                      <button
                        key={i}
                        onClick={() => onExerciseDetail?.(ex.name, ex.duration)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-left active:scale-[0.98] bg-white/[0.04] border border-white/5 hover:bg-white/[0.08] hover:border-white/10"
                        style={{
                          backgroundColor: current ? 'rgba(255,255,255,0.12)' : undefined,
                          borderColor: current ? 'rgba(255,255,255,0.2)' : undefined,
                        }}
                      >
                        {/* Status indicator */}
                        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold bg-white/[0.08] border border-white/10 text-white/50">
                          {completed ? <Check className="w-3.5 h-3.5" /> : i + 1}
                        </div>

                        {/* Name + duration */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-[13px] font-bold truncate leading-tight ${completed ? 'text-white/40 line-through' : 'text-white/90'}`}>
                            {ex.name}
                          </p>
                          <p className="text-[11px] font-medium tabular-nums text-white/40">
                            {ex.duration}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Timer ring — glass container */
              <>
                <div className="relative w-[220px] h-[220px] sm:w-[260px] sm:h-[260px]">
                  <div className="absolute inset-0 rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-[0_0_60px_rgba(255,255,255,0.03)]" />
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 180 180">
                    <circle
                      cx="90" cy="90" r={RADIUS}
                      fill="transparent"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="6"
                    />
                    <circle
                      cx="90" cy="90" r={RADIUS}
                      fill="transparent"
                      stroke={isDone ? '#fff' : '#fff'}
                      strokeWidth="6"
                      strokeDasharray={CIRCUMFERENCE}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-[stroke-dashoffset] duration-200 ease-linear"
                      style={{ filter: isDone ? 'drop-shadow(0 0 16px rgba(255,255,255,0.5))' : 'drop-shadow(0 0 12px rgba(255,255,255,0.4))' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {isDone ? (
                      <span className="text-[40px] sm:text-[48px] font-black text-white" style={{ textShadow: '0 0 30px rgba(255,255,255,0.3)' }}>
                        {isRest ? '✓' : 'Done!'}
                      </span>
                    ) : (
                      <span className="text-[52px] sm:text-[60px] font-black leading-none tabular-nums text-white">
                        {formatTime(remaining)}
                      </span>
                    )}
                  </div>
                </div>
                {!isDone && (
                  <p className="text-[11px] font-bold tracking-[0.15em] text-white/40">
                    {Math.round(progress * 100)}% COMPLETE
                  </p>
                )}
              </>
            )}

            {/* Controls — glass buttons */}
            {isDone ? (
              <div className="flex flex-col items-center gap-3 w-full max-w-[320px] mt-2">
                {nextExercise && (
                  <button
                    onClick={onNext}
                    className="w-full h-14 rounded-2xl flex items-center justify-center gap-3 text-[15px] font-bold transition-all active:scale-[0.97] bg-white/[0.12] backdrop-blur-xl border border-white/20 text-white shadow-[0_0_30px_rgba(255,255,255,0.06)]"
                  >
                    <SkipForward className="w-5 h-5" />
                    Continue
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="w-full h-12 rounded-2xl flex items-center justify-center gap-2 text-[14px] font-bold transition-all active:scale-[0.97] bg-white/[0.08] backdrop-blur-xl border border-white/10 text-white/70"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restart
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 w-full max-w-[280px] mt-2">
                {/* Previous */}
                <button
                  onClick={handlePrevious}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-90 bg-white/[0.08] backdrop-blur-xl border border-white/10"
                  title="Previous"
                >
                  <SkipBack className="w-5 h-5 text-white/70" />
                </button>

                {/* Pause / Resume */}
                <button
                  onClick={isRunning ? handlePause : handleResume}
                  className="flex-1 h-14 rounded-2xl flex items-center justify-center gap-2 text-[15px] font-bold transition-all active:scale-[0.97] bg-white/[0.12] backdrop-blur-xl border border-white/20 text-white shadow-[0_0_30px_rgba(255,255,255,0.06)]"
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-5 h-5" fill="currentColor" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" fill="currentColor" />
                      Resume
                    </>
                  )}
                </button>

                {/* Skip */}
                {nextExercise && (
                  <button
                    onClick={handleSkip}
                    className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-90 bg-white/[0.08] backdrop-blur-xl border border-white/10"
                    title="Skip to next"
                  >
                    <SkipForward className="w-5 h-5 text-white/70" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom: next exercise preview — glass card */}
      {nextExercise && !isDone && (
        <div className="px-5 pb-8 pt-4 safe-area-bottom">
          {isRest ? (
            /* Rest: show next exercise with glass card */
            <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1 text-white/40">
                    Next {exerciseNumber && totalExercises ? `${exerciseNumber + 1}/${totalExercises}` : ''}
                  </p>
                  <p className="text-[15px] font-black text-white">
                    {nextExercise.name}
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-full text-[12px] font-bold bg-white/[0.08] border border-white/10 text-white/60">
                  {nextExercise.duration}
                </div>
              </div>
              {/* Silhouette preview — glass */}
              <div className="w-full h-[120px] rounded-xl flex items-center justify-center bg-white/[0.04] border border-white/5">
                <svg width="60" height="90" viewBox="0 0 120 160" fill="none">
                  <circle cx="60" cy="22" r="14" fill="white" opacity="0.25" />
                  <rect x="48" y="36" width="24" height="50" rx="8" fill="white" opacity="0.2" />
                  <rect x="28" y="40" width="18" height="8" rx="4" fill="white" opacity="0.15" transform="rotate(-15 28 44)" />
                  <rect x="74" y="40" width="18" height="8" rx="4" fill="white" opacity="0.15" transform="rotate(15 74 44)" />
                  <rect x="44" y="86" width="10" height="44" rx="5" fill="white" opacity="0.15" transform="rotate(-5 44 86)" />
                  <rect x="66" y="86" width="10" height="44" rx="5" fill="white" opacity="0.15" transform="rotate(5 66 86)" />
                  <rect x="38" y="128" width="16" height="6" rx="3" fill="white" opacity="0.12" />
                  <rect x="66" y="128" width="16" height="6" rx="3" fill="white" opacity="0.12" />
                </svg>
              </div>
            </div>
          ) : (
            /* Exercise: simple next preview — glass */
            <div className="flex items-center justify-between bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5 text-white/40">
                  Next
                </p>
                <p className="text-[14px] font-bold text-white">
                  {nextExercise.name}
                </p>
              </div>
              <div className="px-3 py-1.5 rounded-full text-[12px] font-bold bg-white/[0.08] border border-white/10 text-white/60">
                {nextExercise.duration}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
