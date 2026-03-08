// ==========================================
// 全局状态管理 - Zustand Store（本地存储版）
// ==========================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ==========================================
// 用户状态
// ==========================================

interface UserStore {
  user: {
    id: string;
    name: string;
    totalPoints: number;
    currentLevel: number;
    streak: number;
    todayTasks: number;
    completedTasks: number;
    todayHabits: number;
    completedHabits: number;
  } | null;
  setUser: (user: UserStore['user']) => void;
  updatePoints: (delta: number) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      updatePoints: (delta) => set((state) => ({
        user: state.user ? {
          ...state.user,
          totalPoints: state.user.totalPoints + delta
        } : null
      }))
    }),
    { name: 'life-os-user' }
  )
);

// ==========================================
// 时间维度状态
// ==========================================

interface TimePeriodStore {
  currentPeriod: 'today' | 'week' | 'month' | 'quarter' | 'year';
  setPeriod: (period: TimePeriodStore['currentPeriod']) => void;
}

export const useTimePeriodStore = create<TimePeriodStore>()(
  persist(
    (set) => ({
      currentPeriod: 'today',
      setPeriod: (period) => set({ currentPeriod: period })
    }),
    { name: 'life-os-period' }
  )
);

// ==========================================
// 模块导航状态
// ==========================================

interface ModuleStore {
  activeModule: string | null;
  setActiveModule: (module: string | null) => void;
}

export const useModuleStore = create<ModuleStore>()((set) => ({
  activeModule: null,
  setActiveModule: (module) => set({ activeModule: module })
}));

// ==========================================
// UI状态
// ==========================================

interface UIStore {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open })
}));
