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
import { useTimePeriodStore } from '@/stores/app-store';
import { initDefaultData } from '@/lib/local-db';
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
  const [isReady, setIsReady] = useState(false);

  // 初始化本地数据库
  useEffect(() => {
    initDefaultData().then(() => {
      setIsReady(true);
    });
  }, []);

  // 渲染主要内容
  const renderContent = () => {
    if (!isReady) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">加载中...</p>
          </div>
        </div>
      );
    }

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
