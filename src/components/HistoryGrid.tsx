import React from 'react';
import { X, LayoutGrid, Sparkles, Heart, Target, Rocket, ShieldOff, Wallet, TrendingUp, Calendar } from 'lucide-react';
import { Habit } from '../types';
import { formatDateStr, getEffectiveDate, toTitleCase } from '../utils/dateUtils';

const PHASE_COLORS: Record<string, string> = {
  'reset': '#6fa83b',
  'any': '#d05a96',
  'growth': '#9b5cff',
  'distraction': '#4e55e0',
  'spending': '#b08d2e',
};

const PHASE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  'reset': Heart,
  'any': Target,
  'growth': Rocket,
  'distraction': ShieldOff,
  'spending': Wallet,
};

const PHASE_LABELS: Record<string, string> = {
  'reset': 'Health',
  'any': 'Eliminate',
  'growth': 'Growth',
  'distraction': 'Reset',
  'spending': 'Boundary',
};

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface HistoryGridProps {
  habits: Habit[];
  onClose: () => void;
}

export const HistoryGrid: React.FC<HistoryGridProps> = ({ habits, onClose }) => {
  const dailyHabits = habits.filter((h) => !h.monthlyTarget);
  const today = getEffectiveDate();
  const todayStr = formatDateStr(today);
  const year = today.getFullYear();

  const yearStart = new Date(year, 0, 1);
  const firstDayOfWeek = yearStart.getDay();

  type Cell = { dateStr?: string; month?: number };
  const cells: Cell[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push({});
  for (let d = new Date(yearStart); d <= today; d.setDate(d.getDate() + 1)) {
    const nd = new Date(d);
    cells.push({ dateStr: formatDateStr(nd), month: nd.getMonth() });
  }

  const monthStarts: { label: string; colIndex: number }[] = [];
  let lastMonth = -1;
  cells.forEach((c, i) => {
    if (c.month !== undefined && c.month !== lastMonth) {
      monthStarts.push({ label: MONTH_LABELS[c.month], colIndex: Math.floor(i / 7) });
      lastMonth = c.month;
    }
  });
  const totalWeekCols = Math.ceil(cells.length / 7);
  const WEEK_COL_PX = 13;

  const totalPossibleDays = cells.filter((c) => c.dateStr).length;
  const totalCompletedAll = dailyHabits.reduce((sum, h) => sum + Object.values(h.history).filter(Boolean).length, 0);
  const totalPossibleAll = totalPossibleDays * dailyHabits.length;
  const overallPct = totalPossibleAll > 0 ? Math.round((totalCompletedAll / totalPossibleAll) * 100) : 0;

  const getStreak = (habit: Habit) => {
    let streak = 0;
    const d = new Date(today);
    while (true) {
      const ds = formatDateStr(d);
      if (habit.history[ds]) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[var(--bg-page)] overflow-y-auto custom-scrollbar animate-slide-up">
      <div className="sticky top-0 z-10 bg-[var(--bg-card)]/90 backdrop-blur-xl border-b border-[var(--border-soft)]">
        <div className="max-w-[1000px] mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[var(--bg-soft)] border border-[var(--border-soft)] flex items-center justify-center shrink-0">
              <LayoutGrid className="w-4 h-4 text-[var(--text-primary)]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-[15px] md:text-[17px] font-black text-[var(--text-primary)] tracking-tight leading-none">
                History Grid
              </h2>
              <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mt-1">
                Daily habits · {year}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-[var(--bg-soft)] border border-[var(--border-soft)] hover:bg-[var(--border-soft)] active:scale-95 transition-all shrink-0 touch-manipulation"
            title="Close"
            style={{ touchAction: 'manipulation' }}
          >
            <X className="w-4 h-4 text-[var(--text-primary)]" />
          </button>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto p-4 md:p-6 space-y-4" style={{ paddingBottom: 'max(4rem, env(safe-area-inset-bottom) + 2rem)' }}>
        {dailyHabits.length === 0 ? (
          <div className="text-center py-16 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-soft)]">
            <Sparkles className="w-10 h-10 text-[var(--warning)] mx-auto mb-4" />
            <p className="text-[var(--text-primary)] text-base font-bold">No daily habits yet</p>
            <p className="text-[var(--text-muted)] text-sm mt-1">Add a daily habit to see your progress here.</p>
          </div>
        ) : (
          <>
            {/* Overall Stats Bar */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
                <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{dailyHabits.length} habits</span>
              </div>
              <div className="h-4 w-px bg-[var(--border-soft)]" />
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[var(--text-muted)]" />
                <span className="text-xs font-bold text-[var(--text-muted)]">{totalCompletedAll}/{totalPossibleAll} days</span>
              </div>
              <div className="h-4 w-px bg-[var(--border-soft)]" />
              <span className="text-xs font-black text-[var(--text-primary)]">{overallPct}% overall</span>
            </div>

            {dailyHabits.map((habit) => {
              const color = PHASE_COLORS[habit.time ?? ''] ?? '#6fa83b';
              const Icon = PHASE_ICONS[habit.time ?? ''] ?? Target;
              const completedDays = Object.values(habit.history).filter(Boolean).length;
              const pct = totalPossibleDays > 0 ? Math.round((completedDays / totalPossibleDays) * 100) : 0;
              const streak = getStreak(habit);

              return (
                <div
                  key={String(habit.id)}
                  className="bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-2xl p-4 hover:shadow-md transition-shadow"
                >
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${color}18`, border: `1.5px solid ${color}30` }}
                    >
                      <Icon className="w-5 h-5" style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[var(--text-primary)] font-black text-[14px] truncate">{toTitleCase(habit.name)}</h3>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${color}15`, color }}>
                          {PHASE_LABELS[habit.time ?? ''] ?? habit.time}
                        </span>
                      </div>
                      {habit.description && (
                        <p className="text-[var(--text-muted)] text-[11px] mt-0.5 leading-snug truncate">{habit.description}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[var(--text-primary)] font-black text-[14px] leading-none">
                        {completedDays}<span className="text-[var(--text-muted)] text-[10px]">/{totalPossibleDays}</span>
                      </p>
                      <p className="text-[var(--text-muted)] text-[9px] font-bold uppercase tracking-wider mt-0.5">{pct}%</p>
                    </div>
                  </div>

                  {/* Streak indicator */}
                  {streak > 0 && (
                    <div className="flex items-center gap-1.5 mb-3 px-2 py-1 rounded-lg" style={{ backgroundColor: `${color}10` }}>
                      <span className="text-[11px] font-black" style={{ color }}>🔥 {streak} day streak</span>
                    </div>
                  )}

                  {/* Calendar Grid */}
                  <div className="overflow-x-auto custom-scrollbar pb-1 -mx-1 px-1">
                    <div className="min-w-fit">
                      <div className="relative h-3 mb-1.5 ml-0">
                        {monthStarts.map((m, i) => {
                          const next = monthStarts[i + 1];
                          const colWidth = next
                            ? (next.colIndex - m.colIndex) * WEEK_COL_PX
                            : (totalWeekCols - m.colIndex) * WEEK_COL_PX;
                          return (
                            <span
                              key={m.label}
                              className="absolute text-[9px] font-black uppercase tracking-wider text-[var(--text-muted)]"
                              style={{ left: m.colIndex * WEEK_COL_PX, width: colWidth }}
                            >
                              {m.label}
                            </span>
                          );
                        })}
                      </div>
                      <div
                        className="grid grid-rows-7 grid-flow-col gap-[2px]"
                        style={{ width: 'max-content' }}
                      >
                        {cells.map((cell, i) => {
                          if (!cell.dateStr) {
                            return <div key={i} className="w-2.5 h-2.5 rounded-sm" />;
                          }
                          const isCompleted = habit.history[cell.dateStr];
                          const isToday = cell.dateStr === todayStr;
                          return (
                            <div
                              key={i}
                              className="w-2.5 h-2.5 rounded-sm transition-colors hover:ring-1 hover:ring-[var(--text-muted)]/30"
                              style={{
                                backgroundColor: isCompleted ? color : 'var(--border-soft)',
                                boxShadow: isToday ? `0 0 0 2px var(--bg-page), 0 0 0 3.5px ${color}` : 'none',
                              }}
                              title={`${cell.dateStr}${isCompleted ? ' · done' : ''}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Legend */}
            <div className="flex items-center justify-center gap-3 pt-2 text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-wider">
              <span>Less</span>
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: 'var(--border-soft)' }} />
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#b8eb6c' }} />
              <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#6fa83b' }} />
              <span>More</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
