'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  ChevronLeft,
  ChevronRight,
  Award,
  BarChart3,
  Flame,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

// 生成模拟月度数据
const generateMonthData = () => {
  const data = [];
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = now.getDate();

  for (let i = 0; i < 42; i++) {
    const day = i - firstDay + 1;
    if (day > 0 && day <= daysInMonth) {
      data.push({
        day,
        isToday: day === today,
        tasks: Math.floor(Math.random() * 5),
        completed: day <= today ? Math.floor(Math.random() * 5) : 0,
        habits: day <= today ? Math.random() > 0.3 : false
      });
    } else {
      data.push(null);
    }
  }
  return data;
};

const mockMonthGoals = [
  { id: '1', title: '完成月度教学计划', progress: 72, status: 'on_track' },
  { id: '2', title: '健身20次', progress: 65, status: 'on_track' },
  { id: '3', title: '自媒体涨粉1000', progress: 85, status: 'ahead' },
  { id: '4', title: '阅读4本书', progress: 50, status: 'on_track' },
  { id: '5', title: '副业收入3000', progress: 40, status: 'behind' },
];

const mockMonthStats = {
  tasks: { total: 45, completed: 32 },
  habits: { streak: 15, bestStreak: 20 },
  points: { earned: 450, spent: 120 },
  growth: { books: 2, reviews: 8 }
};

export function MonthView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthData] = useState(generateMonthData);
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1));

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* 月度统计概览 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-muted-foreground">任务完成</span>
            </div>
            <div className="text-2xl font-bold">
              {mockMonthStats.tasks.completed}
              <span className="text-sm text-muted-foreground">/{mockMonthStats.tasks.total}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 border-orange-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-muted-foreground">连续打卡</span>
            </div>
            <div className="text-2xl font-bold">
              {mockMonthStats.habits.streak}
              <span className="text-sm text-muted-foreground">天</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 border-purple-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-muted-foreground">本月积分</span>
            </div>
            <div className="text-2xl font-bold">+{mockMonthStats.points.earned}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-muted-foreground">成长记录</span>
            </div>
            <div className="text-2xl font-bold">
              {mockMonthStats.growth.reviews}
              <span className="text-sm text-muted-foreground">次复盘</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 月历视图 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              {year}年 {monthNames[month]}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={prevMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={nextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* 星期标题 */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['日', '一', '二', '三', '四', '五', '六'].map((d) => (
              <div key={d} className="text-center text-xs text-muted-foreground py-2">
                {d}
              </div>
            ))}
          </div>
          
          {/* 日期网格 */}
          <div className="grid grid-cols-7 gap-1">
            {monthData.map((data, index) => {
              if (!data) {
                return <div key={index} className="aspect-square" />;
              }

              const completionRate = data.tasks > 0 ? (data.completed / data.tasks) * 100 : 0;
              let bgClass = '';
              if (completionRate >= 80) bgClass = 'bg-green-500 text-white';
              else if (completionRate >= 50) bgClass = 'bg-green-500/50';
              else if (completionRate > 0) bgClass = 'bg-green-500/20';

              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  className={cn(
                    "aspect-square rounded-lg flex flex-col items-center justify-center text-sm relative",
                    data.isToday && "ring-2 ring-primary",
                    bgClass
                  )}
                >
                  <span className={cn(
                    "font-medium",
                    data.isToday && "text-primary"
                  )}>
                    {data.day}
                  </span>
                  {data.habits && (
                    <div className="absolute bottom-1 w-1 h-1 rounded-full bg-orange-500" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* 图例 */}
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-500/20" />
              <span>低完成度</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-500/50" />
              <span>中完成度</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-500" />
              <span>高完成度</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-orange-500" />
              <span>已打卡</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 月度目标 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              月度目标
            </CardTitle>
            <Badge variant="secondary">5 个目标</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockMonthGoals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{goal.title}</span>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline"
                      className={cn(
                        goal.status === 'ahead' && "border-green-500 text-green-600",
                        goal.status === 'on_track' && "border-blue-500 text-blue-600",
                        goal.status === 'behind' && "border-red-500 text-red-600"
                      )}
                    >
                      {goal.status === 'ahead' ? '提前' : goal.status === 'on_track' ? '进行中' : '落后'}
                    </Badge>
                    <span className="text-sm text-muted-foreground w-10 text-right">{goal.progress}%</span>
                  </div>
                </div>
                <Progress 
                  value={goal.progress} 
                  className={cn(
                    "h-2",
                    goal.status === 'ahead' && "[&>div]:bg-green-500",
                    goal.status === 'behind' && "[&>div]:bg-red-500"
                  )}
                />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 成就里程碑 */}
      <Card className="bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-orange-500/10 border-amber-500/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            本月成就
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl mb-1">🔥</div>
              <p className="text-sm font-medium">连续打卡王</p>
              <p className="text-xs text-muted-foreground">15天连续</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-1">📚</div>
              <p className="text-sm font-medium">阅读达人</p>
              <p className="text-xs text-muted-foreground">读完2本书</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-1">💪</div>
              <p className="text-sm font-medium">健身达人</p>
              <p className="text-xs text-muted-foreground">运动15次</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
