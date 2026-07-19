import React, { useEffect, useRef } from 'react';
import { ListChecks, Plus, Clock, Dumbbell, LogOut, Loader2, User as UserIcon } from 'lucide-react';
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

  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'center' });
    }
  }, [activeTab]);

  const initial = (nickname.trim()[0] || '').toUpperCase();

  return (
    <div className="top-nav sticky top-0 z-40">
      <div className="flex h-[60px] sm:h-[64px] md:h-[68px] items-center">
        {/* Tab group */}
        <div className="flex-1 min-w-0 flex h-full overflow-x-auto scrollbar-hide no-scrollbar relative">
          <div className="flex h-full min-w-max md:min-w-0 w-full items-center">
            {tabs.map((tab) => {
              const Icon = TAB_ICONS[tab] ?? ListChecks;
              const isActive = activeTab === tab;
              const isAdd = tab === 'Add Habit';

              return (
                <button
                  key={tab}
                  ref={isActive ? activeTabRef : null}
                  onClick={() => onTabChange(tab)}
                  className={`nav-tab relative h-full flex items-center justify-center gap-1.5 sm:gap-2 shrink-0 touch-manipulation group px-2.5 sm:px-4 md:px-5 ${
                    isActive ? 'is-active' : ''
                  }`}
                  style={{ touchAction: 'manipulation' }}
                  title={tab}
                >
                  {isAdd ? (
                    <div className="nav-add-icon-wrap flex items-center justify-center">
                      <Icon
                        className="nav-tab-icon w-[18px] h-[18px] sm:w-5 sm:h-5 transition-all"
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                    </div>
                  ) : (
                    <Icon
                      className="nav-tab-icon w-[18px] h-[18px] sm:w-5 sm:h-5 transition-all"
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  )}
                  <span className={`nav-tab-label text-[10px] sm:text-[11px] font-semibold tracking-wide transition-colors hidden sm:inline ${
                    isActive ? 'font-bold' : ''
                  }`}>
                    {tab}
                  </span>
                  {isActive && (
                    <div className="nav-underline absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-6 sm:w-8 rounded-t-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action group */}
        <div className="flex h-full shrink-0 items-center">
          {/* Profile */}
          <button
            onClick={openProfileModal}
            className="nav-icon-btn px-2.5 sm:px-3 h-full flex items-center justify-center touch-manipulation"
            title="Profile"
            style={{ touchAction: 'manipulation' }}
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--bg-soft)] border border-[var(--border-soft)] flex items-center justify-center shrink-0 overflow-hidden transition-all">
              {avatarSrc(avatar) ? (
                <img
                  src={avatarSrc(avatar)}
                  alt="Avatar"
                  className="w-full h-full object-contain"
                  draggable={false}
                />
              ) : (
                <span className="text-[11px] font-bold text-[var(--text-primary)]">
                  {initial || <UserIcon className="w-3.5 h-3.5 text-[var(--text-muted)]" />}
                </span>
              )}
            </div>
          </button>

          {/* Logout */}
          {onLogout && (
            <button
              onClick={onLogout}
              disabled={isLoggingOut}
              className="nav-icon-btn nav-icon-btn--danger px-2.5 sm:px-3 md:px-4 h-full flex items-center justify-center disabled:opacity-50 touch-manipulation"
              title="Sign Out"
              style={{ touchAction: 'manipulation' }}
            >
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 sm:w-[18px] sm:h-[18px] animate-spin" />
              ) : (
                <LogOut className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
