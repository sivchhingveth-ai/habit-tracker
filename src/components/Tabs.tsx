import React, { useEffect, useRef } from 'react';
import { ListChecks, Plus, Clock, Dumbbell, LogOut, Loader2, User as UserIcon, ChevronDown, ChevronUp, Check } from 'lucide-react';
import useAppStore from '../store/appStore';
import { avatarSrc } from '../utils/avatars';

interface GymDropdownItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

interface TabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
  isLoggingOut?: boolean;
  gymDropdownOpen?: boolean;
  onGymToggle?: () => void;
  gymDropdownItems?: GymDropdownItem[];
}

const TAB_ICONS: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  'To Do List': ListChecks,
  'Add Habit': Plus,
  'History': Clock,
  'Gym': Dumbbell,
};

export const Tabs: React.FC<TabsProps> = ({
  tabs, activeTab, onTabChange, onLogout, isLoggingOut,
  gymDropdownOpen = false, onGymToggle, gymDropdownItems = [],
}) => {
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const gymTabRef = useRef<HTMLButtonElement>(null);
  const nickname = useAppStore((s) => s.nickname);
  const avatar = useAppStore((s) => s.avatar);
  const openProfileModal = useAppStore((s) => s.openProfileModal);

  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'center' });
    }
  }, [activeTab]);

  // Close gym dropdown on outside click
  useEffect(() => {
    if (!gymDropdownOpen || !onGymToggle) return;
    const handleClick = (e: MouseEvent) => {
      const nav = (e.target as HTMLElement).closest('.top-nav');
      if (!nav) onGymToggle();
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [gymDropdownOpen, onGymToggle]);

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
              const isGym = tab === 'Gym';

              return (
                <button
                  key={tab}
                  ref={(el) => {
                    if (isActive) activeTabRef.current = el;
                    if (isGym) gymTabRef.current = el;
                  }}
                  onClick={() => {
                    if (isGym && onGymToggle) {
                      onGymToggle();
                    } else {
                      onTabChange(tab);
                    }
                  }}
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
                  {isGym && (
                    gymDropdownOpen
                      ? <ChevronUp className="w-3 h-3 text-white/40 hidden sm:block ml-0.5" />
                      : <ChevronDown className="w-3 h-3 text-white/40 hidden sm:block ml-0.5" />
                  )}
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
          <button
            onClick={openProfileModal}
            className="nav-icon-btn px-2.5 sm:px-3 h-full flex items-center justify-center touch-manipulation"
            title="Profile"
            style={{ touchAction: 'manipulation' }}
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--bg-soft)] border border-[var(--border-soft)] flex items-center justify-center shrink-0 overflow-hidden transition-all">
              {avatarSrc(avatar) ? (
                <img src={avatarSrc(avatar)} alt="Avatar" className="w-full h-full object-contain" draggable={false} />
              ) : (
                <span className="text-[11px] font-bold text-[var(--text-primary)]">
                  {initial || <UserIcon className="w-3.5 h-3.5 text-[var(--text-muted)]" />}
                </span>
              )}
            </div>
          </button>
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

      {/* Gym dropdown — positioned below the nav, same width as Gym tab */}
      {gymDropdownOpen && gymDropdownItems.length > 0 && (
        <div className="px-4 pb-2">
          <div className="rounded-xl bg-[#12161c]/95 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden animate-slide-up max-w-[200px]">
            {gymDropdownItems.map((item, i) => (
              <button
                key={item.key}
                onClick={item.onClick}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-all active:bg-white/[0.04] ${item.active ? 'bg-white/[0.06]' : ''} ${i > 0 ? 'border-t border-white/5' : ''}`}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/[0.06] border border-white/8 shrink-0">
                  {item.icon}
                </div>
                <span className="flex-1 text-left text-[12px] font-bold text-white/70">{item.label}</span>
                {item.active && <Check className="w-3.5 h-3.5 text-white/50 shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
