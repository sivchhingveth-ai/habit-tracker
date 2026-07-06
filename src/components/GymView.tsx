import React, { useState } from 'react';
import { Sparkles, User } from 'lucide-react';
import { Tabs } from './Tabs';
import { WORKOUTS, WORKOUT_QUOTES, Gender, Level, Workout } from '../utils/workouts';

const LEVELS: { key: Level; label: string; color: string; bg: string; text: string }[] = [
  { key: 'beginner', label: 'Beginner', color: '#6fa83b', bg: '#b8eb6c', text: '#3d5d1c' },
  { key: 'intermediate', label: 'Intermediate', color: '#4e55e0', bg: '#4e55e0', text: '#ffffff' },
  { key: 'advanced', label: 'Advanced', color: '#d05a96', bg: '#fc8fc6', text: '#6b1a40' },
];

const PHASE_COLORS: Record<Gender, string> = {
  men: '#4e55e0',
  women: '#d05a96',
};

interface GymViewProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  isLoggingOut: boolean;
}

export const GymView: React.FC<GymViewProps> = ({
  tabs, activeTab, onTabChange, onLogout, isLoggingOut,
}) => {
  const [gender, setGender] = useState<Gender>('men');
  const [level, setLevel] = useState<Level>('beginner');

  const quote = WORKOUT_QUOTES[Math.floor(Math.random() * WORKOUT_QUOTES.length)];
  const workout: Workout | undefined = WORKOUTS.find(
    (w) => w.gender === gender && w.level === level
  );
  const levelMeta = LEVELS.find((l) => l.key === level)!;

  return (
    <div className="flex flex-col relative w-full h-full">
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-[#e8eaed]">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
          onLogout={onLogout}
          isLoggingOut={isLoggingOut}
        />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div
          className="p-5 md:p-6 space-y-5 animate-slide-up"
          style={{ paddingBottom: 'max(8rem, env(safe-area-inset-bottom) + 4rem)' }}
        >
          <div>
            <h2 className="text-[22px] md:text-[26px] font-black text-[#0a0a0a] leading-tight tracking-tight">
              Gym
            </h2>
            <p className="text-[#8a8f97] text-[13px] font-medium mt-1">
              Pick a level. Show up. Earn it.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-[#e8eaed] bg-gradient-to-br from-[#f7cd63]/15 to-[#fc8fc6]/10 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-[#b08d2e] shrink-0 mt-0.5" />
            <p className="text-[13px] md:text-[14px] text-[#0a0a0a] font-bold leading-snug italic">
              "{quote}"
            </p>
          </div>

          <div>
            <p className="text-[10px] font-black text-[#8a8f97] uppercase tracking-widest mb-2.5 px-1">Choose Path</p>
            <div className="grid grid-cols-2 gap-2">
              {(['men', 'women'] as Gender[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`py-3.5 rounded-2xl text-[12px] md:text-[13px] font-black uppercase tracking-wider border transition-all ${
                    gender === g
                      ? 'bg-[#0a0a0a] text-white border-[#0a0a0a] shadow-md'
                      : 'bg-white border-[#e8eaed] text-[#4a4f5a] hover:border-[#0a0a0a] hover:text-[#0a0a0a]'
                  }`}
                >
                  <User className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5" />
                  {g === 'men' ? 'Men' : 'Women'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black text-[#8a8f97] uppercase tracking-widest mb-2.5 px-1">Difficulty</p>
            <div className="grid grid-cols-3 gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l.key}
                  onClick={() => setLevel(l.key)}
                  className={`py-3 rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-wider border transition-all ${
                    level === l.key
                      ? 'border-transparent shadow-md'
                      : 'bg-white border-[#e8eaed] text-[#4a4f5a] hover:text-[#0a0a0a]'
                  }`}
                  style={level === l.key ? { backgroundColor: l.color, color: '#fff' } : {}}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {workout && (
            <div
              className="rounded-2xl border border-[#e8eaed] overflow-hidden bg-white animate-fade-in shadow-sm"
              key={`${gender}-${level}`}
            >
              <div
                className="p-4 border-b border-[#e8eaed]"
                style={{
                  background: `linear-gradient(135deg, ${levelMeta.color}15 0%, transparent 100%)`,
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-[18px] md:text-[20px] font-black text-[#0a0a0a] tracking-tight">
                      {workout.title}
                    </h3>
                    <p className="text-[#4a4f5a] text-[12px] font-medium mt-1 leading-snug">
                      {workout.tagline}
                    </p>
                  </div>
                  <div
                    className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                    style={{ backgroundColor: `${levelMeta.color}25`, color: levelMeta.color }}
                  >
                    {workout.duration}
                  </div>
                </div>
              </div>

              <div className="p-3 space-y-1.5">
                {workout.exercises.map((ex, i) => {
                  const isRest = ex.name.toLowerCase().includes('rest') || ex.name.toLowerCase().includes('repeat');
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-3 p-2.5 rounded-xl ${
                        isRest
                          ? 'bg-[#f8f9fb] border border-dashed border-[#e8eaed]'
                          : 'bg-[#f8f9fb]'
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0"
                        style={{
                          backgroundColor: isRest ? 'transparent' : `${levelMeta.color}20`,
                          color: isRest ? '#8a8f97' : levelMeta.color,
                          border: isRest ? '1px dashed #d9dce2' : 'none',
                        }}
                      >
                        {isRest ? '·' : i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[13px] font-bold truncate ${isRest ? 'text-[#8a8f97] italic' : 'text-[#0a0a0a]'}`}>
                          {ex.name}
                        </p>
                        {ex.reps && (
                          <p className="text-[10px] text-[#8a8f97] font-medium mt-0.5">{ex.reps}</p>
                        )}
                      </div>
                      <div
                        className="text-[10px] font-black uppercase tracking-wider shrink-0"
                        style={{ color: isRest ? '#8a8f97' : levelMeta.color }}
                      >
                        {ex.duration}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-[#f8f9fb] border-t border-[#e8eaed]">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#b08d2e] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[9px] font-black text-[#8a8f97] uppercase tracking-widest mb-1">Coach Tip</p>
                    <p className="text-[12px] text-[#0a0a0a] font-medium leading-snug">
                      {workout.tip}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <p className="text-[10px] text-[#8a8f97] font-medium text-center px-2 leading-relaxed pt-2">
            Warm up for 3 minutes before starting. Stop immediately if you feel sharp pain.
          </p>
        </div>
      </div>
    </div>
  );
};
