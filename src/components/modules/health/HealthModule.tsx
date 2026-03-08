'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Activity,
  Droplet,
  Leaf,
  Plus,
  ChevronRight,
  Calendar,
  TrendingUp,
  Camera,
  Sparkles,
  Target,
  Clock,
  CheckCircle2,
  Circle,
  Edit2,
  Trash2,
  Thermometer,
  Wind,
  Flame,
  Snowflake,
  CloudRain,
  Sun,
  Zap,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// 中医体质类型
type ConstitutionType = '平和质' | '气虚质' | '阳虚质' | '阴虚质' | '痰湿质' | '湿热质' | '血瘀质' | '气郁质' | '特禀质';

// 中医体质数据
interface Constitution {
  type: ConstitutionType;
  score: number;
  description: string;
  characteristics: string[];
  recommendations: string[];
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

// 舌象记录数据类型
interface TongueRecord {
  id: string;
  date: Date;
  imageUrl: string;
  analysis: {
    tongueColor: string;
    tongueCoating: string;
    tongueShape: string;
    conclusion: string;
    recommendations: string[];
  };
}

// 养生茶饮数据类型
interface TeaRecipe {
  id: string;
  name: string;
  description: string;
  ingredients: { name: string; amount: string }[];
  benefits: string[];
  constitutionTypes: ConstitutionType[];
  preparation: string;
  imageUrl: string;
  isFavorite: boolean;
}

// 调理计划数据类型
interface HealthPlan {
  id: string;
  title: string;
  description: string;
  constitutionType: ConstitutionType;
  startDate: Date;
  endDate: Date;
  tasks: {
    id: string;
    content: string;
    completed: boolean;
    date: Date;
  }[];
  progress: number;
  status: 'ongoing' | 'completed' | 'paused';
}

// 中医体质数据
const constitutionData: Constitution[] = [
  {
    type: '平和质',
    score: 75,
    description: '体态适中、面色红润、精力充沛，是最理想的体质状态',
    characteristics: ['体型匀称', '面色红润', '精力充沛', '睡眠良好', '饮食正常'],
    recommendations: ['保持规律作息', '适度运动', '均衡饮食', '保持心情愉悦'],
    icon: <Sun className="w-5 h-5" />,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50'
  },
  {
    type: '气虚质',
    score: 45,
    description: '元气不足，表现为容易疲劳、气短、声音低弱',
    characteristics: ['容易疲乏', '声音低弱', '容易出汗', '易感冒', '舌淡红'],
    recommendations: ['避免过度劳累', '食用益气食物', '适当运动', '保持充足睡眠'],
    icon: <Wind className="w-5 h-5" />,
    color: 'text-slate-600',
    bgColor: 'bg-slate-50'
  },
  {
    type: '阳虚质',
    score: 30,
    description: '阳气不足，表现为怕冷、手足不温、喜热饮',
    characteristics: ['怕冷', '手足不温', '喜热饮', '面色柔白', '大便溏薄'],
    recommendations: ['注意保暖', '多食温热食物', '适度运动', '避免寒凉'],
    icon: <Snowflake className="w-5 h-5" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    type: '阴虚质',
    score: 25,
    description: '阴液不足，表现为口干咽燥、手足心热、大便干燥',
    characteristics: ['口干咽燥', '手足心热', '面色潮红', '大便干燥', '易失眠'],
    recommendations: ['避免熬夜', '食用滋阴食物', '保持心情平和', '少吃辛辣'],
    icon: <Flame className="w-5 h-5" />,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50'
  },
  {
    type: '痰湿质',
    score: 20,
    description: '痰湿内蕴，表现为体型肥胖、腹部肥满、口黏苔腻',
    characteristics: ['体型肥胖', '腹部肥满', '口黏苔腻', '皮肤油脂多', '喜食肥甘'],
    recommendations: ['控制饮食', '加强运动', '健脾祛湿', '少吃甜食'],
    icon: <CloudRain className="w-5 h-5" />,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50'
  },
  {
    type: '湿热质',
    score: 15,
    description: '湿热内蕴，表现为面垢油光、易生痤疮、口苦口干',
    characteristics: ['面垢油光', '易生痤疮', '口苦口干', '身重困倦', '小便短赤'],
    recommendations: ['清淡饮食', '避免潮湿环境', '适度运动', '少食辛辣油腻'],
    icon: <Thermometer className="w-5 h-5" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    type: '血瘀质',
    score: 10,
    description: '血行不畅，表现为肤色晦暗、易有瘀斑、口唇暗淡',
    characteristics: ['肤色晦暗', '易有瘀斑', '口唇暗淡', '易烦躁', '健忘'],
    recommendations: ['活血化瘀', '保持心情舒畅', '适度运动', '避免受寒'],
    icon: <Activity className="w-5 h-5" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    type: '气郁质',
    score: 8,
    description: '气机郁滞，表现为情绪低落、易焦虑、胸胁胀满',
    characteristics: ['情绪低落', '易焦虑', '胸胁胀满', '睡眠不佳', '多愁善感'],
    recommendations: ['调节情绪', '适度运动', '培养兴趣爱好', '保持社交'],
    icon: <Zap className="w-5 h-5" />,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50'
  },
  {
    type: '特禀质',
    score: 5,
    description: '先天失常，表现为过敏体质、易打喷嚏、易患哮喘',
    characteristics: ['过敏体质', '易打喷嚏', '易患哮喘', '皮肤敏感', '药物敏感'],
    recommendations: ['避免过敏原', '增强体质', '注意饮食', '定期体检'],
    icon: <AlertCircle className="w-5 h-5" />,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50'
  }
];

// 模拟舌象记录数据
const mockTongueRecords: TongueRecord[] = [
  {
    id: '1',
    date: new Date(Date.now() - 86400000 * 7),
    imageUrl: '/tongue-sample-1.jpg',
    analysis: {
      tongueColor: '淡红',
      tongueCoating: '薄白',
      tongueShape: '适中',
      conclusion: '舌象基本正常，提示体质尚可，建议继续保持良好的生活习惯',
      recommendations: ['保持规律作息', '多喝温水', '适当运动']
    }
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000 * 3),
    imageUrl: '/tongue-sample-2.jpg',
    analysis: {
      tongueColor: '偏淡',
      tongueCoating: '白腻',
      tongueShape: '胖大有齿痕',
      conclusion: '舌质淡，苔白腻，边有齿痕，提示脾虚湿盛，建议调理脾胃',
      recommendations: ['健脾祛湿', '少吃生冷', '食用山药薏米']
    }
  },
  {
    id: '3',
    date: new Date(Date.now() - 86400000),
    imageUrl: '/tongue-sample-3.jpg',
    analysis: {
      tongueColor: '红',
      tongueCoating: '黄',
      tongueShape: '偏瘦',
      conclusion: '舌红苔黄，提示有内热，建议清热降火，多饮水',
      recommendations: ['清热降火', '多饮水', '避免辛辣刺激']
    }
  }
];

// 模拟养生茶饮数据
const mockTeaRecipes: TeaRecipe[] = [
  {
    id: '1',
    name: '红枣枸杞茶',
    description: '补气养血，明目安神，适合气血不足者饮用',
    ingredients: [
      { name: '红枣', amount: '5颗' },
      { name: '枸杞', amount: '10克' },
      { name: '冰糖', amount: '适量' }
    ],
    benefits: ['补气养血', '明目安神', '美容养颜'],
    constitutionTypes: ['气虚质', '血瘀质'],
    preparation: '将红枣洗净去核，与枸杞一同放入杯中，用沸水冲泡，加盖焖10分钟即可饮用',
    imageUrl: '/tea-hongzao.jpg',
    isFavorite: true
  },
  {
    id: '2',
    name: '菊花决明子茶',
    description: '清肝明目，降火润肠，适合肝火旺盛者饮用',
    ingredients: [
      { name: '菊花', amount: '5克' },
      { name: '决明子', amount: '10克' },
      { name: '枸杞', amount: '5克' }
    ],
    benefits: ['清肝明目', '降火润肠', '缓解眼疲劳'],
    constitutionTypes: ['阴虚质', '湿热质'],
    preparation: '将所有材料放入杯中，用沸水冲泡，加盖焖15分钟即可饮用',
    imageUrl: '/tea-juhua.jpg',
    isFavorite: false
  },
  {
    id: '3',
    name: '陈皮普洱茶',
    description: '理气健脾，消食化积，适合消化不良者饮用',
    ingredients: [
      { name: '陈皮', amount: '3克' },
      { name: '普洱茶', amount: '5克' }
    ],
    benefits: ['理气健脾', '消食化积', '降脂减肥'],
    constitutionTypes: ['痰湿质', '气郁质'],
    preparation: '将陈皮和普洱茶放入茶壶中，用沸水冲泡，第一泡倒掉，第二泡开始饮用',
    imageUrl: '/tea-chenpi.jpg',
    isFavorite: true
  },
  {
    id: '4',
    name: '桂圆红枣茶',
    description: '补血安神，温暖身体，适合手脚冰凉者饮用',
    ingredients: [
      { name: '桂圆干', amount: '10克' },
      { name: '红枣', amount: '5颗' },
      { name: '生姜', amount: '2片' }
    ],
    benefits: ['补血安神', '温暖身体', '改善睡眠'],
    constitutionTypes: ['阳虚质', '气虚质'],
    preparation: '将桂圆干、红枣和生姜放入锅中，加水煮沸后转小火煮15分钟即可',
    imageUrl: '/tea-guiyuan.jpg',
    isFavorite: false
  },
  {
    id: '5',
    name: '玫瑰茉莉茶',
    description: '疏肝解郁，美容养颜，适合情绪不佳者饮用',
    ingredients: [
      { name: '玫瑰花', amount: '5克' },
      { name: '茉莉花', amount: '3克' },
      { name: '蜂蜜', amount: '适量' }
    ],
    benefits: ['疏肝解郁', '美容养颜', '调节情绪'],
    constitutionTypes: ['气郁质', '血瘀质'],
    preparation: '将玫瑰花和茉莉花放入杯中，用80度左右的热水冲泡，待温后加入蜂蜜调味',
    imageUrl: '/tea-meigui.jpg',
    isFavorite: true
  }
];

// 模拟调理计划数据
const mockHealthPlans: HealthPlan[] = [
  {
    id: '1',
    title: '健脾祛湿调理计划',
    description: '针对脾虚湿盛体质，通过饮食调理和运动来改善体质',
    constitutionType: '痰湿质',
    startDate: new Date(Date.now() - 86400000 * 14),
    endDate: new Date(Date.now() + 86400000 * 16),
    tasks: [
      { id: 't1', content: '每天喝一杯红豆薏米水', completed: true, date: new Date() },
      { id: 't2', content: '饭后散步30分钟', completed: true, date: new Date() },
      { id: 't3', content: '晚上11点前入睡', completed: false, date: new Date() },
      { id: 't4', content: '少吃生冷油腻食物', completed: true, date: new Date() },
      { id: 't5', content: '每天泡脚15分钟', completed: false, date: new Date() }
    ],
    progress: 60,
    status: 'ongoing'
  },
  {
    id: '2',
    title: '补气养血调理计划',
    description: '针对气血不足体质，通过食疗和作息调整来改善',
    constitutionType: '气虚质',
    startDate: new Date(Date.now() - 86400000 * 30),
    endDate: new Date(Date.now() - 86400000 * 2),
    tasks: [
      { id: 't1', content: '每天吃红枣桂圆粥', completed: true, date: new Date() },
      { id: 't2', content: '适当进行太极拳练习', completed: true, date: new Date() },
      { id: 't3', content: '避免过度劳累', completed: true, date: new Date() },
      { id: 't4', content: '每天中午休息30分钟', completed: true, date: new Date() }
    ],
    progress: 100,
    status: 'completed'
  }
];

export function HealthModule() {
  const [activeTab, setActiveTab] = useState('constitution');
  const [tongueRecords, setTongueRecords] = useState<TongueRecord[]>(mockTongueRecords);
  const [teaRecipes, setTeaRecipes] = useState<TeaRecipe[]>(mockTeaRecipes);
  const [healthPlans, setHealthPlans] = useState<HealthPlan[]>(mockHealthPlans);
  
  // 弹窗状态
  const [isAddTongueOpen, setIsAddTongueOpen] = useState(false);
  const [isAddPlanOpen, setIsAddPlanOpen] = useState(false);
  const [isTeaDetailOpen, setIsTeaDetailOpen] = useState(false);
  const [selectedTea, setSelectedTea] = useState<TeaRecipe | null>(null);
  
  // 新计划表单
  const [newPlan, setNewPlan] = useState({
    title: '',
    description: '',
    constitutionType: '气虚质' as ConstitutionType,
    duration: 30
  });

  // 获取主要体质
  const primaryConstitution = constitutionData.reduce((prev, current) =>
    current.score > prev.score ? current : prev
  );

  // 切换茶饮收藏状态
  const toggleFavorite = (id: string) => {
    setTeaRecipes(teaRecipes.map(recipe =>
      recipe.id === id ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe
    ));
  };

  // 切换计划任务完成状态
  const toggleTask = (planId: string, taskId: string) => {
    setHealthPlans(healthPlans.map(plan => {
      if (plan.id === planId) {
        const updatedTasks = plan.tasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        const completedCount = updatedTasks.filter(t => t.completed).length;
        const progress = Math.round((completedCount / updatedTasks.length) * 100);
        return {
          ...plan,
          tasks: updatedTasks,
          progress,
          status: progress === 100 ? 'completed' : 'ongoing'
        };
      }
      return plan;
    }));
  };

  // 添加新计划
  const addPlan = () => {
    if (!newPlan.title.trim()) return;
    const plan: HealthPlan = {
      id: Date.now().toString(),
      title: newPlan.title,
      description: newPlan.description,
      constitutionType: newPlan.constitutionType,
      startDate: new Date(),
      endDate: new Date(Date.now() + newPlan.duration * 86400000),
      tasks: [],
      progress: 0,
      status: 'ongoing'
    };
    setHealthPlans([plan, ...healthPlans]);
    setNewPlan({ title: '', description: '', constitutionType: '气虚质', duration: 30 });
    setIsAddPlanOpen(false);
  };

  // 统计数据
  const ongoingPlans = healthPlans.filter(p => p.status === 'ongoing').length;
  const completedTasksToday = healthPlans
    .filter(p => p.status === 'ongoing')
    .reduce((acc, plan) => acc + plan.tasks.filter(t => t.completed && t.date.toDateString() === new Date().toDateString()).length, 0);
  const favoriteTeas = teaRecipes.filter(t => t.isFavorite).length;

  return (
    <ScrollArea className="h-[calc(100vh-120px)]">
      <div className="space-y-6 p-4 md:p-6">
        {/* 模块头部 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Heart className="w-7 h-7 text-rose-500" />
              健康养生
            </h1>
            <p className="text-muted-foreground">中医体质分析、舌象记录、养生茶饮、调理计划</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-lg px-3">
              <Activity className="w-4 h-4 mr-1 text-green-500" />
              {primaryConstitution.type}
            </Badge>
          </div>
        </div>

        {/* 核心数据卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-rose-500/10 to-pink-500/10 border-rose-500/20">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-rose-100">
                  <Heart className="w-4 h-4 text-rose-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{primaryConstitution.score}</div>
                  <p className="text-xs text-muted-foreground">体质评分</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-cyan-100">
                  <Camera className="w-4 h-4 text-cyan-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{tongueRecords.length}</div>
                  <p className="text-xs text-muted-foreground">舌象记录</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-green-100">
                  <Target className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{ongoingPlans}</div>
                  <p className="text-xs text-muted-foreground">进行中计划</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-100">
                  <Leaf className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{favoriteTeas}</div>
                  <p className="text-xs text-muted-foreground">收藏茶饮</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 主要内容标签页 */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="constitution">体质分析</TabsTrigger>
            <TabsTrigger value="tongue">舌象记录</TabsTrigger>
            <TabsTrigger value="tea">养生茶饮</TabsTrigger>
            <TabsTrigger value="plan">调理计划</TabsTrigger>
          </TabsList>

          {/* 体质分析 */}
          <TabsContent value="constitution" className="space-y-4">
            {/* 主要体质卡片 */}
            <Card className="border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-3 rounded-xl", primaryConstitution.bgColor)}>
                      <span className={primaryConstitution.color}>{primaryConstitution.icon}</span>
                    </div>
                    <div>
                      <CardTitle className="text-xl">{primaryConstitution.type}</CardTitle>
                      <CardDescription>您的主要体质</CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-rose-600">{primaryConstitution.score}</div>
                    <div className="text-sm text-muted-foreground">体质评分</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{primaryConstitution.description}</p>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">体质特征</Label>
                  <div className="flex flex-wrap gap-2">
                    {primaryConstitution.characteristics.map((char, i) => (
                      <Badge key={i} variant="secondary">{char}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">调理建议</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {primaryConstitution.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 九种体质评分 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">九种体质评分</CardTitle>
                <CardDescription>点击查看详情和调理建议</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {constitutionData.map((item, index) => (
                    <motion.div
                      key={item.type}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all hover:bg-muted/50",
                        item.type === primaryConstitution.type && "bg-rose-50 border border-rose-200"
                      )}
                    >
                      <div className={cn("p-2 rounded-lg", item.bgColor)}>
                        <span className={item.color}>{item.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{item.type}</span>
                          <span className="text-sm text-muted-foreground">{item.score}分</span>
                        </div>
                        <Progress value={item.score} className="h-2" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 舌象记录 */}
          <TabsContent value="tongue" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">舌象记录</h3>
              <Dialog open={isAddTongueOpen} onOpenChange={setIsAddTongueOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1">
                    <Camera className="w-4 h-4" />
                    拍摄舌象
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>拍摄舌象</DialogTitle>
                    <DialogDescription>
                      上传您的舌象照片，AI将为您分析体质状况
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <Camera className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground mb-2">点击上传或拖拽图片到此处</p>
                      <p className="text-xs text-muted-foreground">支持 JPG、PNG 格式</p>
                    </div>
                    <div className="bg-amber-50 p-3 rounded-lg">
                      <p className="text-sm text-amber-800">
                        <strong>拍摄提示：</strong>
                        请在自然光下拍摄，伸舌自然放松，避免染苔（如咖啡、有色饮料等）。
                      </p>
                    </div>
                    <Button className="w-full">上传并分析</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {tongueRecords.map((record, index) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {record.date.toLocaleDateString('zh-CN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* 舌象图片 */}
                        <div className="aspect-[4/3] bg-gradient-to-br from-pink-100 to-rose-100 rounded-lg flex items-center justify-center">
                          <div className="text-center p-4">
                            <Droplet className="w-12 h-12 mx-auto text-rose-300 mb-2" />
                            <p className="text-sm text-rose-400">舌象图片</p>
                          </div>
                        </div>
                        
                        {/* 分析结果 */}
                        <div className="md:col-span-2 space-y-3">
                          <div className="grid grid-cols-3 gap-3">
                            <div className="bg-muted/50 p-3 rounded-lg">
                              <Label className="text-xs text-muted-foreground">舌色</Label>
                              <p className="font-medium">{record.analysis.tongueColor}</p>
                            </div>
                            <div className="bg-muted/50 p-3 rounded-lg">
                              <Label className="text-xs text-muted-foreground">舌苔</Label>
                              <p className="font-medium">{record.analysis.tongueCoating}</p>
                            </div>
                            <div className="bg-muted/50 p-3 rounded-lg">
                              <Label className="text-xs text-muted-foreground">舌形</Label>
                              <p className="font-medium">{record.analysis.tongueShape}</p>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-3 rounded-lg">
                            <Label className="text-xs text-muted-foreground">AI分析结论</Label>
                            <p className="text-sm mt-1">{record.analysis.conclusion}</p>
                          </div>
                          
                          <div>
                            <Label className="text-xs text-muted-foreground">调理建议</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {record.analysis.recommendations.map((rec, i) => (
                                <Badge key={i} variant="outline" className="text-xs">{rec}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* 养生茶饮 */}
          <TabsContent value="tea" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">养生茶饮</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  全部
                </Button>
                <Button variant="ghost" size="sm">
                  已收藏
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teaRecipes.map((tea, index) => (
                <motion.div
                  key={tea.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="h-full cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                    setSelectedTea(tea);
                    setIsTeaDetailOpen(true);
                  }}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Leaf className="w-4 h-4 text-green-500" />
                          {tea.name}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(tea.id);
                          }}
                        >
                          <Sparkles className={cn(
                            "w-4 h-4",
                            tea.isFavorite ? "text-amber-500 fill-amber-500" : "text-muted-foreground"
                          )} />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* 茶饮图片占位 */}
                      <div className="aspect-video bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                        <Droplet className="w-10 h-10 text-green-300" />
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">{tea.description}</p>
                      
                      <div className="flex flex-wrap gap-1">
                        {tea.benefits.slice(0, 2).map((benefit, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{benefit}</Badge>
                        ))}
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {tea.constitutionTypes.map((type, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{type}</Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="ghost" size="sm" className="w-full">
                        查看详情
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* 茶饮详情弹窗 */}
            <Dialog open={isTeaDetailOpen} onOpenChange={setIsTeaDetailOpen}>
              <DialogContent className="max-w-lg">
                {selectedTea && (
                  <>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Leaf className="w-5 h-5 text-green-500" />
                        {selectedTea.name}
                      </DialogTitle>
                      <DialogDescription>{selectedTea.description}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label className="font-medium">配料</Label>
                        <div className="mt-2 space-y-2">
                          {selectedTea.ingredients.map((ing, i) => (
                            <div key={i} className="flex justify-between items-center p-2 bg-muted/50 rounded-lg">
                              <span>{ing.name}</span>
                              <Badge variant="secondary">{ing.amount}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="font-medium">功效</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedTea.benefits.map((benefit, i) => (
                            <Badge key={i} variant="secondary">{benefit}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="font-medium">适合体质</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedTea.constitutionTypes.map((type, i) => (
                            <Badge key={i} variant="outline">{type}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="font-medium">冲泡方法</Label>
                        <p className="text-sm text-muted-foreground mt-2">{selectedTea.preparation}</p>
                      </div>
                      
                      <Button className="w-full" onClick={() => toggleFavorite(selectedTea.id)}>
                        <Sparkles className={cn(
                          "w-4 h-4 mr-2",
                          selectedTea.isFavorite ? "fill-current" : ""
                        )} />
                        {selectedTea.isFavorite ? '取消收藏' : '收藏茶饮'}
                      </Button>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* 调理计划 */}
          <TabsContent value="plan" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">调理计划</h3>
              <Dialog open={isAddPlanOpen} onOpenChange={setIsAddPlanOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1">
                    <Plus className="w-4 h-4" />
                    新建计划
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>新建调理计划</DialogTitle>
                    <DialogDescription>
                      根据您的体质状况，制定个性化的调理计划
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>计划名称</Label>
                      <Input
                        value={newPlan.title}
                        onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                        placeholder="例如：健脾祛湿调理计划"
                      />
                    </div>
                    <div>
                      <Label>计划描述</Label>
                      <Textarea
                        value={newPlan.description}
                        onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                        placeholder="描述您的调理目标和计划内容"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>针对体质</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {['气虚质', '阳虚质', '阴虚质', '痰湿质', '湿热质', '血瘀质', '气郁质', '特禀质'].map((type) => (
                          <Button
                            key={type}
                            variant={newPlan.constitutionType === type ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setNewPlan({ ...newPlan, constitutionType: type as ConstitutionType })}
                          >
                            {type}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>计划周期（天）</Label>
                      <div className="flex gap-2 mt-2">
                        {[14, 21, 30, 60, 90].map((days) => (
                          <Button
                            key={days}
                            variant={newPlan.duration === days ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setNewPlan({ ...newPlan, duration: days })}
                          >
                            {days}天
                          </Button>
                        ))}
                      </div>
                    </div>
                    <Button onClick={addPlan} className="w-full">创建计划</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {healthPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={cn(
                    plan.status === 'completed' && "bg-muted/30",
                    plan.status === 'ongoing' && "border-green-200 bg-gradient-to-br from-green-50/50 to-emerald-50/50"
                  )}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">{plan.title}</CardTitle>
                          <Badge variant={
                            plan.status === 'completed' ? 'default' :
                            plan.status === 'ongoing' ? 'default' : 'secondary'
                          } className={
                            plan.status === 'ongoing' ? 'bg-green-500' : ''
                          }>
                            {plan.status === 'completed' ? '已完成' :
                             plan.status === 'ongoing' ? '进行中' : '已暂停'}
                          </Badge>
                        </div>
                        <Badge variant="outline">{plan.constitutionType}</Badge>
                      </div>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* 进度条 */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">完成进度</span>
                          <span className="font-medium">{plan.progress}%</span>
                        </div>
                        <Progress value={plan.progress} className="h-2" />
                      </div>
                      
                      {/* 时间信息 */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {plan.startDate.toLocaleDateString('zh-CN')} - {plan.endDate.toLocaleDateString('zh-CN')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {Math.ceil((plan.endDate.getTime() - new Date().getTime()) / 86400000)} 天剩余
                        </span>
                      </div>
                      
                      {/* 任务列表 */}
                      <div className="space-y-2">
                        <Label className="text-sm">今日任务</Label>
                        <div className="space-y-1">
                          {plan.tasks.slice(0, 3).map((task) => (
                            <div
                              key={task.id}
                              onClick={() => toggleTask(plan.id, task.id)}
                              className={cn(
                                "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors",
                                "hover:bg-muted/50",
                                task.completed && "bg-green-50"
                              )}
                            >
                              {task.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              ) : (
                                <Circle className="w-5 h-5 text-muted-foreground" />
                              )}
                              <span className={cn(
                                "text-sm",
                                task.completed && "line-through text-muted-foreground"
                              )}>
                                {task.content}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="justify-between">
                      <Button variant="ghost" size="sm">
                        <Edit2 className="w-3 h-3 mr-1" />
                        编辑
                      </Button>
                      <Button variant="ghost" size="sm">
                        查看详情
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
