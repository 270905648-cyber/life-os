'use client';

import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Sparkles,
  Heart,
  GraduationCap,
  Video,
  Users,
  Wrench,
  Award,
  Calendar,
  Flame,
  Trophy
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ModuleCode } from '@/types';

const moduleData = [
  { code: 'image' as ModuleCode, name: '形象管理', icon: Sparkles, score: 75, color: 'rose' },
  { code: 'health' as ModuleCode, name: '健康养生', icon: Heart, score: 82, color: 'green' },
  { code: 'teaching' as ModuleCode, name: '数学教学', icon: GraduationCap, score: 90, color: 'blue' },
  { code: 'media' as ModuleCode, name: '自媒体IP', icon: Video, score: 68, color: 'purple' },
  { code: 'emotion' as ModuleCode, name: '情感人际', icon: Users, score: 60, color: 'pink' },
  { code: 'sidejob' as ModuleCode, name: '副业增收', icon: TrendingUp, score: 55, color: 'amber' },
  { code: 'growth' as ModuleCode, name: '自我成长', icon: Target, score: 78, color: 'cyan' },
  { code: 'tools' as ModuleCode, name: '生活工具', icon: Wrench, score: 70, color: 'slate' },
];

const colorMap: Record<string, string> = {
  rose: 'from-rose-500 to-pink-500',
  green: 'from-green-500 to-emerald-500',
  blue: 'from-blue-500 to-cyan-500',
  purple: 'from-purple-500 to-violet-500',
  pink: 'from-pink-500 to-rose-500',
  amber: 'from-amber-500 to-orange-500',
  cyan: 'from-cyan-500 to-teal-500',
  slate: 'from-slate-500 to-gray-500',
};

// 生成模拟热力图数据
const generateHeatmap = () => {
  const data = [];
  for (let week = 0; week < 20; week++) {
    for (let day = 0; day < 7; day++) {
      const count = Math.floor(Math.random() * 10);
      data.push({
        level: count === 0 ? 0 : count < 3 ? 1 : count < 5 ? 2 : count < 7 ? 3 : 4
      });
    }
  }
  return data;
};

export function Dashboard() {
  const heatmapData = generateHeatmap();

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold">数据仪表盘</h1>
        <p className="text-muted-foreground">全方位了解你的成长轨迹</p>
      </div>

      {/* 八维雷达图概览 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            八维成长雷达
          </CardTitle>
          <CardDescription>各模块活跃度评分</CardDescription>
        </CardHeader>
        <CardContent>
          {/* 简化的柱状图展示 */}
          <div className="space-y-3">
            {moduleData.map((module, index) => {
              const Icon = module.icon;
              return (
                <motion.div
                  key={module.code}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br",
                    colorMap[module.color]
                  )}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{module.name}</span>
                      <span className="text-sm text-muted-foreground">{module.score}分</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${module.score}%` }}
                        transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                        className={cn(
                          "h-full rounded-full bg-gradient-to-r",
                          colorMap[module.color]
                        )}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 核心指标卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/20">
          <CardContent className="pt-4">
            <Trophy className="w-5 h-5 text-violet-600 mb-2" />
            <div className="text-2xl font-bold">Lv.12</div>
            <p className="text-xs text-muted-foreground">当前等级</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
          <CardContent className="pt-4">
            <Flame className="w-5 h-5 text-amber-600 mb-2" />
            <div className="text-2xl font-bold">15天</div>
            <p className="text-xs text-muted-foreground">连续打卡</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardContent className="pt-4">
            <Target className="w-5 h-5 text-green-600 mb-2" />
            <div className="text-2xl font-bold">81%</div>
            <p className="text-xs text-muted-foreground">目标达成率</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <CardContent className="pt-4">
            <Award className="w-5 h-5 text-blue-600 mb-2" />
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">获得勋章</p>
          </CardContent>
        </Card>
      </div>

      {/* 活动热力图 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            活动热力图
          </CardTitle>
          <CardDescription>过去20周的活动记录</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="flex gap-0.5 min-w-[600px]">
              {/* 星期标签 */}
              <div className="flex flex-col gap-0.5 mr-2">
                {['', '一', '', '三', '', '五', ''].map((day, i) => (
                  <div key={i} className="h-3 text-xs text-muted-foreground flex items-center">
                    {day}
                  </div>
                ))}
              </div>
              {/* 热力图格子 */}
              {Array.from({ length: 20 }).map((_, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-0.5">
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const dataIndex = weekIndex * 7 + dayIndex;
                    const level = heatmapData[dataIndex]?.level || 0;
                    const bgClass = [
                      'bg-muted',
                      'bg-green-200 dark:bg-green-900',
                      'bg-green-400 dark:bg-green-700',
                      'bg-green-500 dark:bg-green-600',
                      'bg-green-600 dark:bg-green-500'
                    ][level];
                    return (
                      <div
                        key={dayIndex}
                        className={cn("w-3 h-3 rounded-sm", bgClass)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          {/* 图例 */}
          <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
            <span>少</span>
            <div className="flex gap-0.5">
              {['bg-muted', 'bg-green-200 dark:bg-green-900', 'bg-green-400 dark:bg-green-700', 'bg-green-500 dark:bg-green-600', 'bg-green-600 dark:bg-green-500'].map((bg, i) => (
                <div key={i} className={cn("w-3 h-3 rounded-sm", bg)} />
              ))}
            </div>
            <span>多</span>
          </div>
        </CardContent>
      </Card>

      {/* 成长趋势 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            成长趋势
          </CardTitle>
          <CardDescription>近6个月数据对比</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: '任务完成', data: [45, 52, 48, 60, 55, 68] },
              { label: '习惯打卡', data: [80, 85, 78, 90, 88, 92] },
              { label: '积分获取', data: [120, 180, 150, 220, 200, 280] },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{item.label}</span>
                  <Badge variant="outline" className="text-xs">
                    {item.data[item.data.length - 1]}
                  </Badge>
                </div>
                <div className="flex items-end gap-1 h-12">
                  {item.data.map((value, i) => {
                    const max = Math.max(...item.data);
                    const height = (value / max) * 100;
                    return (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: i * 0.05 }}
                        className="flex-1 bg-primary/80 rounded-t"
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  {['1月', '2月', '3月', '4月', '5月', '6月'].map((month) => (
                    <span key={month}>{month}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 勋章展示 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              勋章墙
            </CardTitle>
            <Badge variant="secondary">18/50 枚</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
            {[
              { emoji: '🏆', name: '年度冠军', rarity: 'legendary' },
              { emoji: '🔥', name: '连续王者', rarity: 'epic' },
              { emoji: '📚', name: '阅读大师', rarity: 'rare' },
              { emoji: '💪', name: '健身达人', rarity: 'rare' },
              { emoji: '✍️', name: '内容创作者', rarity: 'common' },
              { emoji: '💰', name: '理财高手', rarity: 'rare' },
              { emoji: '🎯', name: '目标达成者', rarity: 'epic' },
              { emoji: '⭐', name: '五星好评', rarity: 'common' },
              { emoji: '🌟', name: '闪耀之星', rarity: 'rare' },
              { emoji: '🚀', name: '速度先锋', rarity: 'common' },
              { emoji: '💎', name: '钻石品质', rarity: 'epic' },
              { emoji: '👑', name: '自律之王', rarity: 'legendary' },
            ].map((badge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                className={cn(
                  "flex flex-col items-center p-3 rounded-xl border transition-all hover:scale-105",
                  badge.rarity === 'legendary' && "bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border-amber-500/30",
                  badge.rarity === 'epic' && "bg-gradient-to-br from-purple-500/20 to-violet-500/20 border-purple-500/30",
                  badge.rarity === 'rare' && "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30",
                  badge.rarity === 'common' && "bg-muted/50 border-border"
                )}
              >
                <span className="text-2xl">{badge.emoji}</span>
                <span className="text-xs mt-1 text-center">{badge.name}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
