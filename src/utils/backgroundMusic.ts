let audioCtx: AudioContext | null = null;
let isPlaying = false;
let gainNode: GainNode | null = null;
let intervalId: number | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

function playKick(ctx: AudioContext, time: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, time);
  osc.frequency.exponentialRampToValueAtTime(30, time + 0.12);
  gain.gain.setValueAtTime(0.6, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
  osc.connect(gain);
  gain.connect(gainNode!);
  osc.start(time);
  osc.stop(time + 0.15);
}

function playHiHat(ctx: AudioContext, time: number) {
  const bufferSize = ctx.sampleRate * 0.05;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 8000;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.15, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(gainNode!);
  source.start(time);
  source.stop(time + 0.05);
}

function playSynth(ctx: AudioContext, time: number, note: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.value = note;
  gain.gain.setValueAtTime(0.08, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
  osc.connect(gain);
  gain.connect(gainNode!);
  osc.start(time);
  osc.stop(time + 0.4);
}

const CHORDS = [
  [130.81, 164.81, 196.00],
  [146.83, 185.00, 220.00],
  [164.81, 207.65, 246.94],
  [146.83, 185.00, 220.00],
];

export function startMusic() {
  if (isPlaying) return;
  const ctx = getCtx();
  if (ctx.state === 'suspended') ctx.resume();

  gainNode = ctx.createGain();
  gainNode.gain.value = 0.5;
  gainNode.connect(ctx.destination);

  isPlaying = true;
  let beat = 0;
  let chordIdx = 0;
  const bpm = 128;
  const beatMs = (60 / bpm) * 1000;

  intervalId = window.setInterval(() => {
    const now = ctx.currentTime;
    const step = beat % 16;

    if (step === 0 || step === 8) playKick(ctx, now);
    if (step === 4 || step === 12) playHiHat(ctx, now);

    if (step === 0) {
      const chord = CHORDS[chordIdx % CHORDS.length];
      chord.forEach((note) => playSynth(ctx, now, note));
      chordIdx++;
    }

    if (step % 2 === 1) playHiHat(ctx, now);

    beat++;
  }, beatMs / 2);
}

export function stopMusic() {
  if (!isPlaying) return;
  isPlaying = false;
  if (intervalId) clearInterval(intervalId);
  intervalId = null;
  if (gainNode) {
    gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtx?.currentTime ?? 0);
    gainNode.gain.exponentialRampToValueAtTime(0.001, (audioCtx?.currentTime ?? 0) + 0.3);
  }
  setTimeout(() => {
    if (gainNode) { gainNode.disconnect(); gainNode = null; }
  }, 400);
}

export function setMusicVolume(v: number) {
  if (gainNode) gainNode.gain.value = v;
}
