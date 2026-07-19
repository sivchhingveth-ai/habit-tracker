import { useState, useEffect } from 'react';

export type SoundPreset = 'chime' | 'bell' | 'beep' | 'soft' | 'digital' | 'off';

export const SOUND_LABELS: Record<SoundPreset, string> = {
  chime: 'Chime',
  bell: 'Bell',
  beep: 'Beep',
  soft: 'Soft',
  digital: 'Digital',
  off: 'Off',
};

export interface TimerSettings {
  sound: SoundPreset;
  volume: number;
  tickEnabled: boolean;
}

const STORAGE_KEY = 'gym-timer-settings';

const DEFAULTS: TimerSettings = { sound: 'chime', volume: 70, tickEnabled: true };

function load(): TimerSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return DEFAULTS;
}

function save(s: TimerSettings) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

export function useTimerSettings() {
  const [settings, setSettings] = useState<TimerSettings>(load);

  useEffect(() => { save(settings); }, [settings]);

  const update = (patch: Partial<TimerSettings>) =>
    setSettings((prev) => ({ ...prev, ...patch }));

  return { settings, update };
}

// ─── Sound playback ───────────────────────────────────────────
export function playSound(preset: SoundPreset, volume: number) {
  if (preset === 'off') return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const vol = volume / 100;

    const playTone = (freq: number, startTime: number, dur: number, type: OscillatorType = 'sine', volMul = 1) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol * 0.3 * volMul, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + dur);
    };

    const now = ctx.currentTime;

    switch (preset) {
      case 'chime':
        playTone(880, now, 0.15);
        playTone(1100, now + 0.18, 0.15);
        playTone(880, now + 0.36, 0.15);
        playTone(1100, now + 0.54, 0.25);
        break;
      case 'bell':
        playTone(1200, now, 0.4, 'sine', 1.2);
        playTone(900, now + 0.3, 0.5, 'sine', 0.8);
        playTone(600, now + 0.7, 0.6, 'sine', 0.5);
        break;
      case 'beep':
        playTone(800, now, 0.1, 'square', 0.4);
        playTone(800, now + 0.15, 0.1, 'square', 0.4);
        playTone(800, now + 0.3, 0.1, 'square', 0.4);
        playTone(1200, now + 0.5, 0.25, 'square', 0.5);
        break;
      case 'soft':
        playTone(523, now, 0.3, 'sine', 0.6);
        playTone(659, now + 0.25, 0.3, 'sine', 0.6);
        playTone(784, now + 0.5, 0.4, 'sine', 0.6);
        playTone(1047, now + 0.8, 0.5, 'sine', 0.5);
        break;
      case 'digital':
        playTone(1000, now, 0.08, 'square', 0.3);
        playTone(1000, now + 0.12, 0.08, 'square', 0.3);
        playTone(1500, now + 0.3, 0.15, 'square', 0.4);
        playTone(1500, now + 0.5, 0.15, 'square', 0.4);
        playTone(2000, now + 0.7, 0.3, 'square', 0.5);
        break;
    }
  } catch { /* silent fail */ }
}

export function playTick(volume: number) {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 600;
    const vol = (volume / 100) * 0.25;
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  } catch { /* silent fail */ }
}
