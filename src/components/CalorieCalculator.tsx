import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Calculator, Flame, Beef } from 'lucide-react';

interface CalorieResult {
  bmr: number;
  tdee: number;
  loseWeight: number;
  maintainWeight: number;
  gainWeight: number;
  proteinLow: number;
  proteinHigh: number;
}

function calculateCalories(
  gender: 'male' | 'female',
  age: number,
  heightCm: number,
  weightKg: number,
  activityLevel: string,
): CalorieResult {
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }

  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const multiplier = activityMultipliers[activityLevel] || 1.2;
  const tdee = Math.round(bmr * multiplier);

  // Protein: 1.6–2.2g per kg body weight
  const proteinLow = Math.round(weightKg * 1.6);
  const proteinHigh = Math.round(weightKg * 2.2);

  return {
    bmr: Math.round(bmr),
    tdee,
    loseWeight: Math.round(tdee - 500),
    maintainWeight: tdee,
    gainWeight: Math.round(tdee + 300),
    proteinLow,
    proteinHigh,
  };
}

interface ScrollInputProps {
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step?: number;
  unit: string;
}

const ScrollInput: React.FC<ScrollInputProps> = ({ value, onChange, min, max, step = 1, unit }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startValue = useRef(0);

  const values = [];
  for (let v = min; v <= max; v += step) values.push(v);

  const selectedIdx = values.indexOf(value);

  useEffect(() => {
    if (containerRef.current) {
      const selected = containerRef.current.children[selectedIdx] as HTMLElement;
      if (selected) {
        selected.scrollIntoView({ block: 'center', behavior: 'instant' });
      }
    }
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    startY.current = e.touches[0].clientY;
    startValue.current = value;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const delta = startY.current - e.touches[0].clientY;
    const stepCount = Math.round(delta / 30);
    const newIdx = Math.max(0, Math.min(values.length - 1, values.indexOf(startValue.current) + stepCount));
    if (values[newIdx] !== undefined) onChange(values[newIdx]);
  };

  const handleTouchEnd = () => { isDragging.current = false; };

  const handleClick = (v: number) => onChange(v);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-[28px] font-black text-white tabular-nums">
        {value} <span className="text-[14px] font-bold text-white/40">{unit}</span>
      </div>
      <div
        ref={containerRef}
        className="relative h-[80px] w-full overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-[30px]">
          {values.map((v) => (
            <button
              key={v}
              onClick={() => handleClick(v)}
              className={`h-[30px] flex items-center justify-center text-[13px] font-bold transition-all shrink-0 ${
                v === value
                  ? 'text-white text-[15px]'
                  : 'text-white/25'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <div className="absolute inset-x-0 top-[34px] h-[28px] pointer-events-none border-y border-white/10" />
      </div>
    </div>
  );
};

interface CalorieCalculatorProps {
  className?: string;
}

export const CalorieCalculator: React.FC<CalorieCalculatorProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState(25);
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [activityLevel, setActivityLevel] = useState('sedentary');
  const [goal, setGoal] = useState('maintain');
  const [result, setResult] = useState<CalorieResult | null>(null);

  const handleCalculate = () => {
    const r = calculateCalories(gender, age, height, weight, activityLevel);
    setResult(r);
  };

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary (little/no exercise)' },
    { value: 'light', label: 'Light (exercise 1-3x/week)' },
    { value: 'moderate', label: 'Moderate (exercise 3-5x/week)' },
    { value: 'active', label: 'Active (exercise 6-7x/week)' },
    { value: 'very_active', label: 'Very Active (intense daily)' },
  ];

  const goals = [
    { value: 'lose', label: 'Lose Weight' },
    { value: 'maintain', label: 'Maintain Weight' },
    { value: 'gain', label: 'Gain Weight' },
  ];

  return (
    <div className={`w-full ${className}`}>
      {/* Toggle Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/10 transition-all active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.08] border border-white/10">
            <Flame className="w-5 h-5 text-white/60" />
          </div>
          <div className="text-left">
            <p className="text-[14px] font-bold text-white">Calorie Calculator</p>
            <p className="text-[11px] text-white/40">Calculate your daily calorie needs</p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-white/40" />
        ) : (
          <ChevronDown className="w-5 h-5 text-white/40" />
        )}
      </button>

      {/* Expandable Content */}
      {isOpen && (
        <div className="mt-3 px-5 py-6 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/10 space-y-6 animate-slide-up">
          {/* Gender */}
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/40 mb-2">Gender</p>
            <div className="flex gap-2">
              {(['male', 'female'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`flex-1 py-3 rounded-xl text-[13px] font-bold transition-all ${
                    gender === g
                      ? 'bg-white/[0.14] border border-white/40 text-white'
                      : 'bg-white/[0.04] border border-white/10 text-white/40'
                  }`}
                >
                  {g === 'male' ? 'Male' : 'Female'}
                </button>
              ))}
            </div>
          </div>

          {/* Age */}
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/40 mb-2">Age</p>
            <ScrollInput value={age} onChange={setAge} min={13} max={99} unit="years" />
          </div>

          {/* Height */}
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/40 mb-2">Height</p>
            <ScrollInput value={height} onChange={setHeight} min={120} max={220} unit="cm" />
          </div>

          {/* Weight */}
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/40 mb-2">Weight</p>
            <ScrollInput value={weight} onChange={setWeight} min={30} max={200} unit="kg" />
          </div>

          {/* Activity Level */}
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/40 mb-2">Activity Level</p>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
              className="w-full py-3 px-4 rounded-xl bg-white/[0.06] border border-white/10 text-white text-[13px] font-bold appearance-none cursor-pointer"
            >
              {activityLevels.map((l) => (
                <option key={l.value} value={l.value} className="bg-[#0b0c0f] text-white">
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Goal */}
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/40 mb-2">Goal</p>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full py-3 px-4 rounded-xl bg-white/[0.06] border border-white/10 text-white text-[13px] font-bold appearance-none cursor-pointer"
            >
              {goals.map((g) => (
                <option key={g.value} value={g.value} className="bg-[#0b0c0f] text-white">
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          {/* Calculate Button */}
          <button
            onClick={handleCalculate}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-[15px] font-bold bg-white/[0.12] backdrop-blur-xl border border-white/20 text-white transition-all active:scale-[0.97] shadow-[0_0_30px_rgba(255,255,255,0.06)]"
          >
            <Calculator className="w-5 h-5" />
            Calculate
          </button>

          {/* Results */}
          {result && (
            <div className="space-y-3 animate-slide-up">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/[0.04] border border-white/10 rounded-xl p-3 text-center">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1">BMR</p>
                  <p className="text-[22px] font-black text-white tabular-nums">{result.bmr}</p>
                  <p className="text-[10px] text-white/30">cal/day</p>
                </div>
                <div className="bg-white/[0.04] border border-white/10 rounded-xl p-3 text-center">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-white/35 mb-1">TDEE</p>
                  <p className="text-[22px] font-black text-white tabular-nums">{result.tdee}</p>
                  <p className="text-[10px] text-white/30">cal/day</p>
                </div>
              </div>

              {/* Protein */}
              <div className="bg-white/[0.04] border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Beef className="w-4 h-4 text-white/40" />
                  <p className="text-[11px] font-bold tracking-widest uppercase text-white/40">Daily Protein</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[26px] font-black text-white tabular-nums">{result.proteinLow}–{result.proteinHigh}</span>
                  <span className="text-[12px] font-bold text-white/40">g/day</span>
                </div>
                <p className="text-[11px] text-white/30 mt-1">Based on {weight}kg body weight (1.6–2.2g/kg)</p>
              </div>

              <div className="space-y-2 pt-2">
                {goal === 'lose' && (
                  <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10">
                    <span className="text-[13px] font-bold text-white/60">Target (lose)</span>
                    <span className="text-[16px] font-black text-white tabular-nums">{result.loseWeight} <span className="text-[11px] text-white/40">cal</span></span>
                  </div>
                )}
                {goal === 'gain' && (
                  <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10">
                    <span className="text-[13px] font-bold text-white/60">Target (gain)</span>
                    <span className="text-[16px] font-black text-white tabular-nums">{result.gainWeight} <span className="text-[11px] text-white/40">cal</span></span>
                  </div>
                )}
                {goal === 'maintain' && (
                  <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10">
                    <span className="text-[13px] font-bold text-white/60">Target (maintain)</span>
                    <span className="text-[16px] font-black text-white tabular-nums">{result.maintainWeight} <span className="text-[11px] text-white/40">cal</span></span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
