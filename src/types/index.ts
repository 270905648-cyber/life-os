// ==========================================
// 个人中枢App - 核心类型定义
// ==========================================

// ==========================================
// 一、模块定义
// ==========================================

export type ModuleCode = 
  | 'image'      // 形象管理
  | 'health'     // 健康养生
  | 'teaching'   // 数学教学
  | 'media'      // 自媒体IP
  | 'emotion'    // 情感人际
  | 'sidejob'    // 副业增收
  | 'growth'     // 自我成长
  | 'tools';     // 生活工具

export interface ModuleConfig {
  code: ModuleCode;
  name: string;
  icon: string;
  color: string;
  description: string;
  features: string[];
}

export const MODULES: ModuleConfig[] = [
  {
    code: 'image',
    name: '形象管理',
    icon: 'Sparkles',
    color: 'rose',
    description: '衣橱管理、穿搭推荐、护肤方案',
    features: ['衣橱管理', '穿搭推荐', '肤质记录', '护肤方案']
  },
  {
    code: 'health',
    name: '健康养生',
    icon: 'Heart',
    color: 'green',
    description: '中医体质分析、舌象记录、调理计划',
    features: ['体质分析', '舌象记录', '养生茶饮', '调理计划']
  },
  {
    code: 'teaching',
    name: '数学教学',
    icon: 'GraduationCap',
    color: 'blue',
    description: '教案生成、AI阅卷、题库管理',
    features: ['学生管理', '教案生成', 'AI阅卷', '题库管理']
  },
  {
    code: 'media',
    name: '自媒体IP',
    icon: 'Video',
    color: 'purple',
    description: '文案脚本库、选题策划、发布日历',
    features: ['文案脚本', '选题策划', '发布日历', '爆款分析']
  },
  {
    code: 'emotion',
    name: '情感人际',
    icon: 'Users',
    color: 'pink',
    description: '关系记录、沟通策略、情感复盘',
    features: ['关系记录', '沟通策略', '相亲管理', '情感复盘']
  },
  {
    code: 'sidejob',
    name: '副业增收',
    icon: 'TrendingUp',
    color: 'amber',
    description: '项目管理、收益记录、运营模板',
    features: ['项目管理', '收支记录', '运营模板', '收益分析']
  },
  {
    code: 'growth',
    name: '自我成长',
    icon: 'Target',
    color: 'cyan',
    description: '五年计划、习惯打卡、认知复盘',
    features: ['五年计划', '习惯打卡', '认知复盘', '目标追踪']
  },
  {
    code: 'tools',
    name: '生活工具',
    icon: 'Wrench',
    color: 'slate',
    description: '财务记账、事务提醒、地址管理',
    features: ['财务记账', '事务提醒', '地址管理', '证件卡片']
  }
];

// ==========================================
// 二、时间维度
// ==========================================

export type TimePeriod = 'today' | 'week' | 'month' | 'quarter' | 'year';

export interface PeriodConfig {
  code: TimePeriod;
  name: string;
  shortName: string;
}

export const TIME_PERIODS: PeriodConfig[] = [
  { code: 'today', name: '今日', shortName: '今' },
  { code: 'week', name: '本周', shortName: '周' },
  { code: 'month', name: '本月', shortName: '月' },
  { code: 'quarter', name: '本季度', shortName: '季' },
  { code: 'year', name: '本年度', shortName: '年' }
];

// ==========================================
// 三、任务状态
// ==========================================

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description?: string;
  period: TimePeriod;
  module?: ModuleCode;
  moduleId?: string;
  status: TaskStatus;
  priority: TaskPriority;
  points: number;
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// 四、习惯系统
// ==========================================

export interface Habit {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  frequency: 'daily' | 'weekly';
  streak: number;
  bestStreak: number;
  totalDays: number;
  points: number;
  module?: ModuleCode;
  status: 'active' | 'paused' | 'archived';
  todayCompleted?: boolean;
}

// ==========================================
// 五、积分与勋章
// ==========================================

export interface PointRecord {
  id: string;
  points: number;
  type: 'earn' | 'spend';
  source: string;
  description?: string;
  balance: number;
  createdAt: Date;
}

export interface Badge {
  id: string;
  code: string;
  name: string;
  description?: string;
  icon?: string;
  category: 'time' | 'module' | 'ultimate';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt?: Date;
}

// ==========================================
// 六、AI相关
// ==========================================

export type AiChatType = 'chat' | 'emotion' | 'advice' | 'companion';

export interface AiMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type: AiChatType;
  emotion?: string;
  createdAt: Date;
}

// ==========================================
// 七、数据总线
// ==========================================

export interface DataBusItem {
  module: ModuleCode;
  type: string;
  data: unknown;
  timestamp: Date;
  readonly: true;
}

// ==========================================
// 八、情绪系统
// ==========================================

export type EmotionType = 
  | 'happy' 
  | 'excited' 
  | 'calm' 
  | 'neutral' 
  | 'sad' 
  | 'anxious' 
  | 'angry' 
  | 'tired';

export interface EmotionState {
  type: EmotionType;
  intensity: number; // 1-10
  timestamp: Date;
  note?: string;
}

// ==========================================
// 九、仪表盘数据
// ==========================================

export interface DashboardData {
  radarChart: {
    module: ModuleCode;
    score: number;
  }[];
  trend: {
    date: string;
    tasks: number;
    habits: number;
    points: number;
  }[];
  heatmap: {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
  }[];
}

// ==========================================
// 十、用户状态
// ==========================================

export interface UserState {
  id: string;
  name?: string;
  avatar?: string;
  totalPoints: number;
  currentLevel: number;
  streak: number;
  todayTasks: number;
  completedTasks: number;
  todayHabits: number;
  completedHabits: number;
}

// ==========================================
// API响应类型
// ==========================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
