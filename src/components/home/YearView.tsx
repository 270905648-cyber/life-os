'use client';

import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  Calendar,
  Award,
  BarChart3,
  Sparkles,
  ChevronRight,
  Flag,
  Rocket,
  Star
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

const mockQuarterGoals = [
  { id: '1', title: '完成50篇教案', progress: 75, status: 'on_track' },
  { id: '2', title: '自媒体粉丝破5000', progress: 68, status: 'on_track' },
  { id: '3', title: '副业收入突破1万', progress: 45, status: 'behind' },
  { id: '4', title: '阅读12本书', progress: 58, status: 'on_track' },
];

const mockYearStats = {
  totalTasks: 520,
  completedTasks: 420,
  totalPoints: 5200,
  currentLevel: 12,
  badges: 18,
  streak: 15
};

// 各月完成度数据
const monthlyData = [
  { month: '1月', tasks: 85, habits: 90 },
  { month: '2月', tasks: 78, habits: 85 },
  { month: '3月', tasks: 92, habits: 88 },
  { month: '4月', tasks: 88, habits: 95 },
  { month: '5月', tasks: 82, habits: 80 },
  { month: '6月', tasks: 75, habits: 85 },
];

export function QuarterView() {
  const currentQuarter = Math.floor(new Date().getMonth() / 3);

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* 季度选择器 */}
      <div className="flex items-center gap-2">
        {quarters.map((q, index) => (
          <Button
            key={q}
            variant={index === currentQuarter ? 'default' : 'outline'}
            className="flex-1"
          >
            {q}
            {index === currentQuarter && (
              <Badge variant="secondary" className="ml-2">当前</Badge>
            )}
          </Button>
        ))}
      </div>

      {/* 季度概览 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">81%</div>
            <p className="text-sm text-muted-foreground">季度目标进度</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-600">156</div>
            <p className="text-sm text-muted-foreground">完成任务数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-purple-600">1,280</div>
            <p className="text-sm text-muted-foreground">获得积分</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-amber-600">6</div>
            <p className="text-sm text-muted-foreground">获得勋章</p>
          </CardContent>
        </Card>
      </div>

      {/* 季度目标 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Flag className="w-5 h-5 text-primary" />
              Q{currentQuarter + 1} 季度目标
            </CardTitle>
            <Button variant="ghost" size="sm">编辑</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockQuarterGoals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{goal.title}</span>
                  <Badge 
                    variant="outline"
                    className={cn(
                      goal.status === 'on_track' && "border-green-500 text-green-600",
                      goal.status === 'behind' && "border-red-500 text-red-600"
                    )}
                  >
                    {goal.progress}%
                  </Badge>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 季度里程碑 */}
      <Card className="bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Rocket className="w-5 h-5 text-purple-600" />
            季度里程碑
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-purple-200 dark:bg-purple-800" />
            <div className="space-y-4">
              {[
                { date: '4月1日', title: '季度开始', completed: true },
                { date: '4月15日', title: '完成第一阶段目标', completed: true },
                { date: '5月1日', title: '自媒体粉丝破3000', completed: true },
                { date: '5月15日', title: '副业收入达5000', completed: false, current: true },
                { date: '6月30日', title: '季度目标验收', completed: false },
              ].map((item, index) => (
                <div key={index} className="relative flex items-start gap-4 pl-8">
                  <div className={cn(
                    "absolute left-2.5 w-3 h-3 rounded-full border-2",
                    item.completed ? "bg-green-500 border-green-500" :
                    item.current ? "bg-purple-500 border-purple-500 animate-pulse" :
                    "bg-background border-purple-300"
                  )} />
                  <div className={cn(
                    "flex-1 pb-4",
                    !item.completed && !item.current && "opacity-50"
                  )}>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                    <p className="font-medium">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function YearView() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* 年度概览 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-violet-600" />
              <span className="text-sm text-muted-foreground">年度积分</span>
            </div>
            <div className="text-2xl font-bold">{mockYearStats.totalPoints.toLocaleString()}</div>
            <Progress value={mockYearStats.totalPoints / 100} className="h-1 mt-2" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-amber-600" />
              <span className="text-sm text-muted-foreground">当前等级</span>
            </div>
            <div className="text-2xl font-bold">Lv.{mockYearStats.currentLevel}</div>
            <Progress value={mockYearStats.currentLevel / 50 * 100} className="h-1 mt-2" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-green-600" />
              <span className="text-sm text-muted-foreground">任务完成率</span>
            </div>
            <div className="text-2xl font-bold">
              {Math.round(mockYearStats.completedTasks / mockYearStats.totalTasks * 100)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {mockYearStats.completedTasks}/{mockYearStats.totalTasks} 任务
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 年度趋势图 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            年度趋势
          </CardTitle>
          <CardDescription>各月完成度统计</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="w-10 text-sm text-muted-foreground">{data.month}</span>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-12">任务</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${data.tasks}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="h-full bg-blue-500 rounded-full"
                      />
                    </div>
                    <span className="text-xs w-8">{data.tasks}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-12">习惯</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${data.habits}%` }}
                        transition={{ delay: index * 0.1 + 0.05, duration: 0.5 }}
                        className="h-full bg-green-500 rounded-full"
                      />
                    </div>
                    <span className="text-xs w-8">{data.habits}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 年度成就墙 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              年度成就
            </CardTitle>
            <Badge variant="secondary">{mockYearStats.badges} 枚勋章</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
            {[
              { emoji: '🏆', name: '年度冠军' },
              { emoji: '🔥', name: '连续王者' },
              { emoji: '📚', name: '阅读大师' },
              { emoji: '💪', name: '健身达人' },
              { emoji: '✍️', name: '内容创作者' },
              { emoji: '💰', name: '理财高手' },
              { emoji: '🎯', name: '目标达成者' },
              { emoji: '⭐', name: '五星好评' },
              { emoji: '🌟', name: '闪耀之星' },
              { emoji: '🚀', name: '速度先锋' },
              { emoji: '💎', name: '钻石品质' },
              { emoji: '👑', name: '自律之王' },
            ].map((badge, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col items-center p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <span className="text-2xl mb-1">{badge.emoji}</span>
                <span className="text-xs text-center">{badge.name}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 五年计划预览 */}
      <Card className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-violet-500/10 border-cyan-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-600" />
              五年计划进度
            </CardTitle>
            <Button variant="ghost" size="sm">
              查看详情
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {[2024, 2025, 2026, 2027, 2028].map((year, index) => (
              <div
                key={year}
                className={cn(
                  "p-3 rounded-lg text-center",
                  index === 1 ? "bg-primary/20 border-2 border-primary" : "bg-muted/50"
                )}
              >
                <p className="text-lg font-bold">{year}</p>
                <p className="text-xs text-muted-foreground">
                  {index < 1 ? '已完成' : index === 1 ? '进行中' : '待开始'}
                </p>
                {index < 1 && (
                  <Progress value={100} className="h-1 mt-2" />
                )}
                {index === 1 && (
                  <Progress value={42} className="h-1 mt-2" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
