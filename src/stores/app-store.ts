// ==========================================
// 全局状态管理 - Zustand Store
// ==========================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  TimePeriod, 
  ModuleCode, 
  Task, 
  Habit, 
  UserState,
  AiMessage,
  EmotionType
} from '@/types';

// ==========================================
// 用户状态
// ==========================================

interface UserStore {
  user: UserState | null;
  setUser: (user: UserState) => void;
  updatePoints: (delta: number) => void;
  updateStats: (stats: Partial<UserState>) => void;
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
      })),
      updateStats: (stats) => set((state) => ({
        user: state.user ? { ...state.user, ...stats } : null
      }))
    }),
    { name: 'user-store' }
  )
);

// ==========================================
// 时间维度状态
// ==========================================

interface TimePeriodStore {
  currentPeriod: TimePeriod;
  setPeriod: (period: TimePeriod) => void;
}

export const useTimePeriodStore = create<TimePeriodStore>()(
  persist(
    (set) => ({
      currentPeriod: 'today',
      setPeriod: (period) => set({ currentPeriod: period })
    }),
    { name: 'time-period-store' }
  )
);

// ==========================================
// 任务状态
// ==========================================

interface TaskStore {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTasksByPeriod: (period: TimePeriod) => Task[];
  getTasksByModule: (module: ModuleCode) => Task[];
}

export const useTaskStore = create<TaskStore>()((set, get) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map((t) => 
      t.id === id ? { ...t, ...updates } : t
    )
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((t) => t.id !== id)
  })),
  getTasksByPeriod: (period) => get().tasks.filter((t) => t.period === period),
  getTasksByModule: (module) => get().tasks.filter((t) => t.module === module)
}));

// ==========================================
// 习惯状态
// ==========================================

interface HabitStore {
  habits: Habit[];
  setHabits: (habits: Habit[]) => void;
  toggleHabit: (id: string) => void;
  getActiveHabits: () => Habit[];
}

export const useHabitStore = create<HabitStore>()((set, get) => ({
  habits: [],
  setHabits: (habits) => set({ habits }),
  toggleHabit: (id) => set((state) => ({
    habits: state.habits.map((h) => 
      h.id === id 
        ? { 
            ...h, 
            todayCompleted: !h.todayCompleted,
            streak: h.todayCompleted ? h.streak - 1 : h.streak + 1,
            totalDays: h.todayCompleted ? h.totalDays - 1 : h.totalDays + 1
          } 
        : h
    )
  })),
  getActiveHabits: () => get().habits.filter((h) => h.status === 'active')
}));

// ==========================================
// AI对话状态
// ==========================================

interface AiStore {
  messages: AiMessage[];
  isOpen: boolean;
  addMessage: (message: AiMessage) => void;
  clearMessages: () => void;
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
}

export const useAiStore = create<AiStore>()(
  persist(
    (set) => ({
      messages: [],
      isOpen: false,
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
      })),
      clearMessages: () => set({ messages: [] }),
      toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
      setOpen: (open) => set({ isOpen: open })
    }),
    { name: 'ai-store' }
  )
);

// ==========================================
// 情绪状态
// ==========================================

interface EmotionStore {
  currentEmotion: EmotionType | null;
  emotionIntensity: number;
  setEmotion: (emotion: EmotionType, intensity: number) => void;
}

export const useEmotionStore = create<EmotionStore>()(
  persist(
    (set) => ({
      currentEmotion: null,
      emotionIntensity: 5,
      setEmotion: (emotion, intensity) => set({
        currentEmotion: emotion,
        emotionIntensity: intensity
      })
    }),
    { name: 'emotion-store' }
  )
);

// ==========================================
// 模块导航状态
// ==========================================

interface ModuleStore {
  activeModule: ModuleCode | null;
  setActiveModule: (module: ModuleCode | null) => void;
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
