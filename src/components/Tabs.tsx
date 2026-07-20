import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ListChecks, Plus, Clock, Dumbbell, LogOut, Loader2, User as UserIcon, ChevronDown, ChevronUp, Check, Menu, X } from 'lucide-react';
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
  const [gymTabRect, setGymTabRect] = useState<{ left: number; width: number } | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const nickname = useAppStore((s) => s.nickname);
  const avatar = useAppStore((s) => s.avatar);
  const openProfileModal = useAppStore((s) => s.openProfileModal);

  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'center' });
    }
  }, [activeTab]);

  useEffect(() => {
    if (gymTabRef.current) {
      const rect = gymTabRef.current.getBoundingClientRect();
      const navRect = gymTabRef.current.closest('.top-nav')?.getBoundingClientRect();
      if (navRect) {
        setGymTabRect({ left: rect.left - navRect.left, width: rect.width });
      }
    }
  }, [gymDropdownOpen]);

  useEffect(() => {
    if (!gymDropdownOpen || !onGymToggle) return;
    const handleClick = (e: MouseEvent) => {
      const nav = (e.target as HTMLElement).closest('.top-nav');
      if (!nav) onGymToggle();
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [gymDropdownOpen, onGymToggle]);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const initial = (nickname.trim()[0] || '').toUpperCase();

  return (
    <div className="top-nav sticky top-0 z-40">
      <div className="flex h-[44px] sm:h-[42px] md:h-[44px] items-center">
        {/* Mobile: Hamburger + Active tab name */}
        <div className="flex sm:hidden items-center px-3 h-full gap-3 w-full">
          <button
            onClick={() => setDrawerOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-lg active:bg-white/[0.08] transition-all"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
          <span className="text-[13px] font-black text-white flex-1">{activeTab}</span>
        </div>

        {/* Desktop: Tab group */}
        <div className="flex-1 min-w-0 hidden sm:flex h-full overflow-x-auto scrollbar-hide no-scrollbar relative">
          <div className="flex h-full min-w-max md:min-w-0 w-full items-center">
            {tabs.map((tab) => {
              const Icon = TAB_ICONS[tab] ?? ListChecks;
              const isActive = activeTab === tab;
              const isAdd = tab === 'Add Habit';
              const isGym = tab === 'Gym';

              return (
                <div key={tab} className="relative flex h-full">
                  <button
                    ref={(el) => {
                      if (isActive) activeTabRef.current = el;
                      if (isGym) gymTabRef.current = el;
                    }}
                    onClick={() => onTabChange(tab)}
                    className={`nav-tab relative h-full flex items-center justify-center gap-1.5 shrink-0 touch-manipulation group px-3 md:px-4 ${
                      isActive ? 'is-active' : ''
                    }`}
                    style={{ touchAction: 'manipulation' }}
                    title={tab}
                  >
                    {isAdd ? (
                      <div className="nav-add-icon-wrap flex items-center justify-center">
                        <Icon className="nav-tab-icon w-4 h-4 transition-all" strokeWidth={isActive ? 2.5 : 2} />
                      </div>
                    ) : (
                      <Icon className="nav-tab-icon w-4 h-4 transition-all" strokeWidth={isActive ? 2.5 : 2} />
                    )}
                    <span className={`nav-tab-label text-[11px] font-semibold tracking-wide transition-colors ${isActive ? 'font-bold' : ''}`}>
                      {tab}
                    </span>
                    {isActive && <div className="nav-underline absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-6 sm:w-8 rounded-t-full" />}
                  </button>
                  {isGym && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onGymToggle) onGymToggle();
                      }}
                      className="h-full px-1 flex items-center justify-center touch-manipulation"
                      style={{ touchAction: 'manipulation' }}
                    >
                      {gymDropdownOpen
                        ? <ChevronUp className="w-3 h-3" />
                        : <ChevronDown className="w-3 h-3" />
                      }
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop: Action group */}
        <div className="hidden sm:flex h-full shrink-0 items-center">
          <button
            onClick={openProfileModal}
            className="nav-icon-btn px-2 h-full flex items-center justify-center touch-manipulation"
            title="Profile"
            style={{ touchAction: 'manipulation' }}
          >
            <div className="w-6 h-6 rounded-full bg-[var(--bg-soft)] border border-[var(--border-soft)] flex items-center justify-center shrink-0 overflow-hidden transition-all">
              {avatarSrc(avatar) ? (
                <img src={avatarSrc(avatar)} alt="Avatar" className="w-full h-full object-contain" draggable={false} />
              ) : (
                <span className="text-[10px] font-bold text-[var(--text-primary)]">
                  {initial || <UserIcon className="w-3 h-3 text-[var(--text-muted)]" />}
                </span>
              )}
            </div>
          </button>
          {onLogout && (
            <button
              onClick={onLogout}
              disabled={isLoggingOut}
              className="nav-icon-btn nav-icon-btn--danger px-3 h-full flex items-center justify-center disabled:opacity-50 touch-manipulation"
              title="Sign Out"
              style={{ touchAction: 'manipulation' }}
            >
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Desktop: Gym dropdown below tab */}
      {gymDropdownOpen && gymDropdownItems.length > 0 && gymTabRect && (
        <div
          className="absolute animate-slide-up hidden sm:block"
          style={{ left: gymTabRect.left, top: '100%' }}
        >
          <div className="mt-0.5 rounded-xl bg-[#12161c]/95 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden" style={{ width: gymTabRect.width + 40 }}>
            {gymDropdownItems.map((item, i) => (
              <button
                key={item.key}
                onClick={item.onClick}
                className={`w-full flex items-center gap-2 px-3 py-2 transition-all active:bg-white/[0.04] ${item.active ? 'bg-white/[0.06]' : ''} ${i > 0 ? 'border-t border-white/5' : ''}`}
              >
                <span className="flex-1 text-left text-[12px] font-bold text-white/80">{item.label}</span>
                {item.active && <Check className="w-3 h-3 text-white/60 shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile: Drawer overlay — rendered via portal to escape sticky stacking context */}
      {drawerOpen && createPortal(
        <div className="fixed inset-0 z-[500] sm:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in"
            onClick={() => setDrawerOpen(false)}
          />

          <div className="absolute left-0 top-0 bottom-0 w-[260px] bg-[#0b0c0f] border-r border-white/10 flex flex-col animate-slide-in-left shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-[48px] border-b border-white/10 shrink-0">
              <span className="text-[14px] font-black text-white">Menu</span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg active:bg-white/[0.08]"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Nav items */}
            <div className="flex-1 overflow-y-auto py-2">
              {tabs.map((tab) => {
                const Icon = TAB_ICONS[tab] ?? ListChecks;
                const isActive = activeTab === tab;
                const isGym = tab === 'Gym';

                return (
                  <div key={tab}>
                    <button
                      onClick={() => {
                        onTabChange(tab);
                        if (isGym && onGymToggle) onGymToggle();
                        setDrawerOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 transition-all active:bg-white/[0.06] ${isActive ? 'bg-white/[0.08]' : ''}`}
                    >
                      <Icon className="w-5 h-5 text-white/70" strokeWidth={isActive ? 2.5 : 2} />
                      <span className={`text-[14px] font-bold ${isActive ? 'text-white' : 'text-white/80'}`}>{tab}</span>
                      {isGym && (
                        gymDropdownOpen
                          ? <ChevronUp className="w-4 h-4 text-white/50 ml-auto" />
                          : <ChevronDown className="w-4 h-4 text-white/50 ml-auto" />
                      )}
                    </button>

                    {isGym && gymDropdownOpen && (
                      <div className="border-t border-white/8">
                        {gymDropdownItems.map((item) => (
                          <button
                            key={item.key}
                            onClick={() => {
                              item.onClick();
                              setDrawerOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 pl-12 pr-4 py-3 transition-all active:bg-white/[0.06] ${item.active ? 'bg-white/[0.06]' : ''}`}
                          >
                            <span className={`text-[13px] font-bold ${item.active ? 'text-white' : 'text-white/70'}`}>{item.label}</span>
                            {item.active && <Check className="w-4 h-4 text-white/50 ml-auto" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom */}
            <div className="border-t border-white/10 py-2 shrink-0">
              <button
                onClick={() => { openProfileModal(); setDrawerOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-white/[0.06]"
              >
                <div className="w-6 h-6 rounded-full bg-[var(--bg-soft)] border border-[var(--border-soft)] flex items-center justify-center overflow-hidden">
                  {avatarSrc(avatar) ? (
                    <img src={avatarSrc(avatar)} alt="Avatar" className="w-full h-full object-contain" draggable={false} />
                  ) : (
                    <span className="text-[9px] font-bold text-[var(--text-primary)]">
                      {initial || <UserIcon className="w-3 h-3 text-[var(--text-muted)]" />}
                    </span>
                  )}
                </div>
                <span className="text-[13px] font-bold text-white/80">Profile</span>
              </button>
              {onLogout && (
                <button
                  onClick={() => { onLogout(); setDrawerOpen(false); }}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-white/[0.06] disabled:opacity-50"
                >
                  <LogOut className="w-5 h-5 text-white/60" />
                  <span className="text-[13px] font-bold text-white/70">Sign Out</span>
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
