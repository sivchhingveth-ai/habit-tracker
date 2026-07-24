import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  className?: string;
}

// Custom-styled replacement for a native <select> so the open dropdown
// matches the app's theme instead of the browser's native (unthemeable) list.
export const Select: React.FC<SelectProps> = ({ value, options, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between gap-2 text-left cursor-pointer ${className ?? ''}`}
      >
        <span className="truncate">{selected?.label}</span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 text-[var(--text-muted)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-1.5 z-50 animate-dropdown-in"
          style={{ transformOrigin: 'top' }}
        >
          <div
            className="rounded-xl p-1 bg-[var(--bg-card)] border border-[var(--border-soft)] overflow-hidden max-h-[280px] overflow-y-auto custom-scrollbar"
            style={{ boxShadow: 'var(--shadow-lg)' }}
          >
            {options.map((opt) => {
              const isSelected = opt.value === value;
              const dashIdx = opt.label.indexOf(' - ');
              const main = dashIdx === -1 ? opt.label : opt.label.slice(0, dashIdx);
              const detail = dashIdx === -1 ? null : opt.label.slice(dashIdx + 3);

              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { onChange(opt.value); setIsOpen(false); }}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    isSelected ? 'bg-[var(--brand-soft)]' : 'hover:bg-[var(--bg-soft)]'
                  }`}
                >
                  <span className="min-w-0">
                    <span className={`block text-[13px] font-bold ${isSelected ? 'text-[var(--brand)]' : 'text-[var(--text-primary)]'}`}>
                      {main}
                    </span>
                    {detail && (
                      <span className="block text-[11px] font-medium text-[var(--text-muted)] mt-0.5">
                        {detail}
                      </span>
                    )}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-[var(--brand)] shrink-0" strokeWidth={3} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
