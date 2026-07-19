import React, { useEffect, useRef } from 'react';
import { ListChecks, Plus, Clock, Dumbbell, LogOut, Loader2, User as UserIcon, Sun, Moon } from 'lucide-react';
import useAppStore from '../store/appStore';
import { avatarSrc } from '../utils/avatars';

interface TabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
  isLoggingOut?: boolean;
}

const TAB_ICONS: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  'To Do List': ListChecks,
  'Add Habit': Plus,
  'History': Clock,
  'Gym': Dumbbell,
};

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange, onLogout, isLoggingOut }) => {
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const nickname = useAppStore((s) => s.nickname);
  const avatar = useAppStore((s) => s.avatar);
  const openProfileModal = useAppStore((s) => s.openProfileModal);
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);

  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'center' });
    }
  }, [activeTab]);

  const initial = (nickname.trim()[0] || '').toUpperCase();

  return (
    <div className="top-nav sticky top-0 z-40">
      <div className="flex h-[72px] items-center">
        <div className="flex-1 min-w-0 flex h-full overflow-x-auto scrollbar-hide no-scrollbar relative">
          <div className="flex h-full min-w-max md:min-w-0 w-full">
            {tabs.map((tab, index) => {
              const Icon = TAB_ICONS[tab] ?? ListChecks;
              const isActive = activeTab === tab;
              const isAdd = tab === 'Add Habit';
              const isLast = index === tabs.length - 1;

              return (
                <button
                  key={tab}
                  ref={isActive ? activeTabRef : null}
                  onClick={() => onTabChange(tab)}
                  className={`glass-hover nav-tab relative flex-1 min-w-[70px] sm:min-w-[90px] md:min-w-[100px] h-full flex flex-col items-center justify-center gap-0.5 sm:gap-1 shrink-0 touch-manipulation group ${
                    isActive ? 'is-active' : ''
                  } ${isLast ? '' : 'nav-divide-r'}`}
                  style={{ touchAction: 'manipulation' }}
                  title={tab}
                >
                  {isAdd ? (
                    <div className="nav-add w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 group-active:scale-95 is-active">
                    <Icon
                      className="nav-add-icon w-4 h-4 sm:w-5 sm:h-5"
                      strokeWidth={3}
                    />
                    </div>
                  ) : (
                    <Icon
                      className="nav-tab-icon w-4 h-4 sm:w-5 sm:h-5 transition-all"
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  )}
                  <span className="nav-tab-label text-[10px] md:text-[11px] font-black uppercase tracking-wider transition-colors">
                    {tab}
                  </span>
                  {isActive && (
                    <div className="nav-underline absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] w-10 rounded-t-full animate-in fade-in zoom-in-50 duration-300" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex h-full shrink-0 nav-divide-l">
          <button
            onClick={openProfileModal}
            className="glass-hover nav-icon-btn px-2 sm:px-3 md:px-4 h-full flex items-center gap-1.5 sm:gap-2 touch-manipulation"
            title="Profile"
            style={{ touchAction: 'manipulation' }}
          >
            <div
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-[var(--bg-soft)] border border-[var(--border-soft)] flex items-center justify-center shrink-0 overflow-hidden"
            >
              {avatarSrc(avatar) ? (
                <img
                  src={avatarSrc(avatar)}
                  alt="Avatar"
                  className="w-full h-full object-contain"
                  draggable={false}
                />
              ) : (
                <span className="text-[12px] md:text-[13px] font-bold text-[var(--text-primary)]">
                  {initial || <UserIcon className="w-4 h-4 text-[var(--text-muted)]" />}
                </span>
              )}
            </div>
            {nickname.trim() && (
              <span className="hidden md:inline text-[12px] font-black uppercase tracking-wider max-w-[120px] truncate">
                {nickname.trim()}
              </span>
            )}
          </button>

          <button
            onClick={toggleTheme}
            className="glass-hover nav-icon-btn nav-divide-l px-2 sm:px-3 md:px-4 h-full flex items-center justify-center touch-manipulation"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{ touchAction: 'manipulation' }}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
            ) : (
              <Moon className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
            )}
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              disabled={isLoggingOut}
              className="glass-hover nav-icon-btn nav-icon-btn--danger nav-divide-l px-3 sm:px-4 md:px-5 h-full flex items-center justify-center disabled:opacity-50 touch-manipulation"
              title="Sign Out"
              style={{ touchAction: 'manipulation' }}
            >
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 md:w-5 h-5 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4 md:w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
