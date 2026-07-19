import React, { useMemo, useState, useEffect } from 'react';
import { Habit } from '../types';
import { Circle, Target, ChevronLeft, ChevronRight, Search, Flame, AlignLeft, Info, Loader2 } from 'lucide-react';
import { formatDateStr, toTitleCase } from '../utils/dateUtils';
import { Tabs } from './Tabs';

interface DetailProps {
  habits: Habit[];
  onUpdateHabit: (args: any) => Promise<void>;
  currentMonth: Date;
  onChangeMonth?: (date: Date) => void; // Using currentMonth instead as prop
  onMonthChange: (date: Date) => void;
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  isLoggingOut: boolean;
  startDate?: string;
}

const TIME_PHASES = [
  { key: 'reset', label: 'Health', time: 'reset', icon: Target, color: '#6fa83b' },
  { key: 'growth', label: 'Growth', time: 'growth', icon: Target, color: '#9b5cff' },
  { key: 'distraction', label: 'Reset', time: 'distraction', icon: Target, color: '#4e55e0' },
  { key: 'daily_rule', label: 'Eliminate', time: 'any', icon: Target, color: '#d05a96' },
  { key: 'spending', label: 'Boundary', time: 'spending', icon: Target, color: '#b08d2e' },
] as const;

const getPhaseForHabit = (habit: Habit) => {
  if (!habit.time) return TIME_PHASES[0];
  const time = habit.time;
  // Find by time value - works for all category types
  const phase = TIME_PHASES.find(p => p.time === time);
  if (phase) return phase;
  // Fallback for legacy time strings
  if (time === '08:00') return TIME_PHASES[0]; // Health
  if (time === '14:00') return TIME_PHASES[1]; // Growth
  if (time === '20:00' || time === '02:00') return TIME_PHASES[2]; // Discipline
  return TIME_PHASES[0];
};

export const Detail: React.FC<DetailProps> = ({
  habits, onUpdateHabit, currentMonth, onMonthChange,
  tabs, activeTab, onTabChange, onLogout, isLoggingOut, startDate
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedHabitId, setExpandedHabitId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const monthYearLabel = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  const groupedByPhase = useMemo(() => {
    const groups: Record<string, { phase: typeof TIME_PHASES[number]; habits: Habit[] }> = {};
    TIME_PHASES.forEach(p => { groups[p.key] = { phase: p, habits: [] }; });

    const searchLower = searchTerm.trim().toLowerCase();
    habits.filter(h => h.name.toLowerCase().includes(searchLower)).forEach(h => {
      const phase = getPhaseForHabit(h);
      groups[phase.key].habits.push(h);
    });

    const result: typeof groups = {};
    TIME_PHASES.forEach(p => { if (groups[p.key].habits.length > 0) result[p.key] = groups[p.key]; });
    return result;
  }, [habits, searchTerm]);

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    return Array.from({ length: new Date(year, month + 1, 0).getDate() }, (_, i) => {
      const date = new Date(year, month, i + 1);
      return {
        dateStr: formatDateStr(date),
        dayNum: i + 1,
        dayName: date.toLocaleString('default', { weekday: 'short' }),
        isToday: formatDateStr(date) === formatDateStr(new Date())
      };
    });
  }, [currentMonth]);

  const changeMonth = (offset: number) => {
    onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
  };

  const isCurrentMonth = useMemo(() => {
    const now = new Date();
    return currentMonth.getFullYear() === now.getFullYear() && currentMonth.getMonth() === now.getMonth();
  }, [currentMonth]);

  return (
    <div className="flex flex-col relative w-full h-full">
      <div className="sticky top-0 z-20">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} onLogout={onLogout} isLoggingOut={isLoggingOut} />
      </div>

      <div className="px-3 sm:px-5 md:px-6 py-3 sm:py-5 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 border-b border-[var(--border-soft)]">
        <div>
          <h2 className="text-[17px] sm:text-[20px] md:text-[24px] font-black text-[var(--text-primary)] uppercase tracking-tight">Detail View</h2>
          <p className="text-[9px] sm:text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] mt-1">Deep dive into your journey</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="flex items-center gap-1 bg-[var(--bg-card)] border border-[var(--border-soft)] p-1 rounded-xl h-11 sm:h-12">
            <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-[var(--bg-soft)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] touch-manipulation" style={{ touchAction: 'manipulation' }}><ChevronLeft className="w-4 h-4" /></button>
            <span className="px-2 sm:px-3 text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-[var(--text-primary)] min-w-[100px] sm:min-w-[120px] text-center">{monthYearLabel}</span>
            <button onClick={() => changeMonth(1)} className="p-2 hover:bg-[var(--bg-soft)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] touch-manipulation" style={{ touchAction: 'manipulation' }} disabled={isCurrentMonth}><ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="relative w-full sm:w-[200px] md:w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
            <input type="text" placeholder="Search categories" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[var(--bg-card)] border border-[var(--border-soft)] pl-9 pr-4 py-2 sm:py-2.5 rounded-xl text-[13px] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--brand)] transition-all" />
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-5 md:p-6 space-y-6 sm:space-y-8 overflow-y-auto" style={{ paddingBottom: 'max(8rem, env(safe-area-inset-bottom) + 4rem)' }}>
        {Object.entries(groupedByPhase).map(([phaseKey, phaseGroup]) => {
          const { phase, habits: phaseHabits } = phaseGroup as { phase: typeof TIME_PHASES[number]; habits: Habit[] };
          return (
            <div key={phaseKey} className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em]" style={{ color: phase.color }}>{phase.label}</span>
                <div className="flex-1 h-px section-divider" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {phaseHabits.map(habit => {
                  const completionsThisMonth = daysInMonth.filter(d => habit.history[d.dateStr]).length;
                  const daysInCurrentMonth = daysInMonth.length;
                  const target = habit.monthlyTarget || daysInCurrentMonth;
                  const completionRate = Math.min(Math.round((completionsThisMonth / target) * 100), 100);
                  const isExpanded = String(expandedHabitId) === String(habit.id);

                  return (
                    <div key={habit.id} 
                      onClick={() => setExpandedHabitId(isExpanded ? null : habit.id)}
                      className={`group relative overflow-hidden rounded-2xl sm:rounded-[24px] border transition-all duration-500 cursor-pointer ${
                        isExpanded 
                        ? 'bg-[var(--bg-card)] border-[var(--border-medium)] md:col-span-2 shadow-2xl' 
                        : 'bg-[var(--bg-card)] border-[var(--border-soft)] hover:bg-[var(--bg-soft)] hover:border-[var(--border-medium)]'
                      }`}
                    >
                      <div className="p-3 sm:p-4 md:p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
                              <circle cx="24" cy="24" r="21" fill="transparent" stroke="var(--border-soft)" strokeWidth="4" />
                              <circle cx="24" cy="24" r="21" fill="transparent" stroke={phase.color} strokeWidth="4" strokeDasharray={2 * Math.PI * 21} strokeDashoffset={2 * Math.PI * 21 * (1 - (isLoaded ? completionRate : 0) / 100)} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-[9px] sm:text-[10px] font-black" style={{ color: phase.color }}>{completionRate}%</span>
                            </div>
                          </div>
                          <div>
                              <h4 className="text-[14px] sm:text-[15px] font-black text-[var(--text-primary)] uppercase tracking-tight">{toTitleCase(habit.name)}</h4>
                            <div className="flex items-center gap-1.5 sm:gap-2 mt-1">
                              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#ff6b00]/10 border border-[#ff6b00]/20">
                                <Flame className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-[#ff6b00] animate-fire" />
                                <span className="text-[8px] sm:text-[9px] font-black text-[#ff6b00]">{habit.streak}</span>
                              </div>
                              <span className="text-[8px] sm:text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{completionsThisMonth} / {target} Days</span>
                            </div>
                          </div>
                        </div>
                        <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                          {String(savingId) === String(habit.id) ? (
                            <Loader2 className="w-5 h-5 text-[var(--brand)] animate-spin" />
                          ) : (
                            <AlignLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--text-muted)] group-hover:text-[var(--text-primary)]" />
                          )}
                        </div>
                      </div>

                        {isExpanded && (
                        <div className="px-3 sm:px-5 pb-6 pt-2 animate-in fade-in slide-in-from-top-4 duration-500">
                          <div className="h-px bg-gradient-to-r from-[var(--border-medium)] via-[var(--border-soft)] to-transparent mb-4 sm:mb-6" />
                          
                          <div className="space-y-4 sm:space-y-6">
                            {/* Description Section */}
                            <div className="bg-[var(--bg-soft)] border border-[var(--border-soft)] rounded-2xl p-4 sm:p-5" onClick={(e) => e.stopPropagation()}>
                              <h5 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.25em] mb-3 flex items-center gap-2">
                                <Info className="w-3 h-3" />
                                Task Details & Description
                              </h5>
                              <div className="text-[13px] sm:text-[14px] md:text-[16px] text-[var(--text-primary)] leading-relaxed font-medium whitespace-pre-wrap">
                                {habit.description || (
                                  <span className="text-[var(--text-muted)] italic opacity-50">No detailed info provided for this category. You can add them in the "Add Habit" tab.</span>
                                )}
                              </div>
                            </div>

                            {/* Summary Stats Grid */}
                            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                              <div className="bg-[var(--bg-soft)] border border-[var(--border-soft)] rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
                                <p className="text-[17px] sm:text-[20px] md:text-[24px] font-black text-[var(--text-primary)] leading-none">{completionsThisMonth}</p>
                                <p className="text-[7px] sm:text-[8px] font-bold text-[var(--text-muted)] uppercase mt-1.5 sm:mt-2 tracking-widest">Days Done</p>
                              </div>
                              <div className="bg-[var(--bg-soft)] border border-[var(--border-soft)] rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
                                <p className="text-[17px] sm:text-[20px] md:text-[24px] font-black text-[var(--text-primary)] leading-none">{habit.streak}</p>
                                <p className="text-[7px] sm:text-[8px] font-bold text-[var(--text-muted)] uppercase mt-1.5 sm:mt-2 tracking-widest">Streak</p>
                              </div>
                              <div className="bg-[var(--bg-soft)] border border-[var(--border-soft)] rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center">
                                <p className="text-[17px] sm:text-[20px] md:text-[24px] font-black text-[var(--text-primary)] leading-none">{completionRate}%</p>
                                <p className="text-[7px] sm:text-[8px] font-bold text-[var(--text-muted)] uppercase mt-1.5 sm:mt-2 tracking-widest">Rate</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {Object.entries(groupedByPhase).length === 0 && (
          <div className="text-center py-16 sm:py-24 bg-[var(--bg-card)] border border-dashed border-[var(--border-soft)] rounded-3xl">
            <Info className="w-10 h-10 sm:w-12 sm:h-12 text-[var(--text-muted)]/20 mx-auto mb-3 sm:mb-4" />
            <p className="text-[var(--text-muted)] font-bold text-sm">No categories found for this period</p>
          </div>
        )}
      </div>
    </div>
  );
};
