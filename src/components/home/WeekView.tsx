'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  Heart,
  GraduationCap,
  Video,
  Users,
  Target as Growth
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

const mockWeeklyGoals = [
  { id: '1', title: '完成3篇教案', progress: 66, module: 'teaching' },
  { id: '2', title: '健身4次', progress: 75, module: 'health' },
  { id: '3', title: '发布2条内容', progress: 50, module: 'media' },
  { id: '4', title: '阅读一本书', progress: 40, module: 'growth' },
];

const mockWeeklyTasks = [
  { id: '1', title: '备课：函数与方程', day: 0, completed: true, module: 'teaching' },
  { id: '2', title: '健身：有氧30分钟', day: 1, completed: true, module: 'health' },
  { id: '3', title: '小红书选题策划', day: 1, completed: true, module: 'media' },
  { id: '4', title: '备课：三角函数', day: 2, completed: true, module: 'teaching' },
  { id: '5', title: '护肤记录', day: 2, completed: false, module: 'health' },
  { id: '6', title: '健身：力量训练', day: 3, completed: false, module: 'health' },
  { id: '7', title: '发布小红书', day: 4, completed: false, module: 'media' },
  { id: '8', title: '阅读时间', day: 5, completed: false, module: 'growth' },
  { id: '9', title: '复盘总结', day: 6, completed: false, module: 'growth' },
];

const moduleIcons: Record<string, React.ReactNode> = {
  image: <Sparkles className="w-3 h-3" />,
  health: <Heart className="w-3 h-3" />,
  teaching: <GraduationCap className="w-3 h-3" />,
  media: <Video className="w-3 h-3" />,
  emotion: <Users className="w-3 h-3" />,
  sidejob: <TrendingUp className="w-3 h-3" />,
  growth: <Growth className="w-3 h-3" />,
  tools: <Calendar className="w-3 h-3" />
};

const moduleColors: Record<string, string> = {
  image: 'bg-rose-500',
  health: 'bg-green-500',
  teaching: 'bg-blue-500',
  media: 'bg-purple-500',
  emotion: 'bg-pink-500',
  sidejob: 'bg-amber-500',
  growth: 'bg-cyan-500',
  tools: 'bg-slate-500'
};

export function WeekView() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const today = new Date().getDay();
  const adjustedToday = today === 0 ? 6 : today - 1;

  const completedTasks = mockWeeklyTasks.filter(t => t.completed).length;
  const totalTasks = mockWeeklyTasks.length;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* 周概览 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
            <p className="text-sm text-muted-foreground">已完成任务</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-amber-600">{totalTasks - completedTasks}</div>
            <p className="text-sm text-muted-foreground">待完成任务</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-purple-600">5</div>
            <p className="text-sm text-muted-foreground">连续打卡</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-cyan-600">85</div>
            <p className="text-sm text-muted-foreground">本周积分</p>
          </CardContent>
        </Card>
      </div>

      {/* 周日历视图 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">周日历</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, index) => {
              const dayTasks = mockWeeklyTasks.filter(t => t.day === index);
              const completedDayTasks = dayTasks.filter(t => t.completed).length;
              const isToday = index === adjustedToday;
              const isSelected = index === selectedDay;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(index)}
                  className={cn(
                    "flex flex-col items-center p-3 rounded-xl border-2 transition-all",
                    isToday && "border-primary bg-primary/5",
                    isSelected && !isToday && "border-primary/50",
                    !isToday && !isSelected && "border-transparent hover:border-muted"
                  )}
                >
                  <span className="text-xs text-muted-foreground mb-1">{day}</span>
                  <span className={cn(
                    "text-lg font-bold",
                    isToday && "text-primary"
                  )}>
                    {new Date(Date.now() + (index - adjustedToday) * 24 * 60 * 60 * 1000).getDate()}
                  </span>
                  {dayTasks.length > 0 && (
                    <div className="flex gap-0.5 mt-1">
                      {dayTasks.slice(0, 3).map((task, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            task.completed ? "bg-green-500" : moduleColors[task.module]
                          )} 
                        />
                      ))}
                    </div>
                  )}
                  {dayTasks.length > 0 && (
                    <span className="text-xs text-muted-foreground mt-1">
                      {completedDayTasks}/{dayTasks.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 本周目标 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              本周目标
            </CardTitle>
            <Button variant="ghost" size="sm">
              编辑目标
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockWeeklyGoals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-white",
                      moduleColors[goal.module]
                    )}>
                      {moduleIcons[goal.module]}
                    </div>
                    <span className="font-medium">{goal.title}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 选中日期的任务列表 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            {weekDays[selectedDay]}任务
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mockWeeklyTasks
              .filter(t => t.day === selectedDay)
              .map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border",
                    task.completed ? "bg-muted/50 border-transparent" : "border-border"
                  )}
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground" />
                  )}
                  <div className={cn(
                    "flex-1",
                    task.completed && "line-through text-muted-foreground"
                  )}>
                    {task.title}
                  </div>
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    moduleColors[task.module]
                  )} />
                </div>
              ))}
            {mockWeeklyTasks.filter(t => t.day === selectedDay).length === 0 && (
              <p className="text-center text-muted-foreground py-4">暂无任务</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 快速操作 */}
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="h-auto py-4 flex-col gap-2">
          <Calendar className="w-5 h-5" />
          <span>查看完整日程</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
        <Button variant="outline" className="h-auto py-4 flex-col gap-2">
          <TrendingUp className="w-5 h-5" />
          <span>周报总结</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
