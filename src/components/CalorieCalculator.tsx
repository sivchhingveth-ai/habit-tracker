import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Flame, Beef, Calculator } from 'lucide-react';

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
              onClick={() => onChange(v)}
              className={`h-[30px] flex items-center justify-center text-[13px] font-bold transition-all shrink-0 ${
                v === value ? 'text-white text-[15px]' : 'text-white/25'
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
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleCalculate = () => {
    setResult(calculateCalories(gender, age, height, weight, activityLevel));
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all active:scale-[0.98] hover:bg-white/[0.04]"
      >
        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/[0.06] border border-white/10">
          <Flame className="w-4 h-4 text-white/50" />
        </div>
        <span className="flex-1 text-left text-[13px] font-bold text-white/70">Calorie Calculator</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-white/30" />
        ) : (
          <ChevronDown className="w-4 h-4 text-white/30" />
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 mx-4 rounded-2xl bg-[#12161c]/95 backdrop-blur-2xl border border-white/10 shadow-2xl z-50 overflow-hidden animate-slide-up">
          <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
            {/* Gender */}
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/35 mb-2">Gender</p>
              <div className="flex gap-2">
                {(['male', 'female'] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`flex-1 py-2.5 rounded-lg text-[12px] font-bold transition-all ${
                      gender === g
                        ? 'bg-white/[0.12] border border-white/30 text-white'
                        : 'bg-white/[0.04] border border-white/8 text-white/35'
                    }`}
                  >
                    {g === 'male' ? 'Male' : 'Female'}
                  </button>
                ))}
              </div>
            </div>

            {/* Age */}
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/35 mb-2">Age</p>
              <ScrollInput value={age} onChange={setAge} min={13} max={99} unit="years" />
            </div>

            {/* Height */}
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/35 mb-2">Height</p>
              <ScrollInput value={height} onChange={setHeight} min={120} max={220} unit="cm" />
            </div>

            {/* Weight */}
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/35 mb-2">Weight</p>
              <ScrollInput value={weight} onChange={setWeight} min={30} max={200} unit="kg" />
            </div>

            {/* Activity Level */}
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/35 mb-2">Activity Level</p>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full py-2.5 px-3 rounded-lg bg-white/[0.04] border border-white/8 text-white text-[12px] font-bold appearance-none cursor-pointer"
              >
                <option value="sedentary" className="bg-[#12161c]">Sedentary (little/no exercise)</option>
                <option value="light" className="bg-[#12161c]">Light (exercise 1-3x/week)</option>
                <option value="moderate" className="bg-[#12161c]">Moderate (exercise 3-5x/week)</option>
                <option value="active" className="bg-[#12161c]">Active (exercise 6-7x/week)</option>
                <option value="very_active" className="bg-[#12161c]">Very Active (intense daily)</option>
              </select>
            </div>

            {/* Goal */}
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/35 mb-2">Goal</p>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full py-2.5 px-3 rounded-lg bg-white/[0.04] border border-white/8 text-white text-[12px] font-bold appearance-none cursor-pointer"
              >
                <option value="lose" className="bg-[#12161c]">Lose Weight</option>
                <option value="maintain" className="bg-[#12161c]">Maintain Weight</option>
                <option value="gain" className="bg-[#12161c]">Gain Weight</option>
              </select>
            </div>

            {/* Calculate */}
            <button
              onClick={handleCalculate}
              className="w-full py-3 rounded-xl flex items-center justify-center gap-2 text-[13px] font-bold bg-white/[0.10] border border-white/15 text-white transition-all active:scale-[0.98]"
            >
              <Calculator className="w-4 h-4" />
              Calculate
            </button>

            {/* Results */}
            {result && (
              <div className="space-y-3 pt-1 animate-slide-up">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/[0.04] border border-white/8 rounded-xl p-3 text-center">
                    <p className="text-[9px] font-bold tracking-widest uppercase text-white/30 mb-1">BMR</p>
                    <p className="text-[20px] font-black text-white tabular-nums">{result.bmr}</p>
                    <p className="text-[9px] text-white/25">cal/day</p>
                  </div>
                  <div className="bg-white/[0.04] border border-white/8 rounded-xl p-3 text-center">
                    <p className="text-[9px] font-bold tracking-widest uppercase text-white/30 mb-1">TDEE</p>
                    <p className="text-[20px] font-black text-white tabular-nums">{result.tdee}</p>
                    <p className="text-[9px] text-white/25">cal/day</p>
                  </div>
                </div>

                {/* Protein */}
                <div className="bg-white/[0.04] border border-white/8 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Beef className="w-3.5 h-3.5 text-white/35" />
                    <p className="text-[10px] font-bold tracking-widest uppercase text-white/35">Daily Protein</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[22px] font-black text-white tabular-nums">{result.proteinLow}–{result.proteinHigh}</span>
                    <span className="text-[11px] font-bold text-white/35">g/day</span>
                  </div>
                  <p className="text-[10px] text-white/25 mt-0.5">1.6–2.2g per kg body weight</p>
                </div>

                {/* Goal target */}
                <div className="bg-white/[0.04] border border-white/8 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-[12px] font-bold text-white/50">
                    {goal === 'lose' ? 'Target (lose)' : goal === 'gain' ? 'Target (gain)' : 'Target (maintain)'}
                  </span>
                  <span className="text-[16px] font-black text-white tabular-nums">
                    {goal === 'lose' ? result.loseWeight : goal === 'gain' ? result.gainWeight : result.maintainWeight}
                    <span className="text-[10px] text-white/35 ml-1">cal</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
