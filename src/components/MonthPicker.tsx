import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthPickerProps {
  value: Date;
  onChange: (date: Date) => void;
  children: React.ReactNode;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const MonthPicker: React.FC<MonthPickerProps> = ({ value, onChange, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(value.getFullYear());

  const handleOpen = () => {
    setViewYear(value.getFullYear());
    setIsOpen(true);
  };

  const handleSelect = (monthIndex: number) => {
    onChange(new Date(viewYear, monthIndex, 1));
    setIsOpen(false);
  };

  const currentMonth = value.getMonth();
  const currentYear = value.getFullYear();
  const now = new Date();
  const todayMonth = now.getMonth();
  const todayYear = now.getFullYear();

  return (
    <>
      <div onClick={handleOpen} className="cursor-pointer">
        {children}
      </div>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[var(--bg-page)] backdrop-blur-md" onClick={() => setIsOpen(false)} />
          <div className="relative bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-[28px] shadow-[0_32px_128px_rgba(0,0,0,0.8)] w-[320px] md:w-[360px] animate-slide-up overflow-hidden">
            {/* Year Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border-soft)]">
              <button
                onClick={(e) => { e.stopPropagation(); setViewYear(y => y - 1); }}
                className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-[var(--bg-soft)] transition-all text-[var(--text-muted)] hover:text-[var(--text-primary)] active:scale-90 touch-manipulation"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-[20px] font-black text-[var(--text-primary)] tracking-tighter">{viewYear}</span>
              <button
                onClick={(e) => { e.stopPropagation(); setViewYear(y => y + 1); }}
                className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-[var(--bg-soft)] transition-all text-[var(--text-muted)] hover:text-[var(--text-primary)] active:scale-90 touch-manipulation"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Month Grid */}
            <div className="grid grid-cols-3 gap-3 p-6">
              {MONTHS.map((month, i) => {
                const isSelected = i === currentMonth && viewYear === currentYear;
                const isToday = i === todayMonth && viewYear === todayYear;

                return (
                  <button
                    key={month}
                    onClick={(e) => { e.stopPropagation(); handleSelect(i); }}
                    className={`py-4 rounded-2xl text-[14px] font-black transition-all duration-300 ${
                      isSelected
                        ? 'bg-[var(--brand)] text-white shadow-[0_8px_32px_rgba(29,155,240,0.4)] scale-105'
                        : isToday
                          ? 'bg-[var(--brand)]/10 text-[var(--brand)] border border-[var(--brand)]/40'
                          : 'text-[var(--text-primary)] hover:bg-[var(--bg-soft)] hover:scale-105'
                    }`}
                  >
                    {month}
                  </button>
                );
              })}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
