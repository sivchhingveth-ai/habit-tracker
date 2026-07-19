import React, { useEffect, useState } from 'react';

/**
 * Self-contained live clock. Updates once per minute for efficiency.
 * Seconds are omitted — they add visual noise without value in a status bar.
 */
export const LiveClock: React.FC = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const date = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="text-[var(--text-secondary)] font-semibold">{date}</span>
      <span className="text-[var(--text-muted)] font-medium tabular-nums">{time}</span>
    </span>
  );
};
