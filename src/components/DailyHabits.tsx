import React, { useMemo, useState } from 'react';
import { Habit } from '../types';
import { Circle, Flame, Target, Sparkles, Sun, CloudSun, Moon, Stars, ChevronDown, ChevronUp, Minus, Clock, ChevronLeft, ChevronRight, Filter, AlignLeft, Info, LayoutGrid } from 'lucide-react';
import { getEffectiveDateStr, getEffectiveDate, formatDateStr, shouldShowHabitOnDay } from '../utils/dateUtils';
import { Tabs } from './Tabs';
import useAppStore from '../store/appStore';

interface DailyHabitsProps {
  habits: Habit[];
  onToggleHabit: (id: any, dateStr: string) => void;
  // Navigation props
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
}

// Time phase definitions
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
  // Find by time value - works for all category types
  const phase = TIME_PHASES.find(p => p.time === time);
  if (phase) return phase;
  // Fallback for legacy time strings
  if (time === '08:00') return TIME_PHASES[0]; // Health
  if (time === '14:00') return TIME_PHASES[2]; // Growth
  if (time === '20:00' || time === '02:00') return TIME_PHASES[3]; // Discipline
  return TIME_PHASES[0];
};

// Phase selection is no longer strictly time-based as requested
const getCurrentPhaseKey = (): string | null => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'reset';
  if (hour >= 12 && hour < 18) return 'growth';
  return 'distraction';
};

export const DailyHabits: React.FC<DailyHabitsProps> = ({
  habits, onToggleHabit,
  tabs, activeTab, onTabChange, onLogout, isLoggingOut, filterPhase,
  historyDate, onDateChange, startDate, maxDate
}) => {
  const isHistory = !!historyDate;
  const todayStr = isHistory ? historyDate : getEffectiveDateStr();
  const todayDate = isHistory ? new Date(historyDate) : getEffectiveDate();
  const currentPhaseKey = getCurrentPhaseKey();
  const [now, setNow] = React.useState(new Date());
  
  // Track expanded habit in history view
  const [expandedHistoryHabit, setExpandedHistoryHabit] = useState<any>(null);
  
  // Category dropdown state and priority ordering
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [priorityCategory, setPriorityCategory] = useState<string | null>(null);
  
  // Track scroll position to maintain it during reordering
  const scrollPositionRef = React.useRef(0);

  // Animation state for tab change
  const [isTabChanging, setIsTabChanging] = useState(false);
  const [isDateChanging, setIsDateChanging] = useState(false);
  const prevTabRef = React.useRef(activeTab);

  // Animate only when switching TO History tab
  React.useEffect(() => {
    if (activeTab === 'History' && prevTabRef.current !== 'History') {
      setIsTabChanging(true);
      const timer = setTimeout(() => setIsTabChanging(false), 400);
      prevTabRef.current = activeTab;
      return () => clearTimeout(timer);
    }
    prevTabRef.current = activeTab;
  }, [activeTab]);

  // Animate when date changes in History view
  React.useEffect(() => {
    if (isHistory && historyDate) {
      setIsDateChanging(true);
      const timer = setTimeout(() => setIsDateChanging(false), 200);
      return () => clearTimeout(timer);
    }
  }, [historyDate, isHistory]);

  // Auto-scroll to expanded card in History view
  React.useEffect(() => {
    if (expandedHistoryHabit && isHistory) {
      setTimeout(() => {
        const expandedCard = document.querySelector(`[data-history-habit="${String(expandedHistoryHabit)}"]`);
        const mainContainer = document.querySelector('main');
        if (expandedCard && mainContainer) {
          const headerOffset = 280;
          const cardRect = expandedCard.getBoundingClientRect();
          const scrollPosition = mainContainer.scrollTop + cardRect.top - headerOffset;
          mainContainer.scrollTo({ top: Math.max(0, scrollPosition), behavior: 'smooth' });
        }
      }, 100);
    }
  }, [expandedHistoryHabit, isHistory]);

  // Reset expanded habit when date changes in History view
  React.useEffect(() => {
    if (isHistory) {
      setExpandedHistoryHabit(null);
    }
  }, [historyDate, isHistory]);

  // Restore scroll position after reordering
  React.useEffect(() => {
    if (scrollPositionRef.current > 0) {
      window.scrollTo(0, scrollPositionRef.current);
      scrollPositionRef.current = 0;
    }
  }, [priorityCategory]);

  // Group habits by time phase with priority ordering and monthly target filtering
  const groupedByPhase = useMemo(() => {
    const groups: { phase: typeof TIME_PHASES[number]; habits: Habit[] }[] = TIME_PHASES.map(p => ({
      phase: p,
      habits: [],
    }));

    habits.forEach(h => {
      // Check if habit should be shown on current day based on monthly target
      if (!shouldShowHabitOnDay(h.monthlyTarget, todayStr)) {
        return; // Skip this habit for today
      }
      
      const phase = getPhaseForHabit(h);
      const group = groups.find(g => g.phase.key === phase.key);
      if (group) group.habits.push(h);
    });

    // Filter out empty groups
    const nonEmptyGroups = groups.filter(g => g.habits.length > 0);
    
    // If there's a priority category, move it to the front
    if (priorityCategory) {
      const priorityIndex = nonEmptyGroups.findIndex(g => g.phase.key === priorityCategory);
      if (priorityIndex > 0) {
        const priorityGroup = nonEmptyGroups.splice(priorityIndex, 1)[0];
        nonEmptyGroups.unshift(priorityGroup);
      }
    }
    
    return nonEmptyGroups;
  }, [habits, priorityCategory, todayStr]);

  // Derived habits to show based on filter
  const visibleHabits = useMemo(() => {
    return groupedByPhase.flatMap(g => g.habits);
  }, [groupedByPhase]);

  // Stats for today
  const completedCount = visibleHabits.filter(h => h.history[todayStr]).length;
  const totalCount = visibleHabits.length;
  const completionPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Streak: consecutive days up to today
  const currentStreak = useMemo(() => {
    if (totalCount === 0) return 0;
    let streak = 0;
    const d = new Date(todayDate);
    
    // If today is completed, it counts toward the streak
    const todayStr = formatDateStr(d);
    const todayCompleted = visibleHabits.every(h => h.history[todayStr]);
    if (todayCompleted) streak++;
    
    // Check previous days consecutively
    d.setDate(d.getDate() - 1);
    for (let i = 0; i < 365; i++) {
      const dStr = formatDateStr(d);
      const allDone = visibleHabits.every(h => h.history[dStr]);
      if (allDone) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }, [visibleHabits, totalCount, todayDate]);

  const activePhase = filterPhase ? TIME_PHASES.find(p => p.key === filterPhase) : null;
  const chipColor = activePhase ? (isHistory ? '#8a8f97' : activePhase.color) : '#0a0a0a';
  const ChipIcon = activePhase ? activePhase.icon : Target;

  let globalIdx = 0;

  return (
    <div className="flex flex-col relative w-full h-full">

      {/* Header with inline navigation + stats */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-xl border-b border-[#e8eaed]">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} onLogout={onLogout} isLoggingOut={isLoggingOut} />
      </div>

      {/* History Date Picker */}
      {isHistory && (
        <div className="bg-white border-b border-[#e8eaed] p-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {startDate !== todayStr ? (
              <button 
                onClick={() => {
                  const d = new Date(todayStr);
                  d.setDate(d.getDate() - 1);
                  onDateChange?.(formatDateStr(d));
                }}
                className="w-10 h-10 rounded-full hover:bg-[#f0f1f5] flex items-center justify-center transition-colors text-[#8a8f97] hover:text-[#0a0a0a] touch-manipulation"
                style={{ touchAction: 'manipulation' }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-10 h-10" />
            )}
          </div>
          
          <div className="flex flex-col items-center flex-1 min-w-0">
            <span className="text-[#0a0a0a] font-black text-sm truncate">{formatDateStr(new Date(todayStr))}</span>
            <span className="text-[#8b98a5] text-[10px] font-bold uppercase tracking-widest">{new Date(todayStr).toLocaleDateString(undefined, { weekday: 'long' })}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {maxDate !== todayStr ? (
              <button 
                 onClick={() => {
                  const d = new Date(todayStr);
                  d.setDate(d.getDate() + 1);
                  onDateChange?.(formatDateStr(d));
                }}
                className="w-10 h-10 rounded-full hover:bg-[#f0f1f5] flex items-center justify-center transition-colors text-[#8a8f97] hover:text-[#0a0a0a] touch-manipulation"
                style={{ touchAction: 'manipulation' }}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-10 h-10" />
            )}
            <button
              onClick={() => useAppStore.getState().openHistoryGrid()}
              className="w-10 h-10 rounded-full bg-[#f0f1f5] border border-[#e8eaed] hover:bg-[#e8eaed] flex items-center justify-center transition-all text-[#0a0a0a] active:scale-95 touch-manipulation"
              title="Show History Grid"
              style={{ touchAction: 'manipulation' }}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div>
        <div className="px-5 py-3 md:px-6 md:py-4 flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-4 border-b border-[#e8eaed]">
          <div className="min-w-0 flex items-center gap-3">
            {/* Category Filter Button */}
            <div className="relative">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#e8eaed] hover:bg-[#f8f9fb] select-none touch-manipulation"
                style={{ touchAction: 'manipulation' }}
              >
                <Filter className="w-3.5 h-3.5 text-[#8a8f97]" />
                <span className="text-[11px] font-bold text-[#8a8f97] uppercase tracking-wider">
                  Categories
                </span>
              </button>
              
              {/* Category Dropdown - ChatGPT-style with shine */}
              {showCategoryDropdown && (
                <div 
                  className="absolute top-full left-0 mt-2 w-[260px] z-[100] max-w-[calc(100vw-2rem)] animate-dropdown-in"
                  style={{ touchAction: 'manipulation' }}
                >
                  {/* Glow wrapper */}
                  <div className="relative rounded-2xl bg-white border border-[#e8eaed] shadow-xl overflow-hidden">
                    {/* Clean minimal header */}
                    <div className="px-4 py-2.5 border-b border-[#e8eaed]">
                      <span className="text-[10px] font-medium text-[#8a8f97] tracking-widest uppercase">
                        Filter by category
                      </span>
                    </div>
                    
                    {/* Category Options */}
                    <div>
                      {(() => {
                        // Filter to only visible categories first
                        const visiblePhases = TIME_PHASES.map(phase => ({
                          ...phase,
                          count: habits.filter(h => getPhaseForHabit(h).key === phase.key && shouldShowHabitOnDay(h.monthlyTarget, todayStr)).length
                        })).filter(p => p.count > 0);
                        
                        return visiblePhases.map((phase, index) => {
                          const PhaseIcon = phase.icon;
                          const isLast = index === visiblePhases.length - 1;
                          const isPriority = priorityCategory === phase.key;
                          // In history mode, use gray colors instead of category colors
                          const displayColor = isHistory ? '#8a8f97' : phase.color;
                          return (
                            <button
                              key={phase.key}
                              onClick={() => {
                                setShowCategoryDropdown(false);
                                scrollPositionRef.current = window.scrollY;
                                setPriorityCategory(phase.key);
                              }}
                              className={`w-full px-4 py-2 text-left flex items-center justify-between group transition-all duration-200 touch-manipulation animate-dropdown-item ${
                                !isLast ? 'border-b border-[#e8eaed]' : ''
                              } ${
                                isPriority ? 'bg-[#f0f1f5]' : 'hover:bg-[#f8f9fb]'
                              }`}
                              style={{ 
                                touchAction: 'manipulation',
                                animationDelay: `${index * 40}ms`
                              }}
                            >
                              <span className="flex items-center gap-3">
                                <div 
                                  className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200 ${
                                    isPriority ? '' : 'bg-[#f0f1f5] group-hover:bg-[#e8eaed]'
                                  }`}
                                  style={isPriority ? { backgroundColor: `${displayColor}20` } : {}}
                                >
                                  <PhaseIcon 
                                    className={`w-3 h-3 transition-all duration-200 ${
                                      isPriority ? '' : 'text-[#4a4f5a] group-hover:text-[#0a0a0a]'
                                    }`}
                                    style={isPriority ? { color: displayColor } : {}} 
                                  />
                                </div>
                                <span 
                                  className={`text-[13px] font-medium tracking-wide uppercase transition-colors duration-200 ${
                                    isPriority ? '' : 'text-[#4a4f5a] group-hover:text-[#0a0a0a]'
                                  }`}
                                  style={isPriority ? { color: displayColor } : {}}
                                >
                                  {phase.label.toUpperCase()}
                                </span>
                              </span>
                              <span 
                                className={`text-[12px] font-semibold px-2 py-0.5 rounded-md transition-all duration-200 ${
                                    isPriority ? '' : 'text-[#8a8f97]'
                                  }`}
                                  style={isPriority ? { 
                                    backgroundColor: `${displayColor}20`,
                                    color: displayColor 
                                  } : {}}
                                >
                                  {phase.count}
                                </span>
                              </button>
                            );
                          });
                        })()}
                    </div>
                  </div>
                </div>
              )}
             </div>
             
              {/* Real-time Date - Shown on To Do List page */}
              {!isHistory && (
                <div className="flex items-center gap-2 ml-4">
                  <Clock className="w-3 h-3 text-[#8a8f97] shrink-0" />
                  <span className="text-[#8b98a5] text-[9px] md:text-[11px] font-black uppercase tracking-[0.15em]">
                    {now.toLocaleDateString('en-US', { weekday: 'short' })}, {now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} &middot; {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                  </span>
                </div>
              )}
          </div>

          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            {/* Done Chip */}
            <div className="bg-white border border-[#e8eaed] rounded-xl p-1.5 md:p-2 flex items-center gap-2 shadow-xl flex-1 md:flex-none justify-center md:justify-start">
                <div 
                  className="w-6 h-6 md:w-8 md:h-8 rounded-lg border flex items-center justify-center transition-colors"
                  style={{ backgroundColor: `${chipColor}10`, borderColor: `${chipColor}20` }}
                >
                  <Target className="w-3.5 h-3.5 md:w-4 md:h-4 transition-colors" style={{ color: chipColor }} />
                </div>
              <div className="text-right pr-1">
                <p className="text-[13px] md:text-[15px] font-black text-[#0a0a0a] leading-none">
                  {completedCount}<span className="text-[#8a8f97] text-[9px] md:text-[11px]">/{totalCount}</span>
                </p>
                <p className="text-[7px] md:text-[8px] font-bold text-[#8a8f97] uppercase mt-0.5 tracking-wider">Done</p>
              </div>
            </div>

            {/* Streak Chip */}
            <div className="bg-white border border-[#e8eaed] rounded-xl p-1.5 md:p-2 flex items-center gap-2 shadow-xl flex-1 md:flex-none justify-center md:justify-start">
                              <div className={`w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center ${isHistory ? 'bg-[#71767b]/10 border border-[#71767b]/20' : 'bg-[#ff6b00]/10 border border-[#ff6b00]/20'}`}>
                <Flame className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isHistory ? 'text-[#8a8f97]' : 'text-[#ff6b00] animate-fire'}`} />
              </div>
              <div className="text-right pr-1">
                <p className="text-[13px] md:text-[15px] font-black text-[#0a0a0a] leading-none">{currentStreak}</p>
                <p className="text-[7px] md:text-[8px] font-bold text-[#8a8f97] uppercase mt-0.5 tracking-wider">Streak</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`p-5 md:p-6 space-y-7 transition-all duration-300 ${
        isTabChanging 
          ? 'opacity-0 translate-y-2' 
          : isDateChanging 
            ? 'opacity-90 scale-[0.99]' 
            : 'opacity-100 translate-y-0 scale-100'
      }`} style={{ paddingBottom: 'max(8rem, env(safe-area-inset-bottom) + 4rem)' }}>
        {totalCount === 0 && (
          <div className="text-center py-16">
            <Sparkles className="w-10 h-10 text-[#8a8f97]/40 mx-auto mb-4" />
            <p className="text-[#8a8f97] text-base font-bold">No {activeTab} tracked yet</p>
            <p className="text-[#8a8f97]/60 text-sm mt-1">Go to Add Workspace to add your first {activeTab.toLowerCase()}!</p>
          </div>
        )}

        {groupedByPhase.map((phaseGroup) => {
          const { phase, habits: phaseHabits } = phaseGroup as { phase: typeof TIME_PHASES[number]; habits: Habit[] };
          const isCurrentPhase = !isHistory && (filterPhase ? phase.key === filterPhase : phase.key === currentPhaseKey);
          const phaseCompleted = phaseHabits.filter(h => h.history[todayStr]).length;

          return (
            <div key={phase.key} id={`phase-${phase.key}`} className="space-y-1.5 scroll-mt-20">
              <div className={`flex items-center gap-3 px-1 mb-1.5 py-1 rounded-xl ${isCurrentPhase ? 'bg-white/[0.02]' : ''}`}>
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-[11px] md:text-[13px] font-black uppercase tracking-[0.2em] leading-none" style={{ color: isHistory ? '#71767b' : phase.color }}>
                    {phase.label}
                  </span>
                  {isCurrentPhase && (
                    <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full animate-pulse"
                      style={{ backgroundColor: `${phase.color}20`, color: phase.color }}>
                      Now
                    </span>
                  )}
                </div>
                <div className="flex-1 h-px bg-[#e8eaed]" />
                <span className="text-[10px] font-black text-[#8a8f97] uppercase tracking-wider">
                  {phaseHabits.length} {phaseHabits.length === 1 ? 'CATEGORY' : 'CATEGORIES'}
                </span>
              </div>

              <div className="grid gap-2 md:gap-3 grid-cols-1">
                {phaseHabits.length === 0 ? (
                  <div className={`py-4 px-4 rounded-xl bg-[#f0f1f5] border border-[#e8eaed]/50 ${expandedHistoryHabit ? 'col-span-1' : 'col-span-1 md:col-span-2'}`}>
                    <span className="text-[11px] font-bold text-[#8a8f97]/60 uppercase tracking-wider">No tasks yet</span>
                  </div>
                ) : (
                  phaseHabits.map((habit) => {
                  const isDone = !!habit.history[todayStr];
                  // Cap animation delay at 10 items to prevent mobile performance issues
                  const animationDelay = `${Math.min(globalIdx++, 10) * 50}ms`;
                  
                  // History mode: Static display with expandable details - Daily View Only
                  if (isHistory) {
                    const isExpanded = String(expandedHistoryHabit) === String(habit.id);
                    
                    return (
                      <div key={habit.id} data-history-habit={String(habit.id)}>
                        {/* Unified Card Container */}
                        <div className={`overflow-hidden transition-all ${
                          isExpanded 
                            ? 'border-2 rounded-2xl bg-white shadow-lg' 
                            : 'border border-[#e8eaed] rounded-2xl bg-white hover:border-[#d4d7dc] hover:bg-[#f8f9fb]'
                        }`} style={isExpanded ? { borderColor: phase.color, boxShadow: `0 8px 24px ${phase.color}20` } : {}}>
                          {/* Main Card Header - Clickable to expand */}
                          <div 
                            onClick={() => setExpandedHistoryHabit(isExpanded ? null : habit.id)}
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
                                  {habit.name.toUpperCase()}
                                </p>
                                {habit.streak > 0 && (
                                  <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#2f3336] shrink-0">
                                    <Flame className="w-2.5 h-2.5 text-[#8a8f97]" />
                                    <span className="text-[9px] font-black text-[#8a8f97]">{habit.streak}</span>
                                  </div>
                                )}
                                {/* Monthly Target Badge */}
                                {habit.monthlyTarget && habit.monthlyTarget > 0 && (
                                  <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#2f3336] shrink-0">
                                    <span className="text-[9px] font-black text-[#8a8f97]">
                                      {habit.monthlyTarget}x
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className={`shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                              <AlignLeft className={`w-5 h-5 transition-colors ${isExpanded ? 'text-[#0a0a0a]' : 'text-[#8a8f97]'}`} />
                            </div>
                          </div>

                          {/* Expanded Details - Read Only */}
                          {isExpanded && (
                            <div className="px-4 md:px-6 pb-4 pt-0 animate-in fade-in slide-in-from-top-4 duration-400 ease-out">
                              <div className="h-px bg-[#f0f1f5] mb-4" />
                              
                              {/* Description Section */}
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

                              {/* Monthly Target Info */}
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

                              {/* Read Only Notice */}
                              <div className="flex items-center justify-center gap-2 text-[#8a8f97]/60 pt-2 border-t border-[#e8eaed]">
                                <span className="text-[10px] font-bold uppercase tracking-widest">History View - Read Only</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                  
                  // Normal mode: Interactive with animations
                  return (
                    <div
                      key={`${phase.key}-${habit.id}-${priorityCategory || 'none'}-${globalIdx}`}
                      className="animate-pop-in fill-mode-backwards"
                      style={{ animationDelay, willChange: 'transform, opacity' }}
                    >
                      <div
                        id={`habit-${habit.id}`}
                        onClick={(e) => {
                          // Only toggle on actual click, not scroll
                          if (!isHistory) onToggleHabit(habit.id, todayStr);
                        }}
                        className={`w-full flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl transition-transform duration-100 group border-2 cursor-pointer select-none touch-manipulation active:scale-[0.98] ${isDone
                          ? 'bg-white border-[#d4d7dc]'
                          : 'bg-transparent border-[#e8eaed] hover:bg-[#f8f9fb] hover:border-[#d4d7dc]'
                          }`}
                        style={{
                          borderColor: isDone ? undefined : `${phase.color}60`,
                          touchAction: 'pan-y', // Allow vertical scroll, prevent horizontal
                          WebkitTapHighlightColor: 'transparent'
                        } as React.CSSProperties}
                      >
                        <div 
                          className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 border-2 ${isDone
                            ? 'border-transparent scale-100 animate-check-pop'
                            : 'border-[#e8eaed] group-hover:border-[#71767b]'
                            }`}
                          style={isDone ? { 
                            backgroundColor: phase.color, 
                            boxShadow: `0 0 16px ${phase.color}44`,
                            willChange: 'transform'
                          } : {}}
                        >
                          {isDone ? (
                            <svg className="w-4 h-4 text-white animate-check-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" className="check-mark-path" />
                            </svg>
                          ) : (
                            <Circle className="w-4 h-4 text-[#8a8f97] group-hover:text-[#8a8f97] transition-colors" />
                          )}
                        </div>

                        <div className="flex-1 text-left min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`text-[14px] md:text-[15px] font-bold transition-all duration-300 ease-in-out truncate ${isDone ? 'text-[#8a8f97] opacity-60 line-through' : 'text-[#0a0a0a]'
                              }`}>
                              {habit.name.toUpperCase()}
                            </p>
                            {habit.streak > 0 && (
                              <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#ff6b00]/10 border border-[#ff6b00]/20 shrink-0">
                                 <Flame className="w-2.5 h-2.5 text-[#ff6b00] animate-fire" />
                                     <span className="text-[9px] font-black text-[#ff6b00]">{habit.streak}</span>
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
                })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
