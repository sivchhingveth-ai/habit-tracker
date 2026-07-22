import React, { useMemo, useState, useCallback, useRef } from 'react';
import { Habit } from '../types';
import { Circle, Flame, Target, Sparkles, ChevronDown, ChevronUp, Minus, Clock, ChevronLeft, ChevronRight, Filter, AlignLeft, Info, LayoutGrid } from 'lucide-react';
import { getEffectiveDateStr, getEffectiveDate, formatDateStr, shouldShowHabitOnDay, toTitleCase } from '../utils/dateUtils';
import { Tabs } from './Tabs';
import { LiveClock } from './LiveClock';
import useAppStore from '../store/appStore';

interface DailyHabitsProps {
  habits: Habit[];
  onToggleHabit: (id: any, dateStr: string) => void;
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  isLoggingOut: boolean;
  filterPhase?: string | string[];
  historyDate?: string;
  onDateChange?: (dateStr: string) => void;
  startDate?: string;
  maxDate?: string;
  gymDropdownOpen?: boolean;
  onGymToggle?: () => void;
  gymDropdownItems?: Array<{ key: string; label: string; icon: React.ReactNode; active: boolean; onClick: () => void }>;
}

const TIME_PHASES = [
  { key: 'reset', label: 'Health', time: 'reset', icon: Target, color: '#6fa83b', emoji: '🌱' },
  { key: 'daily_rule', label: 'Eliminate', time: 'any', icon: Target, color: '#d05a96', emoji: '🎯' },
  { key: 'growth', label: 'Growth', time: 'growth', icon: Target, color: '#9b5cff', emoji: '🚀' },
  { key: 'distraction', label: 'Reset', time: 'distraction', icon: Target, color: '#4e55e0', emoji: '🚫' },
  { key: 'spending', label: 'Boundary', time: 'spending', icon: Target, color: '#b08d2e', emoji: '💰' },
] as const;

const getPhaseForHabit = (habit: Habit) => {
  if (!habit.time) return TIME_PHASES[0];
  const time = habit.time;
  const phase = TIME_PHASES.find(p => p.time === time);
  if (phase) return phase;
  if (time === '08:00') return TIME_PHASES[0];
  if (time === '14:00') return TIME_PHASES[2];
  if (time === '20:00' || time === '02:00') return TIME_PHASES[3];
  return TIME_PHASES[0];
};

const getCurrentPhaseKey = (): string | null => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'reset';
  if (hour >= 12 && hour < 18) return 'growth';
  return 'distraction';
};

const formatDateShort = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
};

// ─── Memoized History Habit Card ─────────────────────────────────────────────
interface HistoryCardProps {
  habit: Habit;
  todayStr: string;
  phaseColor: string;
  isExpanded: boolean;
  onToggleExpand: (id: any) => void;
}

const HistoryHabitCard = React.memo<HistoryCardProps>(({ habit, todayStr, phaseColor, isExpanded, onToggleExpand }) => {
  const isDone = !!habit.history[todayStr];

  return (
    <div>
      <div
        className={`overflow-hidden transition-all ${
          isExpanded
            ? 'border-2 rounded-2xl bg-white shadow-lg'
            : 'border border-[#e8eaed] rounded-2xl bg-white hover:border-[#d4d7dc] hover:bg-[#f8f9fb]'
        }`}
        style={isExpanded ? { borderColor: phaseColor, boxShadow: `0 8px 24px ${phaseColor}20` } : {}}
      >
        <div
          onClick={() => onToggleExpand(habit.id)}
          className="w-full flex items-center gap-3 md:gap-4 p-3 md:p-4 cursor-pointer"
          style={{ touchAction: 'manipulation' }}
        >
          <div
            className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${
              isDone ? 'border-transparent' : 'border-[#e8eaed]'
            }`}
            style={isDone ? { backgroundColor: '#71767b' } : {}}
          >
            {isDone ? (
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <Circle className="w-4 h-4 text-[#8a8f97]" />
            )}
          </div>

          <div className="flex-1 text-left min-w-0">
            <div className="flex items-center gap-2">
              <p className={`text-[14px] md:text-[15px] font-bold ${isExpanded ? 'whitespace-normal break-words' : 'truncate'} ${isDone ? 'text-[#8a8f97] opacity-60 line-through' : 'text-[#0a0a0a]'}`}>
                {toTitleCase(habit.name)}
              </p>
              {habit.streak > 0 && (
                <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#2f3336] shrink-0">
                  <Flame className="w-2.5 h-2.5 text-[#8a8f97]" />
                  <span className="text-[9px] font-black text-[#8a8f97]">{habit.streak}</span>
                </div>
              )}
              {habit.monthlyTarget && habit.monthlyTarget > 0 && (
                <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#2f3336] shrink-0">
                  <span className="text-[9px] font-black text-[#8a8f97]">{habit.monthlyTarget}x</span>
                </div>
              )}
            </div>
          </div>

          <div className={`shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            <AlignLeft className={`w-5 h-5 transition-colors ${isExpanded ? 'text-[#0a0a0a]' : 'text-[#8a8f97]'}`} />
          </div>
        </div>

        {isExpanded && (
          <div className="px-4 md:px-6 pb-4 pt-0 animate-in fade-in slide-in-from-top-4 duration-400 ease-out">
            <div className="h-px bg-[#f0f1f5] mb-4" />
            {habit.description && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-3.5 h-3.5 text-[#8a8f97]" />
                  <span className="text-[9px] font-black text-[#8a8f97] uppercase tracking-widest">Info & Description</span>
                </div>
                <p className="text-[13px] text-[#0a0a0a] leading-relaxed bg-white rounded-xl p-3 border border-[#e8eaed]">
                  {habit.description}
                </p>
              </div>
            )}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-[#8a8f97] uppercase tracking-widest">Monthly Frequency</span>
                <span className="text-[11px] font-black text-[#0a0a0a]">
                  {habit.monthlyTarget === 1 ? 'Once (Day 1)' :
                   habit.monthlyTarget === 2 ? 'Twice (Days 1 & 15)' :
                   habit.monthlyTarget === 3 ? '3 times (Days 1, 11, 21)' :
                   habit.monthlyTarget === 4 ? 'Weekly (Days 1, 8, 15, 22)' :
                   'Daily (Every day)'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-[#8a8f97]/60 pt-2 border-t border-[#e8eaed]">
              <span className="text-[10px] font-bold uppercase tracking-widest">History View - Read Only</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
HistoryHabitCard.displayName = 'HistoryHabitCard';

// ─── Memoized Active Habit Card ──────────────────────────────────────────────
interface ActiveCardProps {
  habit: Habit;
  todayStr: string;
  phase: typeof TIME_PHASES[number];
  phaseKey: string;
  priorityCategory: string | null;
  globalIdx: number;
  onToggleHabit: (id: any, dateStr: string) => void;
}

const ActiveHabitCard = React.memo<ActiveCardProps>(({ habit, todayStr, phase, phaseKey, priorityCategory, globalIdx, onToggleHabit }) => {
  const isDone = !!habit.history[todayStr];
  const animationDelay = `${Math.min(globalIdx, 10) * 50}ms`;

  const handleClick = useCallback(() => {
    onToggleHabit(habit.id, todayStr);
  }, [habit.id, todayStr, onToggleHabit]);

  return (
    <div
      className="animate-pop-in fill-mode-backwards"
      style={{ animationDelay, willChange: 'transform, opacity' }}
    >
      <div
        onClick={handleClick}
        className={`w-full flex items-center gap-2.5 md:gap-3 p-2 md:p-2.5 rounded-2xl transition-transform duration-100 group border-2 cursor-pointer select-none touch-manipulation active:scale-[0.98] ${
          isDone
            ? 'bg-[var(--bg-card)] border-[var(--border-medium)]'
            : 'bg-[var(--bg-card)] border-[var(--border-soft)] hover:border-[var(--border-medium)]'
        }`}
        style={{
          borderColor: isDone ? undefined : `${phase.color}60`,
          touchAction: 'pan-y',
          WebkitTapHighlightColor: 'transparent',
        } as React.CSSProperties}
      >
        <div
          className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 border-2 ${
            isDone
              ? 'border-transparent scale-100 animate-check-pop'
              : 'border-[var(--border-soft)] group-hover:border-[var(--text-muted)]'
          }`}
          style={isDone ? {
            backgroundColor: phase.color,
            boxShadow: `0 0 16px ${phase.color}44`,
            willChange: 'transform',
          } : {}}
        >
          {isDone ? (
            <svg className="w-3.5 h-3.5 text-white animate-check-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" className="check-mark-path" />
            </svg>
          ) : (
            <Circle className="w-3.5 h-3.5 text-[var(--text-muted)] transition-colors" />
          )}
        </div>

        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center gap-2">
            <p className={`text-[13px] md:text-[14px] font-bold transition-all duration-300 ease-in-out truncate ${isDone ? 'text-[var(--text-muted)] opacity-60 line-through' : 'text-[var(--text-primary)]'}`}>
              {toTitleCase(habit.name)}
            </p>
            {habit.streak > 0 && (
              <div className="flex items-center gap-0.5 px-1 py-0.5 rounded-full bg-[#ff6b00]/10 border border-[#ff6b00]/20 shrink-0 group-hover:animate-fire">
                <Flame className="w-2 h-2 text-[#ff6b00]" />
                <span className="text-[8px] font-black text-[#ff6b00]">{habit.streak}</span>
              </div>
            )}
          </div>
        </div>

        {isDone && (
          <div className="shrink-0 animate-fade-in flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: phase.color }} />
          </div>
        )}
      </div>
    </div>
  );
});
ActiveHabitCard.displayName = 'ActiveHabitCard';

// ─── Main Component ──────────────────────────────────────────────────────────
const DailyHabitsInner: React.FC<DailyHabitsProps> = ({
  habits, onToggleHabit,
  tabs, activeTab, onTabChange, onLogout, isLoggingOut, filterPhase,
  historyDate, onDateChange, startDate, maxDate,
  gymDropdownOpen, onGymToggle, gymDropdownItems
}) => {
  const isHistory = !!historyDate;
  const todayStr = isHistory ? historyDate! : getEffectiveDateStr();
  const todayDate = isHistory ? new Date(historyDate!) : getEffectiveDate();
  const currentPhaseKey = getCurrentPhaseKey();

  const [expandedHistoryHabit, setExpandedHistoryHabit] = useState<any>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [priorityCategory, setPriorityCategory] = useState<string | null>(null);
  const scrollPositionRef = useRef(0);

  // Animation state — only on tab switch, not date changes
  const [isTabChanging, setIsTabChanging] = useState(false);
  const prevTabRef = useRef(activeTab);

  // Tab change animation — only when switching TO History
  React.useEffect(() => {
    if (activeTab === 'History' && prevTabRef.current !== 'History') {
      setIsTabChanging(true);
      const t = setTimeout(() => setIsTabChanging(false), 400);
      prevTabRef.current = activeTab;
      return () => clearTimeout(t);
    }
    prevTabRef.current = activeTab;
  }, [activeTab]);

  // Reset expanded when date changes
  React.useEffect(() => {
    if (isHistory) setExpandedHistoryHabit(null);
  }, [historyDate, isHistory]);

  // Restore scroll position after reordering
  React.useEffect(() => {
    if (scrollPositionRef.current > 0) {
      window.scrollTo(0, scrollPositionRef.current);
      scrollPositionRef.current = 0;
    }
  }, [priorityCategory]);

  // Auto-scroll to expanded card
  React.useEffect(() => {
    if (!expandedHistoryHabit || !isHistory) return;
    const t = setTimeout(() => {
      const el = document.querySelector(`[data-history-habit="${String(expandedHistoryHabit)}"]`);
      const main = document.querySelector('main');
      if (el && main) {
        const rect = el.getBoundingClientRect();
        main.scrollTo({ top: main.scrollTop + rect.top - 280, behavior: 'smooth' });
      }
    }, 80);
    return () => clearTimeout(t);
  }, [expandedHistoryHabit, isHistory]);

  // Group habits by phase — memoized
  const groupedByPhase = useMemo(() => {
    const groups: { phase: typeof TIME_PHASES[number]; habits: Habit[] }[] = TIME_PHASES.map(p => ({
      phase: p,
      habits: [],
    }));

    habits.forEach(h => {
      if (!shouldShowHabitOnDay(h.monthlyTarget, todayStr)) return;
      const phase = getPhaseForHabit(h);
      const group = groups.find(g => g.phase.key === phase.key);
      if (group) group.habits.push(h);
    });

    const nonEmpty = groups.filter(g => g.habits.length > 0);

    if (priorityCategory) {
      return nonEmpty.filter(g => g.phase.key === priorityCategory);
    }

    return nonEmpty;
  }, [habits, priorityCategory, todayStr]);

  const visibleHabits = useMemo(() => groupedByPhase.flatMap(g => g.habits), [groupedByPhase]);

  const completedCount = useMemo(
    () => visibleHabits.filter(h => h.history[todayStr]).length,
    [visibleHabits, todayStr]
  );
  const totalCount = visibleHabits.length;
  const completionPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Streak — memoized, short-circuits when no habits
  const currentStreak = useMemo(() => {
    if (totalCount === 0) return 0;
    const todayStr2 = formatDateStr(todayDate);
    let streak = 0;
    const d = new Date(todayDate);

    if (visibleHabits.every(h => h.history[todayStr2])) streak++;

    d.setDate(d.getDate() - 1);
    for (let i = 0; i < 365; i++) {
      const ds = formatDateStr(d);
      if (visibleHabits.every(h => h.history[ds])) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }, [visibleHabits, totalCount, todayDate]);

  // Category dropdown: pre-compute phase counts once
  const visiblePhaseCounts = useMemo(() => {
    return TIME_PHASES.map(phase => ({
      ...phase,
      count: habits.filter(h => getPhaseForHabit(h).key === phase.key && shouldShowHabitOnDay(h.monthlyTarget, todayStr)).length,
    })).filter(p => p.count > 0);
  }, [habits, todayStr]);

  // Callbacks — stable references
  const handleToggleExpand = useCallback((id: any) => {
    setExpandedHistoryHabit(prev => prev === id ? null : id);
  }, []);

  const handleSelectCategory = useCallback((key: string | null) => {
    setShowCategoryDropdown(false);
    scrollPositionRef.current = window.scrollY;
    setPriorityCategory(key);
  }, []);

  const handleToggleCategoryDropdown = useCallback(() => {
    setShowCategoryDropdown(prev => !prev);
  }, []);

  const openHistoryGrid = useCallback(() => {
    useAppStore.getState().openHistoryGrid();
  }, []);

  const handlePrevDate = useCallback(() => {
    const d = new Date(todayStr);
    d.setDate(d.getDate() - 1);
    onDateChange?.(formatDateStr(d));
  }, [todayStr, onDateChange]);

  const handleNextDate = useCallback(() => {
    const d = new Date(todayStr);
    d.setDate(d.getDate() + 1);
    onDateChange?.(formatDateStr(d));
  }, [todayStr, onDateChange]);

  const formattedDate = useMemo(() => formatDateShort(todayStr), [todayStr]);

  const activePhase = filterPhase ? TIME_PHASES.find(p => p.key === filterPhase) : null;
  const chipColor = activePhase ? (isHistory ? '#8a8f97' : activePhase.color) : '#0a0a0a';
  const ChipIcon = activePhase ? activePhase.icon : Target;

  let globalIdx = 0;

  return (
    <div className="flex flex-col relative w-full h-full">
      <div className="sticky top-0 z-20">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} onLogout={onLogout} isLoggingOut={isLoggingOut} gymDropdownOpen={gymDropdownOpen} onGymToggle={onGymToggle} gymDropdownItems={gymDropdownItems} />
      </div>

      <div className="sticky top-[44px] sm:top-[42px] md:top-[44px] z-10 sub-nav">
        <div className="px-3 py-2 sm:px-5 sm:py-3 md:px-6 md:py-4 flex flex-wrap items-center justify-between gap-2 md:gap-4 border-b border-[var(--border-soft)]">
          <div className="min-w-0 flex items-center gap-3">
            <div className="relative">
              <button
                onClick={handleToggleCategoryDropdown}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border select-none touch-manipulation transition-all"
                style={{
                  touchAction: 'manipulation',
                  backgroundColor: priorityCategory ? `${TIME_PHASES.find(p => p.key === priorityCategory)?.color}15` : 'var(--bg-card)',
                  borderColor: priorityCategory ? `${TIME_PHASES.find(p => p.key === priorityCategory)?.color}40` : 'var(--border-soft)',
                }}
              >
                <span className="text-[11px] font-bold tracking-wider" style={{ color: priorityCategory ? TIME_PHASES.find(p => p.key === priorityCategory)?.color : 'var(--text-muted)' }}>
                  {priorityCategory ? TIME_PHASES.find(p => p.key === priorityCategory)?.label : 'All'}
                </span>
              </button>

              {showCategoryDropdown && (
                <div
                  className="absolute top-full left-0 mt-2 w-[260px] z-[100] max-w-[calc(100vw-2rem)] animate-dropdown-in"
                  style={{ touchAction: 'manipulation' }}
                >
                  <div className="relative rounded-2xl bg-[var(--bg-card)] border border-[var(--border-soft)] shadow-xl overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-[var(--border-soft)]">
                      <span className="text-[10px] font-medium text-[var(--text-muted)] tracking-widest uppercase">Filter by category</span>
                    </div>
                    <button
                      onClick={() => handleSelectCategory(null)}
                      className={`w-full px-4 py-2 text-left flex items-center justify-between group transition-all duration-200 touch-manipulation border-b border-[var(--border-soft)] ${
                        !priorityCategory ? 'bg-[var(--bg-soft)]' : 'hover:bg-[var(--bg-tint)]'
                      }`}
                      style={{ touchAction: 'manipulation' }}
                    >
                      <span className={`text-[13px] font-medium tracking-wide ${!priorityCategory ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                        All Categories
                      </span>
                      <span className={`text-[12px] font-semibold px-2 py-0.5 rounded-md ${!priorityCategory ? 'bg-[var(--bg-soft)] text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                        {habits.length}
                      </span>
                    </button>
                    <div>
                      {visiblePhaseCounts.map((phase, index) => {
                        const PhaseIcon = phase.icon;
                        const isLast = index === visiblePhaseCounts.length - 1;
                        const isPriority = priorityCategory === phase.key;
                        const displayColor = isHistory ? 'var(--text-muted)' : phase.color;
                        return (
                          <button
                            key={phase.key}
                            onClick={() => handleSelectCategory(phase.key)}
                            className={`w-full px-4 py-2 text-left flex items-center justify-between group transition-all duration-200 touch-manipulation animate-dropdown-item ${
                              !isLast ? 'border-b border-[var(--border-soft)]' : ''
                            } ${
                              isPriority ? 'bg-[var(--bg-soft)]' : 'hover:bg-[var(--bg-tint)]'
                            }`}
                            style={{
                              touchAction: 'manipulation',
                              animationDelay: `${index * 40}ms`,
                            }}
                          >
                            <span
                              className={`text-[13px] font-medium tracking-wide transition-colors duration-200 ${
                                isPriority ? '' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'
                              }`}
                              style={isPriority ? { color: displayColor } : {}}
                            >
                              {phase.label}
                            </span>
                            <span
                              className={`text-[12px] font-semibold px-2 py-0.5 rounded-md transition-all duration-200 ${
                                isPriority ? '' : 'text-[var(--text-muted)]'
                              }`}
                              style={isPriority ? {
                                backgroundColor: `${displayColor}20`,
                                color: displayColor,
                              } : {}}
                            >
                              {phase.count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!isHistory && (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-[var(--border-soft)]">
                <Clock className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
                <span className="text-[10px] md:text-[11px] whitespace-nowrap">
                  <LiveClock />
                </span>
              </div>
            )}

            {isHistory && (
              <div className="flex items-center gap-1 ml-2 pl-2 border-l border-[var(--border-soft)] shrink-0">
                {startDate !== todayStr ? (
                  <button
                    onClick={handlePrevDate}
                    className="glass-hover w-11 h-11 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] touch-manipulation shrink-0"
                    style={{ touchAction: 'manipulation' }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="w-11 h-11 shrink-0" />
                )}
                <div className="flex items-center gap-2 px-0.5">
                  <Clock className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
                  <span className="text-[10px] md:text-[11px] font-semibold text-[var(--text-secondary)] whitespace-nowrap">
                    {formattedDate}
                  </span>
                </div>
                {maxDate !== todayStr ? (
                  <button
                    onClick={handleNextDate}
                    className="glass-hover w-11 h-11 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] touch-manipulation shrink-0"
                    style={{ touchAction: 'manipulation' }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="w-11 h-11 shrink-0" />
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 shrink-0 flex-wrap">
            {isHistory && (
              <button
                onClick={openHistoryGrid}
                className="w-11 h-11 rounded-full bg-[var(--bg-soft)] border border-[var(--border-soft)] hover:bg-[var(--border-medium)] flex items-center justify-center transition-all text-[var(--text-primary)] active:scale-95 touch-manipulation shrink-0"
                title="Show History Grid"
                style={{ touchAction: 'manipulation' }}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            )}
            <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-xl p-1.5 md:p-2 flex items-center gap-2 shadow-xl flex-1 md:flex-none justify-center md:justify-start">
              <div
                className="w-6 h-6 md:w-8 md:h-8 rounded-lg border flex items-center justify-center transition-colors"
                style={{ backgroundColor: `${chipColor}10`, borderColor: `${chipColor}20` }}
              >
                <Target className="w-3.5 h-3.5 md:w-4 md:h-4 transition-colors" style={{ color: chipColor }} />
              </div>
              <div className="text-right pr-1">
                <p className="text-[13px] md:text-[15px] font-black text-[var(--text-primary)] leading-none">
                  {completedCount}<span className="text-[var(--text-muted)] text-[9px] md:text-[11px]">/{totalCount}</span>
                </p>
                <p className="text-[7px] md:text-[8px] font-bold text-[var(--text-muted)] mt-0.5 tracking-wider">Done</p>
              </div>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-xl p-1.5 md:p-2 flex items-center gap-2 shadow-xl flex-1 md:flex-none justify-center md:justify-start">
              <div className={`w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center ${isHistory ? 'bg-[var(--text-muted)]/10 border border-[var(--text-muted)]/20' : 'bg-[#ff6b00]/10 border border-[#ff6b00]/20'}`}>
                <Flame className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isHistory ? 'text-[var(--text-muted)]' : 'text-[#ff6b00]'}`} />
              </div>
              <div className="text-right pr-1">
                <p className="text-[13px] md:text-[15px] font-black text-[var(--text-primary)] leading-none">{currentStreak}</p>
                <p className="text-[7px] md:text-[8px] font-bold text-[var(--text-muted)] mt-0.5 tracking-wider">Streak</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`p-3 sm:p-5 md:p-6 space-y-5 sm:space-y-7 transition-all duration-300 ${
        isTabChanging ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
      }`} style={{ paddingBottom: 'max(8rem, env(safe-area-inset-bottom) + 4rem)' }}>
        {totalCount === 0 && (
          <div className="text-center py-10 sm:py-16">
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-[#8a8f97]/40 mx-auto mb-3 sm:mb-4" />
            <p className="text-[#8a8f97] text-base font-bold">No {activeTab} tracked yet</p>
            <p className="text-[#8a8f97]/60 text-sm mt-1">Go to Add Habit to add your first {activeTab.toLowerCase()}!</p>
          </div>
        )}

        {groupedByPhase.map((phaseGroup) => {
          const { phase, habits: phaseHabits } = phaseGroup as { phase: typeof TIME_PHASES[number]; habits: Habit[] };

          return (
            <div key={phase.key} id={`phase-${phase.key}`} className="space-y-1.5 scroll-mt-20">
              <div className="flex items-center gap-2 sm:gap-3 px-1 mb-1 py-1">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0" style={{ backgroundColor: isHistory ? 'var(--text-muted)' : phase.color }} />
                <span className="text-[10px] sm:text-[11px] md:text-[13px] font-black uppercase tracking-[0.2em] leading-none" style={{ color: isHistory ? 'var(--text-muted)' : phase.color }}>
                  {phase.label}
                </span>
                <div className="flex-1 h-px section-divider" />
                <span className="text-[10px] font-black text-[var(--text-muted)] tracking-wider">
                  {phaseHabits.length}
                </span>
              </div>

              <div className="grid gap-1.5 sm:gap-2 md:gap-3 grid-cols-1">
                {phaseHabits.map((habit) => {
                  if (isHistory) {
                    return (
                      <div key={habit.id} data-history-habit={String(habit.id)}>
                        <HistoryHabitCard
                          habit={habit}
                          todayStr={todayStr}
                          phaseColor={phase.color}
                          isExpanded={expandedHistoryHabit === habit.id}
                          onToggleExpand={handleToggleExpand}
                        />
                      </div>
                    );
                  }

                  return (
                    <ActiveHabitCard
                      key={`${phase.key}-${habit.id}-${priorityCategory || 'none'}-${globalIdx++}`}
                      habit={habit}
                      todayStr={todayStr}
                      phase={phase}
                      phaseKey={phase.key}
                      priorityCategory={priorityCategory}
                      globalIdx={globalIdx++}
                      onToggleHabit={onToggleHabit}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const DailyHabits = React.memo(DailyHabitsInner);
