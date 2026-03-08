'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Flame, 
  Calendar,
  BookOpen,
  PenLine,
  TrendingUp,
  ChevronRight,
  Sparkles,
  Edit2,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

// 习惯数据类型
interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  streak: number;
  bestStreak: number;
  totalDays: number;
  points: number;
  todayCompleted: boolean;
}

// 五年计划数据类型
interface FiveYearGoal {
  year: number;
  goals: { category: string; content: string; progress: number }[];
}

// 认知复盘数据类型
interface CognitiveReview {
  id: string;
  title: string;
  content: string;
  type: string;
  createdAt: Date;
}

// 模拟数据
const mockHabits: Habit[] = [
  { id: '1', name: '早起', icon: 'Sun', color: 'amber', streak: 15, bestStreak: 20, totalDays: 45, points: 10, todayCompleted: true },
  { id: '2', name: '冥想', icon: 'Coffee', color: 'purple', streak: 7, bestStreak: 10, totalDays: 30, points: 10, todayCompleted: false },
  { id: '3', name: '运动', icon: 'Dumbbell', color: 'green', streak: 5, bestStreak: 12, totalDays: 25, points: 15, todayCompleted: true },
  { id: '4', name: '阅读', icon: 'BookOpen', color: 'blue', streak: 3, bestStreak: 8, totalDays: 20, points: 10, todayCompleted: false },
  { id: '5', name: '日记', icon: 'PenLine', color: 'rose', streak: 10, bestStreak: 15, totalDays: 35, points: 5, todayCompleted: false },
];

const mockFiveYearPlan: FiveYearGoal[] = [
  {
    year: 2024,
    goals: [
      { category: '事业', content: '副业收入达到10万', progress: 60 },
      { category: '学习', content: '掌握AI开发技能', progress: 75 },
      { category: '健康', content: '体重降到健康范围', progress: 40 },
    ]
  },
  {
    year: 2025,
    goals: [
      { category: '事业', content: '自媒体粉丝破10万', progress: 0 },
      { category: '财务', content: '存款达到目标', progress: 0 },
      { category: '成长', content: '完成MBA课程', progress: 0 },
    ]
  },
  {
    year: 2026,
    goals: [
      { category: '事业', content: '创业起步', progress: 0 },
      { category: '生活', content: '买房首付', progress: 0 },
    ]
  },
  {
    year: 2027,
    goals: [
      { category: '事业', content: '公司稳定运营', progress: 0 },
    ]
  },
  {
    year: 2028,
    goals: [
      { category: '人生', content: '实现财务自由', progress: 0 },
    ]
  },
];

const mockReviews: CognitiveReview[] = [
  { id: '1', title: '关于自律的思考', content: '自律不是约束，而是自由。只有自律才能让我们掌控自己的人生...', type: 'insight', createdAt: new Date(Date.now() - 86400000 * 2) },
  { id: '2', title: '今日复盘', content: '今天完成了很多任务，但感觉效率还可以提高...', type: 'reflection', createdAt: new Date(Date.now() - 86400000) },
  { id: '3', title: '学习方法总结', content: '费曼学习法真的很有效，通过教别人来学习...', type: 'learning', createdAt: new Date() },
];

const iconOptions = ['Sun', 'Moon', 'Coffee', 'BookOpen', 'PenLine', 'Dumbbell', 'Heart', 'Star'];
const colorOptions = ['amber', 'purple', 'green', 'blue', 'rose', 'cyan', 'orange', 'pink'];

const iconComponents: Record<string, React.ReactNode> = {
  Sun: <Sparkles className="w-4 h-4" />,
  Moon: <Sparkles className="w-4 h-4" />,
  Coffee: <Sparkles className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-4 h-4" />,
  PenLine: <PenLine className="w-4 h-4" />,
  Dumbbell: <TrendingUp className="w-4 h-4" />,
  Heart: <Target className="w-4 h-4" />,
  Star: <Sparkles className="w-4 h-4" />,
};

const colorClasses: Record<string, string> = {
  amber: 'bg-amber-500 text-white',
  purple: 'bg-purple-500 text-white',
  green: 'bg-green-500 text-white',
  blue: 'bg-blue-500 text-white',
  rose: 'bg-rose-500 text-white',
  cyan: 'bg-cyan-500 text-white',
  orange: 'bg-orange-500 text-white',
  pink: 'bg-pink-500 text-white',
};

export function GrowthModule() {
  const [habits, setHabits] = useState<Habit[]>(mockHabits);
  const [fiveYearPlan, setFiveYearPlan] = useState<FiveYearGoal[]>(mockFiveYearPlan);
  const [reviews, setReviews] = useState<CognitiveReview[]>(mockReviews);
  const [activeTab, setActiveTab] = useState('habits');
  const [isAddHabitOpen, setIsAddHabitOpen] = useState(false);
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: '', icon: 'Sun', color: 'amber' });
  const [newReview, setNewReview] = useState({ title: '', content: '', type: 'reflection' });

  const toggleHabit = (id: string) => {
    setHabits(habits.map(habit =>
      habit.id === id
        ? { ...habit, todayCompleted: !habit.todayCompleted, streak: habit.todayCompleted ? habit.streak - 1 : habit.streak + 1 }
        : habit
    ));
  };

  const addHabit = () => {
    if (!newHabit.name.trim()) return;
    const habit: Habit = {
      id: Date.now().toString(),
      ...newHabit,
      streak: 0,
      bestStreak: 0,
      totalDays: 0,
      points: 10,
      todayCompleted: false
    };
    setHabits([...habits, habit]);
    setNewHabit({ name: '', icon: 'Sun', color: 'amber' });
    setIsAddHabitOpen(false);
  };

  const addReview = () => {
    if (!newReview.title.trim() || !newReview.content.trim()) return;
    const review: CognitiveReview = {
      id: Date.now().toString(),
      ...newReview,
      createdAt: new Date()
    };
    setReviews([review, ...reviews]);
    setNewReview({ title: '', content: '', type: 'reflection' });
    setIsAddReviewOpen(false);
  };

  const completedHabits = habits.filter(h => h.todayCompleted).length;
  const habitProgress = (completedHabits / habits.length) * 100;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* 模块头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-7 h-7 text-cyan-500" />
            自我成长
          </h1>
          <p className="text-muted-foreground">五年计划、习惯打卡、认知复盘</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-lg px-3">
            <Flame className="w-4 h-4 mr-1 text-orange-500" />
            最长连续 20 天
          </Badge>
        </div>
      </div>

      {/* 核心数据卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{completedHabits}/{habits.length}</div>
            <p className="text-sm text-muted-foreground">今日习惯</p>
            <Progress value={habitProgress} className="h-1 mt-2" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{Math.max(...habits.map(h => h.streak))}</div>
            <p className="text-sm text-muted-foreground">当前连续</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{fiveYearPlan[0]?.goals.length || 0}</div>
            <p className="text-sm text-muted-foreground">年度目标</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{reviews.length}</div>
            <p className="text-sm text-muted-foreground">认知复盘</p>
          </CardContent>
        </Card>
      </div>

      {/* 主要内容标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="habits">习惯打卡</TabsTrigger>
          <TabsTrigger value="five-year">五年计划</TabsTrigger>
          <TabsTrigger value="review">认知复盘</TabsTrigger>
        </TabsList>

        {/* 习惯打卡 */}
        <TabsContent value="habits" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">我的习惯</h3>
            <Dialog open={isAddHabitOpen} onOpenChange={setIsAddHabitOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <Plus className="w-4 h-4" />
                  添加习惯
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加新习惯</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>习惯名称</Label>
                    <Input
                      value={newHabit.name}
                      onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                      placeholder="例如：早起、阅读、运动"
                    />
                  </div>
                  <div>
                    <Label>图标</Label>
                    <div className="flex flex-wrap gap-2">
                      {iconOptions.map(icon => (
                        <button
                          key={icon}
                          onClick={() => setNewHabit({ ...newHabit, icon })}
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center border-2",
                            newHabit.icon === icon ? "border-primary" : "border-transparent"
                          )}
                        >
                          {iconComponents[icon]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>颜色</Label>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map(color => (
                        <button
                          key={color}
                          onClick={() => setNewHabit({ ...newHabit, color })}
                          className={cn(
                            "w-8 h-8 rounded-full",
                            colorClasses[color],
                            newHabit.color === color && "ring-2 ring-offset-2 ring-primary"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <Button onClick={addHabit} className="w-full">添加习惯</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {habits.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  habit.todayCompleted && "bg-muted/50"
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleHabit(habit.id)}
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all",
                          habit.todayCompleted ? colorClasses[habit.color] : "bg-muted border-2 border-dashed"
                        )}
                      >
                        {habit.todayCompleted ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : (
                          <Circle className="w-6 h-6 text-muted-foreground" />
                        )}
                      </button>
                      <div className="flex-1">
                        <h4 className="font-medium">{habit.name}</h4>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Flame className="w-3 h-3 text-orange-500" />
                            {habit.streak}天连续
                          </span>
                          <span>最佳{habit.bestStreak}天</span>
                          <span className="text-green-600">+{habit.points}分</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* 五年计划 */}
        <TabsContent value="five-year" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">五年规划</h3>
            <Button variant="outline" size="sm">
              <Edit2 className="w-4 h-4 mr-1" />
              编辑计划
            </Button>
          </div>

          <div className="space-y-4">
            {fiveYearPlan.map((yearPlan, yearIndex) => (
              <Card key={yearPlan.year} className={cn(
                yearIndex === 1 && "ring-2 ring-primary"
              )}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{yearPlan.year}年</CardTitle>
                    {yearIndex === 1 && <Badge>当前年度</Badge>}
                    {yearIndex < 1 && <Badge variant="secondary">已完成</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {yearPlan.goals.map((goal, goalIndex) => (
                      <div key={goalIndex} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{goal.category}</Badge>
                            <span className="text-sm">{goal.content}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 认知复盘 */}
        <TabsContent value="review" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">我的复盘</h3>
            <Dialog open={isAddReviewOpen} onOpenChange={setIsAddReviewOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <Plus className="w-4 h-4" />
                  写复盘
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>写复盘</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>标题</Label>
                    <Input
                      value={newReview.title}
                      onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                      placeholder="给这次复盘起个标题"
                    />
                  </div>
                  <div>
                    <Label>类型</Label>
                    <div className="flex gap-2">
                      {[
                        { value: 'insight', label: '洞察' },
                        { value: 'reflection', label: '反思' },
                        { value: 'learning', label: '学习' },
                        { value: 'mistake', label: '失误' },
                      ].map(type => (
                        <Button
                          key={type.value}
                          variant={newReview.type === type.value ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setNewReview({ ...newReview, type: type.value })}
                        >
                          {type.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>内容</Label>
                    <Textarea
                      value={newReview.content}
                      onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                      placeholder="记录你的思考、感悟或经验..."
                      rows={5}
                    />
                  </div>
                  <Button onClick={addReview} className="w-full">保存复盘</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{review.title}</CardTitle>
                        <CardDescription>
                          {review.createdAt.toLocaleDateString('zh-CN')}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">
                        {review.type === 'insight' && '洞察'}
                        {review.type === 'reflection' && '反思'}
                        {review.type === 'learning' && '学习'}
                        {review.type === 'mistake' && '失误'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {review.content}
                    </p>
                    <div className="flex justify-end gap-2 mt-3">
                      <Button variant="ghost" size="sm">
                        <Edit2 className="w-3 h-3 mr-1" />
                        编辑
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="w-3 h-3 mr-1" />
                        删除
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
