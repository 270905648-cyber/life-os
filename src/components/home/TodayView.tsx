'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Heart, 
  GraduationCap, 
  Video, 
  Users, 
  TrendingUp, 
  Target, 
  Wrench,
  Plus,
  Flame,
  Sun,
  Moon,
  Coffee,
  Dumbbell,
  BookOpen,
  PenLine
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Task, Habit, ModuleCode } from '@/types';

const moduleIcons: Record<ModuleCode, React.ReactNode> = {
  image: <Sparkles className="w-4 h-4" />,
  health: <Heart className="w-4 h-4" />,
  teaching: <GraduationCap className="w-4 h-4" />,
  media: <Video className="w-4 h-4" />,
  emotion: <Users className="w-4 h-4" />,
  sidejob: <TrendingUp className="w-4 h-4" />,
  growth: <Target className="w-4 h-4" />,
  tools: <Wrench className="w-4 h-4" />
};

const moduleColors: Record<ModuleCode, string> = {
  image: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  health: 'bg-green-500/10 text-green-600 border-green-500/20',
  teaching: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  media: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  emotion: 'bg-pink-500/10 text-pink-600 border-pink-500/20',
  sidejob: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  growth: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
  tools: 'bg-slate-500/10 text-slate-600 border-slate-500/20'
};

// 模拟数据
const mockTasks: Task[] = [
  { id: '1', title: '完成教案设计', module: 'teaching', status: 'pending', priority: 'high', points: 20, period: 'today', createdAt: new Date(), updatedAt: new Date() },
  { id: '2', title: '发布小红书笔记', module: 'media', status: 'in_progress', priority: 'medium', points: 15, period: 'today', createdAt: new Date(), updatedAt: new Date() },
  { id: '3', title: '健身打卡', module: 'health', status: 'completed', priority: 'medium', points: 10, period: 'today', createdAt: new Date(), updatedAt: new Date(), completedAt: new Date() },
  { id: '4', title: '阅读30分钟', module: 'growth', status: 'pending', priority: 'low', points: 5, period: 'today', createdAt: new Date(), updatedAt: new Date() },
  { id: '5', title: '整理衣橱', module: 'image', status: 'pending', priority: 'low', points: 10, period: 'today', createdAt: new Date(), updatedAt: new Date() },
];

const mockHabits: Habit[] = [
  { id: '1', name: '早起', icon: 'Sun', color: 'amber', streak: 15, bestStreak: 20, totalDays: 45, points: 10, frequency: 'daily', status: 'active', todayCompleted: true },
  { id: '2', name: '冥想', icon: 'Coffee', color: 'purple', streak: 7, bestStreak: 10, totalDays: 30, points: 10, frequency: 'daily', status: 'active', todayCompleted: false },
  { id: '3', name: '运动', icon: 'Dumbbell', color: 'green', streak: 5, bestStreak: 12, totalDays: 25, points: 15, frequency: 'daily', status: 'active', todayCompleted: true },
  { id: '4', name: '阅读', icon: 'BookOpen', color: 'blue', streak: 3, bestStreak: 8, totalDays: 20, points: 10, frequency: 'daily', status: 'active', todayCompleted: false },
  { id: '5', name: '日记', icon: 'PenLine', color: 'rose', streak: 10, bestStreak: 15, totalDays: 35, points: 5, frequency: 'daily', status: 'active', todayCompleted: false },
];

const habitIcons: Record<string, React.ReactNode> = {
  Sun: <Sun className="w-4 h-4" />,
  Coffee: <Coffee className="w-4 h-4" />,
  Dumbbell: <Dumbbell className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-4 h-4" />,
  PenLine: <PenLine className="w-4 h-4" />,
  Moon: <Moon className="w-4 h-4" />
};

const habitColors: Record<string, string> = {
  amber: 'bg-amber-500 text-white',
  purple: 'bg-purple-500 text-white',
  green: 'bg-green-500 text-white',
  blue: 'bg-blue-500 text-white',
  rose: 'bg-rose-500 text-white'
};

export function TodayView() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [habits, setHabits] = useState<Habit[]>(mockHabits);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { 
            ...task, 
            status: task.status === 'completed' ? 'pending' : 'completed',
            completedAt: task.status === 'completed' ? undefined : new Date()
          } 
        : task
    ));
  };

  const toggleHabit = (id: string) => {
    setHabits(habits.map(habit =>
      habit.id === id
        ? { ...habit, todayCompleted: !habit.todayCompleted }
        : habit
    ));
  };

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const taskProgress = (completedTasks / totalTasks) * 100;

  const completedHabits = habits.filter(h => h.todayCompleted).length;
  const totalHabits = habits.length;
  const habitProgress = (completedHabits / totalHabits) * 100;

  const greeting = currentTime.getHours() < 12 ? '早上好' : currentTime.getHours() < 18 ? '下午好' : '晚上好';

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* 问候语与日期 */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{greeting}，主人 ✨</h1>
        <p className="text-muted-foreground">
          {currentTime.toLocaleDateString('zh-CN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
          })}
        </p>
      </div>

      {/* 进度概览 */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">今日任务</span>
              <Badge variant="secondary">{completedTasks}/{totalTasks}</Badge>
            </div>
            <Progress value={taskProgress} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">习惯打卡</span>
              <Badge variant="secondary">{completedHabits}/{totalHabits}</Badge>
            </div>
            <Progress value={habitProgress} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* 快速打卡 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            习惯打卡
          </CardTitle>
          <CardDescription>点击完成今日习惯</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {habits.map((habit) => (
              <motion.button
                key={habit.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => toggleHabit(habit.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-full border-2 transition-all",
                  habit.todayCompleted
                    ? `${habitColors[habit.color || 'amber']} border-transparent`
                    : "border-dashed border-muted-foreground/30 hover:border-primary/50"
                )}
              >
                {habitIcons[habit.icon || 'Sun']}
                <span className="text-sm font-medium">{habit.name}</span>
                {habit.streak > 0 && (
                  <Badge variant="outline" className="text-xs">
                    🔥 {habit.streak}
                  </Badge>
                )}
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 今日待办 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">今日待办</CardTitle>
            <Button variant="ghost" size="sm" className="gap-1">
              <Plus className="w-4 h-4" />
              添加
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {tasks
              .sort((a, b) => {
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
              })
              .map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border transition-all",
                    task.status === 'completed' 
                      ? "bg-muted/50 border-transparent" 
                      : "bg-background border-border hover:border-primary/50"
                  )}
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="flex-shrink-0"
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-medium truncate",
                      task.status === 'completed' && "line-through text-muted-foreground"
                    )}>
                      {task.title}
                    </p>
                  </div>

                  {task.module && (
                    <Badge className={cn("flex-shrink-0", moduleColors[task.module])}>
                      {moduleIcons[task.module]}
                      <span className="ml-1 text-xs">+{task.points}</span>
                    </Badge>
                  )}

                  <Badge 
                    variant="outline"
                    className={cn(
                      "flex-shrink-0",
                      task.priority === 'high' && "border-red-500/50 text-red-600",
                      task.priority === 'medium' && "border-amber-500/50 text-amber-600",
                      task.priority === 'low' && "border-slate-500/50 text-slate-600"
                    )}
                  >
                    {task.priority === 'high' ? '紧急' : task.priority === 'medium' ? '中等' : '一般'}
                  </Badge>
                </motion.div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* 智能卡片推荐 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-rose-500/10 to-orange-500/10 border-rose-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-500" />
              今日穿搭建议
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              根据今日天气和您的日程，推荐休闲商务风格穿搭...
            </p>
            <Button variant="link" className="px-0 text-rose-600">查看详情 →</Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="w-5 h-5 text-green-500" />
              健康提醒
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              今天是湿热体质调理的第5天，记得喝养生茶...
            </p>
            <Button variant="link" className="px-0 text-green-600">查看方案 →</Button>
          </CardContent>
        </Card>
      </div>

      {/* 快速复盘入口 */}
      <Card className="bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border-purple-500/20">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <PenLine className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">今日复盘</p>
                <p className="text-sm text-muted-foreground">记录今日收获与感悟</p>
              </div>
            </div>
            <Button>开始复盘</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
