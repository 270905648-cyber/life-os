'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { TimeAxisNav } from '@/components/home/TimeAxisNav';
import { TodayView } from '@/components/home/TodayView';
import { WeekView } from '@/components/home/WeekView';
import { MonthView } from '@/components/home/MonthView';
import { QuarterView, YearView } from '@/components/home/YearView';
import { Dashboard } from '@/components/home/Dashboard';
import { AiAssistant } from '@/components/common/AiAssistant';
// 模块导入
import { ImageModule } from '@/components/modules/image/ImageModule';
import { HealthModule } from '@/components/modules/health/HealthModule';
import { TeachingModule } from '@/components/modules/teaching/TeachingModule';
import { MediaModule } from '@/components/modules/media/MediaModule';
import { EmotionModule } from '@/components/modules/emotion/EmotionModule';
import { SidejobModule } from '@/components/modules/sidejob/SidejobModule';
import { GrowthModule } from '@/components/modules/growth/GrowthModule';
import { ToolsModule } from '@/components/modules/tools/ToolsModule';
import { useTimePeriodStore, useUserStore } from '@/stores/app-store';
import type { ModuleCode } from '@/types';

// 时间轴视图切换
function TimeAxisView() {
  const { currentPeriod } = useTimePeriodStore();

  const renderView = () => {
    switch (currentPeriod) {
      case 'today':
        return <TodayView />;
      case 'week':
        return <WeekView />;
      case 'month':
        return <MonthView />;
      case 'quarter':
        return <QuarterView />;
      case 'year':
        return <YearView />;
      default:
        return <TodayView />;
    }
  };

  return (
    <div className="space-y-4">
      {/* 时间维度导航 */}
      <div className="flex justify-center px-4 pt-4">
        <TimeAxisNav />
      </div>
      
      {/* 视图内容 */}
      {renderView()}
    </div>
  );
}

export default function Home() {
  const [activeView, setActiveView] = useState<'home' | 'dashboard' | ModuleCode>('home');
  const { setUser } = useUserStore();

  // 初始化用户数据
  useEffect(() => {
    // 模拟用户数据
    setUser({
      id: 'user-1',
      name: '主人',
      totalPoints: 5200,
      currentLevel: 12,
      streak: 15,
      todayTasks: 5,
      completedTasks: 2,
      todayHabits: 5,
      completedHabits: 3
    });
  }, [setUser]);

  // 渲染主要内容
  const renderContent = () => {
    if (activeView === 'home') {
      return <TimeAxisView />;
    }
    if (activeView === 'dashboard') {
      return <Dashboard />;
    }
    
    // 八大模块路由
    switch (activeView) {
      case 'image':
        return <ImageModule />;
      case 'health':
        return <HealthModule />;
      case 'teaching':
        return <TeachingModule />;
      case 'media':
        return <MediaModule />;
      case 'emotion':
        return <EmotionModule />;
      case 'sidejob':
        return <SidejobModule />;
      case 'growth':
        return <GrowthModule />;
      case 'tools':
        return <ToolsModule />;
      default:
        return null;
    }
  };

  return (
    <MainLayout activeView={activeView} onViewChange={setActiveView}>
      {renderContent()}
      <AiAssistant />
    </MainLayout>
  );
}
