// ==========================================
// 数据总线 - 模块间只读通信系统
// ==========================================
// 设计原则：
// 1. 模块之间：只许读、不许改
// 2. 单向输出、互不依赖
// 3. 数据修改仅能在模块内部完成

import { db } from '@/lib/db';
import type { ModuleCode, DataBusItem } from '@/types';

// ==========================================
// 数据总线核心类
// ==========================================

class DataBus {
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private cacheTimeout = 60000; // 1分钟缓存

  // 发布数据到总线（仅模块内部调用）
  async publish(module: ModuleCode, type: string, data: unknown): Promise<void> {
    const key = `${module}:${type}`;
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // 从总线读取数据（只读）
  async read<T = unknown>(module: ModuleCode, type: string): Promise<T | null> {
    const key = `${module}:${type}`;
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data as T;
    }
    
    // 缓存过期，重新获取
    const data = await this.fetchFromModule(module, type);
    if (data) {
      this.cache.set(key, {
        data,
        timestamp: Date.now()
      });
    }
    return data as T;
  }

  // 从数据库获取模块数据
  private async fetchFromModule(module: ModuleCode, type: string): Promise<unknown> {
    try {
      switch (module) {
        case 'image':
          return await this.fetchImageData(type);
        case 'health':
          return await this.fetchHealthData(type);
        case 'teaching':
          return await this.fetchTeachingData(type);
        case 'media':
          return await this.fetchMediaData(type);
        case 'emotion':
          return await this.fetchEmotionData(type);
        case 'sidejob':
          return await this.fetchSidejobData(type);
        case 'growth':
          return await this.fetchGrowthData(type);
        case 'tools':
          return await this.fetchToolsData(type);
        default:
          return null;
      }
    } catch (error) {
      console.error(`DataBus fetch error: ${module}:${type}`, error);
      return null;
    }
  }

  // 形象管理数据
  private async fetchImageData(type: string) {
    switch (type) {
      case 'wardrobe-stats':
        return await db.wardrobeItem.groupBy({
          by: ['category'],
          _count: true
        });
      case 'recent-outfits':
        return await db.outfit.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { items: { include: { item: true } } }
        });
      case 'skin-records':
        return await db.skinRecord.findMany({
          take: 10,
          orderBy: { recordDate: 'desc' }
        });
      default:
        return null;
    }
  }

  // 健康养生数据
  private async fetchHealthData(type: string) {
    switch (type) {
      case 'constitution':
        return await db.constitution.findFirst({
          orderBy: { analyzedAt: 'desc' }
        });
      case 'tongue-records':
        return await db.tongueRecord.findMany({
          take: 10,
          orderBy: { recordDate: 'desc' }
        });
      case 'health-plans':
        return await db.healthPlan.findMany({
          where: { status: 'active' }
        });
      default:
        return null;
    }
  }

  // 数学教学数据
  private async fetchTeachingData(type: string) {
    switch (type) {
      case 'students':
        return await db.student.findMany({
          where: { status: 'active' }
        });
      case 'lesson-plans':
        return await db.lessonPlan.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' }
        });
      case 'exam-records':
        return await db.examRecord.findMany({
          take: 10,
          orderBy: { examDate: 'desc' }
        });
      default:
        return null;
    }
  }

  // 自媒体IP数据
  private async fetchMediaData(type: string) {
    switch (type) {
      case 'contents':
        return await db.contentScript.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' }
        });
      case 'publish-calendar':
        return await db.publishCalendar.findMany({
          where: {
            publishDate: {
              gte: new Date()
            }
          },
          orderBy: { publishDate: 'asc' }
        });
      case 'topic-plans':
        return await db.topicPlan.findMany({
          where: { status: 'planned' }
        });
      default:
        return null;
    }
  }

  // 情感人际数据
  private async fetchEmotionData(type: string) {
    switch (type) {
      case 'relationships':
        return await db.relationship.findMany({
          orderBy: { closeness: 'desc' }
        });
      case 'dating-profiles':
        return await db.datingProfile.findMany({
          where: { status: { in: ['contacting', 'dating'] } }
        });
      default:
        return null;
    }
  }

  // 副业增收数据
  private async fetchSidejobData(type: string) {
    switch (type) {
      case 'projects':
        return await db.sideProject.findMany({
          where: { status: 'active' },
          include: {
            _count: { select: { transactions: true, tasks: true } }
          }
        });
      case 'transactions':
        return await db.projectTransaction.findMany({
          take: 20,
          orderBy: { transactionDate: 'desc' }
        });
      default:
        return null;
    }
  }

  // 自我成长数据
  private async fetchGrowthData(type: string) {
    switch (type) {
      case 'five-year-plan':
        return await db.fiveYearPlan.findMany({
          orderBy: { year: 'asc' }
        });
      case 'habits':
        return await db.habit.findMany({
          where: { status: 'active' }
        });
      case 'cognitive-reviews':
        return await db.cognitiveReview.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' }
        });
      default:
        return null;
    }
  }

  // 生活工具数据
  private async fetchToolsData(type: string) {
    switch (type) {
      case 'finance-summary':
        const income = await db.financeRecord.aggregate({
          where: { type: 'income' },
          _sum: { amount: true }
        });
        const expense = await db.financeRecord.aggregate({
          where: { type: 'expense' },
          _sum: { amount: true }
        });
        return {
          totalIncome: income._sum.amount || 0,
          totalExpense: expense._sum.amount || 0,
          balance: (income._sum.amount || 0) - (expense._sum.amount || 0)
        };
      case 'reminders':
        return await db.reminder.findMany({
          where: {
            status: 'pending',
            remindAt: {
              lte: new Date(Date.now() + 24 * 60 * 60 * 1000)
            }
          },
          orderBy: { remindAt: 'asc' }
        });
      default:
        return null;
    }
  }

  // 获取所有模块的摘要数据（首页用）
  async getAllModulesSummary(): Promise<Record<ModuleCode, unknown>> {
    const summary: Record<string, unknown> = {};
    const moduleCodes: ModuleCode[] = ['image', 'health', 'teaching', 'media', 'emotion', 'sidejob', 'growth', 'tools'];
    
    for (const moduleCode of moduleCodes) {
      summary[moduleCode] = await this.read(moduleCode, 'summary');
    }
    
    return summary as Record<ModuleCode, unknown>;
  }

  // 清除缓存
  clearCache(moduleCode?: ModuleCode): void {
    if (moduleCode) {
      for (const key of this.cache.keys()) {
        if (key.startsWith(moduleCode)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }
}

// 单例导出
export const dataBus = new DataBus();

// ==========================================
// 数据总线API封装
// ==========================================

export async function getModuleData<T = unknown>(
  module: ModuleCode, 
  type: string
): Promise<T | null> {
  return dataBus.read<T>(module, type);
}

export async function publishModuleData(
  module: ModuleCode, 
  type: string, 
  data: unknown
): Promise<void> {
  return dataBus.publish(module, type, data);
}
