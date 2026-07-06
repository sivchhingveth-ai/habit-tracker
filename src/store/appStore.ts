import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { getEffectiveDateStr, getEffectiveDate } from '../utils/dateUtils';

export type Theme = 'light' | 'dark';
const THEME_KEY = 'habit_tracker_theme';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

let _themeTransitionTimer: ReturnType<typeof setTimeout> | undefined;
function applyTheme(theme: Theme, animate = false) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  // On explicit user toggles, add a short-lived class that enables a global
  // cross-fade of colors/backgrounds/borders across the entire app, then
  // removes it so it never interferes with normal hover/tap transitions.
  if (animate) {
    root.classList.add('theme-transition');
    if (_themeTransitionTimer) clearTimeout(_themeTransitionTimer);
    _themeTransitionTimer = setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 500);
  }
  root.setAttribute('data-theme', theme);
}

// Keep the DOM in sync on first import (the inline script in index.html
// handles the pre-paint case; this covers hydration and HMR).
applyTheme(getInitialTheme());

interface TimeState {
  now: Date;
  todayStr: string;
  todayDate: Date;
}

interface ModalState {
  modalOpen: string | null;
  confirmModal: {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  };
}

interface FormState {
  newHabitName: string;
  newHabitTime: string;
  newHabitMonthlyTarget: string;
  newHabitDescription: string;
  habitError: string;
  newGoalName: string;
  newGoalAmount: string;
  newGoalStartDate: string;
  newGoalTargetDate: string;
  spendingError: string;
  editingHabitId: string | null;
}

interface UIState {
  activeTab: string;
  historyDate: string;
  viewDate: Date;
  isLoggingOut: boolean;
  loadingTimeout: boolean;
  showScrollTop: boolean;
  isOnline: boolean;
  searchTerm: string;
  showActionsId: string | null;
}

interface AppStore extends TimeState, ModalState, FormState, UIState {
  // Actions
  setNow: (now: Date) => void;
  updateTime: () => void;
  
  // Modal actions
  openModal: (modal: string) => void;
  closeModal: () => void;
  openConfirmModal: (title: string, message: string, onConfirm: () => void) => void;
  closeConfirmModal: () => void;
  profileModalOpen: boolean;
  gymModalOpen: boolean;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  openGymModal: () => void;
  closeGymModal: () => void;
  historyGridOpen: boolean;
  openHistoryGrid: () => void;
  closeHistoryGrid: () => void;
  nickname: string;
  setNickname: (name: string) => void;
  avatar: string;
  setAvatar: (emoji: string) => void;

  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // Form actions
  setNewHabitName: (name: string) => void;
  setNewHabitTime: (time: string) => void;
  setNewHabitMonthlyTarget: (target: string) => void;
  setNewHabitDescription: (desc: string) => void;
  setHabitError: (error: string) => void;
  setNewGoalName: (name: string) => void;
  setNewGoalAmount: (amount: string) => void;
  setNewGoalStartDate: (date: string) => void;
  setNewGoalTargetDate: (date: string) => void;
  setSpendingError: (error: string) => void;
  setEditingHabitId: (id: string | null) => void;
  resetHabitForm: () => void;
  resetGoalForm: () => void;
  resetForms: () => void;
  
  // UI actions
  setActiveTab: (tab: string) => void;
  setHistoryDate: (date: string) => void;
  setViewDate: (date: Date) => void;
  setIsLoggingOut: (loggingOut: boolean) => void;
  setLoadingTimeout: (timeout: boolean) => void;
  setShowScrollTop: (show: boolean) => void;
  setIsOnline: (online: boolean) => void;
  setSearchTerm: (term: string) => void;
  setShowActionsId: (id: string | null) => void;
}

const initialFormState: FormState = {
  newHabitName: '',
  newHabitTime: '',
  newHabitMonthlyTarget: '',
  newHabitDescription: '',
  habitError: '',
  newGoalName: '',
  newGoalAmount: '',
  newGoalStartDate: getEffectiveDateStr(),
  newGoalTargetDate: getEffectiveDateStr(),
  spendingError: '',
  editingHabitId: null,
};

const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Time state - initialized once
      now: new Date(),
      todayStr: getEffectiveDateStr(),
      todayDate: getEffectiveDate(),
      
      // Modal state
      modalOpen: null,
      confirmModal: {
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
      },
      
      // Form state
      ...initialFormState,
      
      // UI state
      activeTab: 'Rules & Growth',
      historyDate: getEffectiveDateStr(),
      viewDate: new Date(),
      isLoggingOut: false,
      loadingTimeout: false,
      showScrollTop: false,
      isOnline: typeof window !== 'undefined' ? window.navigator.onLine : true,
      searchTerm: '',
      showActionsId: null,
      profileModalOpen: false,
      gymModalOpen: false,
      historyGridOpen: false,
      nickname: typeof window !== 'undefined' ? (localStorage.getItem('habit_tracker_nickname') || '') : '',
      avatar: typeof window !== 'undefined' ? (localStorage.getItem('habit_tracker_avatar') || '') : '',
      theme: getInitialTheme(),

      // Time actions - single source of truth
      setNow: (now) => {
        const todayStr = getEffectiveDateStr(now);
        const todayDate = getEffectiveDate(now);
        set({ now, todayStr, todayDate });
      },
      
      updateTime: () => {
        const now = new Date();
        const todayStr = getEffectiveDateStr(now);
        const todayDate = getEffectiveDate(now);
        set({ now, todayStr, todayDate });
      },
      
      // Modal actions
      openModal: (modal) => set({ modalOpen: modal }),
      closeModal: () => set({ modalOpen: null, editingHabitId: null }),
      
      openConfirmModal: (title, message, onConfirm) => 
        set({ 
          confirmModal: { isOpen: true, title, message, onConfirm } 
        }),
      closeConfirmModal: () => 
        set({ 
          confirmModal: { ...get().confirmModal, isOpen: false } 
        }),
      
      // Form actions
      setNewHabitName: (name) => set({ newHabitName: name }),
      setNewHabitTime: (time) => set({ newHabitTime: time }),
      setNewHabitMonthlyTarget: (target) => set({ newHabitMonthlyTarget: target }),
      setNewHabitDescription: (desc) => set({ newHabitDescription: desc }),
      setHabitError: (error) => set({ habitError: error }),
      setNewGoalName: (name) => set({ newGoalName: name }),
      setNewGoalAmount: (amount) => set({ newGoalAmount: amount }),
      setNewGoalStartDate: (date) => set({ newGoalStartDate: date }),
      setNewGoalTargetDate: (date) => set({ newGoalTargetDate: date }),
      setSpendingError: (error) => set({ spendingError: error }),
      setEditingHabitId: (id) => set({ editingHabitId: id }),
      
      resetHabitForm: () => set({
        newHabitName: '',
        newHabitTime: '',
        newHabitMonthlyTarget: '',
        newHabitDescription: '',
        habitError: '',
        editingHabitId: null,
      }),
      
      resetGoalForm: () => set({
        newGoalName: '',
        newGoalAmount: '',
        newGoalStartDate: get().todayStr,
        newGoalTargetDate: get().todayStr,
        spendingError: '',
      }),
      
      resetForms: () => set({
        ...initialFormState,
        newGoalStartDate: get().todayStr,
        newGoalTargetDate: get().todayStr,
      }),
      
      // UI actions
      setActiveTab: (tab) => set({ activeTab: tab }),
      setHistoryDate: (date) => set({ historyDate: date }),
      setViewDate: (date) => set({ viewDate: date }),
      setIsLoggingOut: (loggingOut) => set({ isLoggingOut: loggingOut }),
      setLoadingTimeout: (timeout) => set({ loadingTimeout: timeout }),
      setShowScrollTop: (show) => set({ showScrollTop: show }),
      setIsOnline: (online) => set({ isOnline: online }),
      setSearchTerm: (term) => set({ searchTerm: term }),
      setShowActionsId: (id) => set({ showActionsId: id }),

      // Profile & Gym
      openProfileModal: () => set({ profileModalOpen: true }),
      closeProfileModal: () => set({ profileModalOpen: false }),
      openGymModal: () => set({ gymModalOpen: true }),
      closeGymModal: () => set({ gymModalOpen: false }),
      openHistoryGrid: () => set({ historyGridOpen: true }),
      closeHistoryGrid: () => set({ historyGridOpen: false }),
      setNickname: (name) => {
        if (typeof window !== 'undefined') {
          if (name) localStorage.setItem('habit_tracker_nickname', name);
          else localStorage.removeItem('habit_tracker_nickname');
        }
        set({ nickname: name });
      },
      setAvatar: (emoji) => {
        if (typeof window !== 'undefined') {
          if (emoji) localStorage.setItem('habit_tracker_avatar', emoji);
          else localStorage.removeItem('habit_tracker_avatar');
        }
        set({ avatar: emoji });
      },

      // Theme actions
      setTheme: (theme) => {
        if (typeof window !== 'undefined') localStorage.setItem(THEME_KEY, theme);
        applyTheme(theme, true);
        set({ theme });
      },
      toggleTheme: () => {
        const next: Theme = get().theme === 'dark' ? 'light' : 'dark';
        get().setTheme(next);
      },
    }),
    {
      name: 'habit-tracker-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        // Only persist UI preferences, not time-sensitive data
        activeTab: state.activeTab,
        nickname: state.nickname,
        avatar: state.avatar,
      }),
    }
  )
);

export default useAppStore;
