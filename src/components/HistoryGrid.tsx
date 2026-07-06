import React from 'react';
import { X, LayoutGrid, Sparkles } from 'lucide-react';
import { Habit } from '../types';
import { formatDateStr, getEffectiveDate } from '../utils/dateUtils';

const PHASE_COLORS: Record<string, string> = {
  'reset': '#6fa83b',
  'any': '#d05a96',
  'growth': '#9b5cff',
  'distraction': '#4e55e0',
  'spending': '#b08d2e',
};

const PHASE_EMOJI: Record<string, string> = {
  'reset': '🌱',
  'any': '🎯',
  'growth': '🚀',
  'distraction': '🚫',
  'spending': '💰',
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
      monthStarts.push({ label: MONTH_LABELS[c.month], colIndex: i });
      lastMonth = c.month;
    }
  });

  return (
    <div className="fixed inset-0 z-[100] bg-[var(--bg-page)] overflow-y-auto custom-scrollbar animate-slide-up">
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl border-b border-[#e8eaed]">
        <div className="max-w-[1000px] mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#f0f1f5] border border-[#e8eaed] flex items-center justify-center shrink-0">
              <LayoutGrid className="w-4 h-4 text-[#0a0a0a]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-[15px] md:text-[17px] font-black text-[#0a0a0a] tracking-tight leading-none">
                History Grid
              </h2>
              <p className="text-[10px] text-[#8a8f97] font-bold uppercase tracking-widest mt-1">
                Daily habits · {year}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-[#f0f1f5] border border-[#e8eaed] hover:bg-[#e8eaed] active:scale-95 transition-all shrink-0 touch-manipulation"
            title="Close"
            style={{ touchAction: 'manipulation' }}
          >
            <X className="w-4 h-4 text-[#0a0a0a]" />
          </button>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto p-4 md:p-6 space-y-3" style={{ paddingBottom: 'max(4rem, env(safe-area-inset-bottom) + 2rem)' }}>
        {dailyHabits.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#e8eaed]">
            <Sparkles className="w-10 h-10 text-[#f7cd63] mx-auto mb-4" />
            <p className="text-[#0a0a0a] text-base font-bold">No daily habits yet</p>
            <p className="text-[#8a8f97] text-sm mt-1">Add a daily habit to see your progress here.</p>
          </div>
        )}

        {dailyHabits.map((habit) => {
          const color = PHASE_COLORS[habit.time ?? ''] ?? '#6fa83b';
          const emoji = PHASE_EMOJI[habit.time ?? ''] ?? '⭐';
          const completedDays = Object.values(habit.history).filter(Boolean).length;
          const possibleDays = cells.filter((c) => c.dateStr).length;
          const pct = possibleDays > 0 ? Math.round((completedDays / possibleDays) * 100) : 0;

          return (
            <div
              key={String(habit.id)}
              className="bg-white border border-[#e8eaed] rounded-2xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0"
                  style={{ backgroundColor: `${color}25`, border: `1px solid ${color}40` }}
                >
                  {emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[#0a0a0a] font-black text-[15px] truncate">{habit.name}</h3>
                  {habit.description && (
                    <p className="text-[#8a8f97] text-[11px] mt-0.5 leading-snug">{habit.description}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[#0a0a0a] font-black text-[14px] leading-none">
                    {completedDays}<span className="text-[#8a8f97] text-[10px]">/{possibleDays}</span>
                  </p>
                  <p className="text-[#8a8f97] text-[9px] font-bold uppercase tracking-wider mt-0.5">{pct}%</p>
                </div>
              </div>

              <div className="overflow-x-auto custom-scrollbar pb-1 -mx-1 px-1">
                <div className="min-w-fit">
                  <div className="relative h-3 mb-1 ml-0">
                    {monthStarts.map((m, i) => {
                      const next = monthStarts[i + 1];
                      const colWidth = next ? (next.colIndex - m.colIndex) * 11 : (cells.length - m.colIndex) * 11;
                      return (
                        <span
                          key={m.label}
                          className="absolute text-[9px] font-black uppercase tracking-wider text-[#8a8f97]"
                          style={{ left: m.colIndex * 11, width: colWidth }}
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
                          className="w-2.5 h-2.5 rounded-sm transition-colors"
                          style={{
                            backgroundColor: isCompleted ? color : '#ebecf0',
                            boxShadow: isToday ? `0 0 0 2px white, 0 0 0 3px ${color}` : 'none',
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

        {dailyHabits.length > 0 && (
          <div className="flex items-center justify-end gap-2 pt-2 text-[10px] text-[#8a8f97] font-bold uppercase tracking-wider">
            <span>Less</span>
            <div className="w-2.5 h-2.5 rounded-sm bg-[#ebecf0]" />
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#b8eb6c' }} />
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: '#6fa83b' }} />
            <span>More</span>
          </div>
        )}
      </div>
    </div>
  );
};
