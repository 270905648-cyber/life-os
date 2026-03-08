'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  FileText,
  Calendar,
  TrendingUp,
  Plus,
  Search,
  Edit2,
  Trash2,
  ChevronRight,
  Sparkles,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Clock,
  Filter,
  MoreVertical,
  Send,
  Loader2,
  X,
  CheckCircle2,
  Target,
  Zap,
  BarChart3,
  Users,
  Play,
  Image,
  Youtube,
  Instagram,
  Twitter,
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

// ============== 数据类型定义 ==============

interface ContentScript {
  id: string;
  title: string;
  type: 'article' | 'video' | 'shorts';
  platform: 'wechat' | 'douyin' | 'xiaohongshu' | 'bilibili' | 'youtube';
  status: 'draft' | 'review' | 'published';
  content: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  createdAt: Date;
  publishedAt?: Date;
  tags: string[];
}

interface TopicPlan {
  id: string;
  title: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'planning' | 'scripting' | 'filming' | 'editing' | 'ready';
  description: string;
  deadline: Date;
  createdAt: Date;
  tags: string[];
}

interface CalendarEvent {
  id: string;
  title: string;
  platform: 'wechat' | 'douyin' | 'xiaohongshu' | 'bilibili' | 'youtube';
  publishDate: Date;
  publishTime: string;
  status: 'scheduled' | 'published' | 'failed';
  contentId?: string;
}

interface AnalyticsData {
  id: string;
  date: Date;
  platform: 'wechat' | 'douyin' | 'xiaohongshu' | 'bilibili' | 'youtube';
  views: number;
  likes: number;
  comments: number;
  shares: number;
  followers: number;
  engagement: number;
  previousViews: number;
  previousLikes: number;
  previousFollowers: number;
}

// ============== 模拟数据 ==============

const mockContentScripts: ContentScript[] = [
  {
    id: '1',
    title: '如何高效学习一门新技能',
    type: 'video',
    platform: 'bilibili',
    status: 'published',
    content: '大家好，今天我们来聊聊如何高效学习一门新技能...',
    views: 12500,
    likes: 890,
    comments: 156,
    shares: 45,
    createdAt: new Date(Date.now() - 86400000 * 7),
    publishedAt: new Date(Date.now() - 86400000 * 5),
    tags: ['学习', '效率', '技能'],
  },
  {
    id: '2',
    title: '我的AI工具使用心得',
    type: 'article',
    platform: 'wechat',
    status: 'published',
    content: '最近尝试了很多AI工具，今天来分享我的使用心得...',
    views: 5600,
    likes: 234,
    comments: 67,
    shares: 123,
    createdAt: new Date(Date.now() - 86400000 * 5),
    publishedAt: new Date(Date.now() - 86400000 * 3),
    tags: ['AI', '工具', '效率'],
  },
  {
    id: '3',
    title: '30天健身打卡记录',
    type: 'shorts',
    platform: 'douyin',
    status: 'published',
    content: '坚持健身第30天，分享一下我的变化...',
    views: 89000,
    likes: 5600,
    comments: 890,
    shares: 340,
    createdAt: new Date(Date.now() - 86400000 * 3),
    publishedAt: new Date(Date.now() - 86400000 * 2),
    tags: ['健身', '打卡', '生活'],
  },
  {
    id: '4',
    title: '读书笔记：原子习惯',
    type: 'article',
    platform: 'xiaohongshu',
    status: 'draft',
    content: '《原子习惯》这本书给了我很多启发...',
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    createdAt: new Date(Date.now() - 86400000),
    tags: ['读书', '习惯', '成长'],
  },
  {
    id: '5',
    title: '新手理财入门指南',
    type: 'video',
    platform: 'youtube',
    status: 'review',
    content: '很多人问我如何开始理财，今天就来聊聊...',
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    createdAt: new Date(),
    tags: ['理财', '投资', '入门'],
  },
];

const mockTopicPlans: TopicPlan[] = [
  {
    id: '1',
    title: 'AI绘画教程系列',
    category: '技术教程',
    priority: 'high',
    status: 'scripting',
    description: '制作一系列AI绘画入门教程，覆盖Midjourney、Stable Diffusion等工具',
    deadline: new Date(Date.now() + 86400000 * 7),
    createdAt: new Date(Date.now() - 86400000 * 3),
    tags: ['AI', '绘画', '教程'],
  },
  {
    id: '2',
    title: '月度复盘视频',
    category: '生活记录',
    priority: 'medium',
    status: 'planning',
    description: '每月末总结本月的成长、收获和反思',
    deadline: new Date(Date.now() + 86400000 * 5),
    createdAt: new Date(Date.now() - 86400000 * 2),
    tags: ['复盘', '成长', '生活'],
  },
  {
    id: '3',
    title: '职场沟通技巧',
    category: '职场成长',
    priority: 'high',
    status: 'filming',
    description: '分享职场中有效沟通的技巧和方法',
    deadline: new Date(Date.now() + 86400000 * 3),
    createdAt: new Date(Date.now() - 86400000 * 5),
    tags: ['职场', '沟通', '技巧'],
  },
  {
    id: '4',
    title: '周末Vlog',
    category: '生活记录',
    priority: 'low',
    status: 'editing',
    description: '记录周末的日常生活',
    deadline: new Date(Date.now() + 86400000 * 2),
    createdAt: new Date(Date.now() - 86400000),
    tags: ['Vlog', '生活', '周末'],
  },
];

const mockCalendarEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'AI绘画教程第一期',
    platform: 'bilibili',
    publishDate: new Date(Date.now() + 86400000 * 1),
    publishTime: '18:00',
    status: 'scheduled',
    contentId: '5',
  },
  {
    id: '2',
    title: '读书笔记分享',
    platform: 'xiaohongshu',
    publishDate: new Date(Date.now() + 86400000 * 2),
    publishTime: '12:00',
    status: 'scheduled',
  },
  {
    id: '3',
    title: '健身打卡Day 31',
    platform: 'douyin',
    publishDate: new Date(Date.now() + 86400000 * 3),
    publishTime: '07:00',
    status: 'scheduled',
  },
  {
    id: '4',
    title: '职场沟通技巧',
    platform: 'wechat',
    publishDate: new Date(Date.now() + 86400000 * 5),
    publishTime: '20:00',
    status: 'scheduled',
  },
  {
    id: '5',
    title: '理财入门视频',
    platform: 'youtube',
    publishDate: new Date(Date.now() + 86400000 * 7),
    publishTime: '15:00',
    status: 'scheduled',
  },
];

const mockAnalytics: AnalyticsData[] = [
  {
    id: '1',
    date: new Date(Date.now() - 86400000 * 6),
    platform: 'bilibili',
    views: 45000,
    likes: 3200,
    comments: 456,
    shares: 234,
    followers: 12500,
    engagement: 8.5,
    previousViews: 38000,
    previousLikes: 2800,
    previousFollowers: 11800,
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000 * 6),
    platform: 'douyin',
    views: 120000,
    likes: 8500,
    comments: 1200,
    shares: 670,
    followers: 45000,
    engagement: 8.2,
    previousViews: 98000,
    previousLikes: 7200,
    previousFollowers: 42000,
  },
  {
    id: '3',
    date: new Date(Date.now() - 86400000 * 6),
    platform: 'xiaohongshu',
    views: 28000,
    likes: 1900,
    comments: 320,
    shares: 180,
    followers: 8600,
    engagement: 8.8,
    previousViews: 24000,
    previousLikes: 1600,
    previousFollowers: 8000,
  },
  {
    id: '4',
    date: new Date(Date.now() - 86400000 * 6),
    platform: 'wechat',
    views: 15000,
    likes: 680,
    comments: 156,
    shares: 340,
    followers: 5200,
    engagement: 7.8,
    previousViews: 12000,
    previousLikes: 540,
    previousFollowers: 4800,
  },
];

// ============== 辅助函数和配置 ==============

const platformColors: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  bilibili: { bg: 'bg-pink-100', text: 'text-pink-700', icon: <Video className="w-4 h-4" /> },
  douyin: { bg: 'bg-slate-900', text: 'text-white', icon: <Play className="w-4 h-4" /> },
  xiaohongshu: { bg: 'bg-red-100', text: 'text-red-700', icon: <BookOpen className="w-4 h-4" /> },
  wechat: { bg: 'bg-green-100', text: 'text-green-700', icon: <MessageCircle className="w-4 h-4" /> },
  youtube: { bg: 'bg-red-100', text: 'text-red-700', icon: <Youtube className="w-4 h-4" /> },
};

const platformLabels: Record<string, string> = {
  bilibili: 'B站',
  douyin: '抖音',
  xiaohongshu: '小红书',
  wechat: '微信公众号',
  youtube: 'YouTube',
};

const typeLabels: Record<string, string> = {
  article: '文章',
  video: '视频',
  shorts: '短视频',
};

const typeIcons: Record<string, React.ReactNode> = {
  article: <FileText className="w-4 h-4" />,
  video: <Video className="w-4 h-4" />,
  shorts: <Play className="w-4 h-4" />,
};

const statusColors: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-700 border-slate-200',
  review: 'bg-amber-100 text-amber-700 border-amber-200',
  published: 'bg-green-100 text-green-700 border-green-200',
  scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
  failed: 'bg-red-100 text-red-700 border-red-200',
};

const statusLabels: Record<string, string> = {
  draft: '草稿',
  review: '审核中',
  published: '已发布',
  scheduled: '已排期',
  failed: '发布失败',
};

const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-green-100 text-green-700 border-green-200',
};

const priorityLabels: Record<string, string> = {
  high: '高',
  medium: '中',
  low: '低',
};

const topicStatusColors: Record<string, string> = {
  planning: 'bg-slate-100 text-slate-700',
  scripting: 'bg-blue-100 text-blue-700',
  filming: 'bg-purple-100 text-purple-700',
  editing: 'bg-amber-100 text-amber-700',
  ready: 'bg-green-100 text-green-700',
};

const topicStatusLabels: Record<string, string> = {
  planning: '策划中',
  scripting: '写脚本',
  filming: '拍摄中',
  editing: '剪辑中',
  ready: '待发布',
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// 格式化数字
const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

// 计算增长率
const calcGrowth = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
};

// ============== 主组件 ==============

export function MediaModule() {
  const [contentScripts, setContentScripts] = useState<ContentScript[]>(mockContentScripts);
  const [topicPlans, setTopicPlans] = useState<TopicPlan[]>(mockTopicPlans);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(mockCalendarEvents);
  const [analytics, setAnalytics] = useState<AnalyticsData[]>(mockAnalytics);
  const [activeTab, setActiveTab] = useState('scripts');

  // Dialog states
  const [isAddScriptOpen, setIsAddScriptOpen] = useState(false);
  const [isAddTopicOpen, setIsAddTopicOpen] = useState(false);
  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Form states
  const [newScript, setNewScript] = useState({
    title: '',
    type: 'article' as 'article' | 'video' | 'shorts',
    platform: 'wechat' as 'wechat' | 'douyin' | 'xiaohongshu' | 'bilibili' | 'youtube',
    content: '',
    tags: '',
  });
  const [newTopic, setNewTopic] = useState({
    title: '',
    category: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    description: '',
    deadline: '',
    tags: '',
  });
  const [newSchedule, setNewSchedule] = useState({
    title: '',
    platform: 'bilibili' as 'wechat' | 'douyin' | 'xiaohongshu' | 'bilibili' | 'youtube',
    publishDate: '',
    publishTime: '12:00',
  });

  // Search states
  const [scriptSearch, setScriptSearch] = useState('');
  const [topicSearch, setTopicSearch] = useState('');
  const [scriptFilter, setScriptFilter] = useState({
    type: 'all',
    platform: 'all',
    status: 'all',
  });

  // 统计数据
  const totalViews = analytics.reduce((sum, a) => sum + a.views, 0);
  const totalLikes = analytics.reduce((sum, a) => sum + a.likes, 0);
  const totalFollowers = analytics.reduce((sum, a) => sum + a.followers, 0);
  const avgEngagement = Math.round(analytics.reduce((sum, a) => sum + a.engagement, 0) / analytics.length * 10) / 10;
  const publishedCount = contentScripts.filter(s => s.status === 'published').length;
  const scheduledCount = calendarEvents.filter(e => e.status === 'scheduled').length;

  // 添加文案脚本
  const addScript = () => {
    if (!newScript.title.trim() || !newScript.content.trim()) return;
    const script: ContentScript = {
      id: Date.now().toString(),
      title: newScript.title,
      type: newScript.type,
      platform: newScript.platform,
      status: 'draft',
      content: newScript.content,
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
      createdAt: new Date(),
      tags: newScript.tags.split(/[,，]/).map(s => s.trim()).filter(Boolean),
    };
    setContentScripts([script, ...contentScripts]);
    setNewScript({ title: '', type: 'article', platform: 'wechat', content: '', tags: '' });
    setIsAddScriptOpen(false);
  };

  // 删除文案脚本
  const deleteScript = (id: string) => {
    setContentScripts(contentScripts.filter(s => s.id !== id));
  };

  // 添加选题策划
  const addTopic = () => {
    if (!newTopic.title.trim()) return;
    const topic: TopicPlan = {
      id: Date.now().toString(),
      title: newTopic.title,
      category: newTopic.category || '未分类',
      priority: newTopic.priority,
      status: 'planning',
      description: newTopic.description,
      deadline: newTopic.deadline ? new Date(newTopic.deadline) : new Date(Date.now() + 86400000 * 7),
      createdAt: new Date(),
      tags: newTopic.tags.split(/[,，]/).map(s => s.trim()).filter(Boolean),
    };
    setTopicPlans([topic, ...topicPlans]);
    setNewTopic({ title: '', category: '', priority: 'medium', description: '', deadline: '', tags: '' });
    setIsAddTopicOpen(false);
  };

  // 更新选题状态
  const updateTopicStatus = (id: string, status: TopicPlan['status']) => {
    setTopicPlans(topicPlans.map(t => t.id === id ? { ...t, status } : t));
  };

  // 删除选题
  const deleteTopic = (id: string) => {
    setTopicPlans(topicPlans.filter(t => t.id !== id));
  };

  // 添加排期
  const addSchedule = () => {
    if (!newSchedule.title.trim() || !newSchedule.publishDate) return;
    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newSchedule.title,
      platform: newSchedule.platform,
      publishDate: new Date(newSchedule.publishDate),
      publishTime: newSchedule.publishTime,
      status: 'scheduled',
    };
    setCalendarEvents([...calendarEvents, event].sort((a, b) => a.publishDate.getTime() - b.publishDate.getTime()));
    setNewSchedule({ title: '', platform: 'bilibili', publishDate: '', publishTime: '12:00' });
    setIsAddScheduleOpen(false);
  };

  // AI生成文案（模拟）
  const generateContent = async () => {
    if (!newScript.title.trim()) return;
    setIsGenerating(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const generatedContent = `# ${newScript.title}

## 开篇引入
在这个信息爆炸的时代，每个人都在寻找属于自己的表达方式。今天，我想和大家分享一些思考和感悟。

## 核心内容
1. 首先，让我们来理解这个话题的本质
2. 其次，探讨其中的关键要点
3. 最后，给出实用的建议和方法

## 个人见解
结合我自己的经验，我认为最重要的是保持初心，不断学习和成长。

## 总结
希望今天分享的内容对大家有所帮助。如果你觉得有价值，欢迎点赞关注，我们下期再见！`;

    setNewScript({ ...newScript, content: generatedContent });
    setIsGenerating(false);
  };

  // 过滤后的数据
  const filteredScripts = contentScripts.filter(s => {
    const matchesSearch = s.title.includes(scriptSearch) || s.tags.some(t => t.includes(scriptSearch));
    const matchesType = scriptFilter.type === 'all' || s.type === scriptFilter.type;
    const matchesPlatform = scriptFilter.platform === 'all' || s.platform === scriptFilter.platform;
    const matchesStatus = scriptFilter.status === 'all' || s.status === scriptFilter.status;
    return matchesSearch && matchesType && matchesPlatform && matchesStatus;
  });

  const filteredTopics = topicPlans.filter(t =>
    t.title.includes(topicSearch) || t.category.includes(topicSearch) || t.tags.some(tag => tag.includes(topicSearch))
  );

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* 模块头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Video className="w-7 h-7 text-pink-500" />
            自媒体IP
          </h1>
          <p className="text-muted-foreground">文案脚本、选题策划、发布日历、数据分析</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-lg px-3">
            <Users className="w-4 h-4 mr-1 text-blue-500" />
            {formatNumber(totalFollowers)} 粉丝
          </Badge>
        </div>
      </div>

      {/* 核心数据卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border-pink-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-pink-500" />
              <span className="text-2xl font-bold">{formatNumber(totalViews)}</span>
            </div>
            <p className="text-sm text-muted-foreground">总播放量</p>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              +12.5% 较上周
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-purple-500" />
              <span className="text-2xl font-bold">{formatNumber(totalLikes)}</span>
            </div>
            <p className="text-sm text-muted-foreground">总点赞数</p>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              +8.3% 较上周
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-500" />
              <span className="text-2xl font-bold">{publishedCount}</span>
            </div>
            <p className="text-sm text-muted-foreground">已发布内容</p>
            <p className="text-xs text-cyan-600 mt-1">{scheduledCount} 条待发布</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              <span className="text-2xl font-bold">{avgEngagement}%</span>
            </div>
            <p className="text-sm text-muted-foreground">平均互动率</p>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              +2.1% 较上周
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 主要内容标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scripts" className="gap-1">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">文案脚本</span>
          </TabsTrigger>
          <TabsTrigger value="topics" className="gap-1">
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">选题策划</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-1">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">发布日历</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-1">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">数据分析</span>
          </TabsTrigger>
        </TabsList>

        {/* 文案脚本 */}
        <TabsContent value="scripts" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-lg font-semibold">文案管理</h3>
            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索文案..."
                  value={scriptSearch}
                  onChange={(e) => setScriptSearch(e.target.value)}
                  className="pl-8 w-full sm:w-[180px]"
                />
              </div>
              <Select
                value={scriptFilter.type}
                onValueChange={(value) => setScriptFilter({ ...scriptFilter, type: value })}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="article">文章</SelectItem>
                  <SelectItem value="video">视频</SelectItem>
                  <SelectItem value="shorts">短视频</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={scriptFilter.status}
                onValueChange={(value) => setScriptFilter({ ...scriptFilter, status: value })}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="draft">草稿</SelectItem>
                  <SelectItem value="review">审核中</SelectItem>
                  <SelectItem value="published">已发布</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isAddScriptOpen} onOpenChange={setIsAddScriptOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1 shrink-0">
                    <Plus className="w-4 h-4" />
                    新建文案
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>新建文案</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>标题</Label>
                      <Input
                        value={newScript.title}
                        onChange={(e) => setNewScript({ ...newScript, title: e.target.value })}
                        placeholder="输入文案标题"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>类型</Label>
                        <Select
                          value={newScript.type}
                          onValueChange={(value: 'article' | 'video' | 'shorts') => 
                            setNewScript({ ...newScript, type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="article">文章</SelectItem>
                            <SelectItem value="video">视频</SelectItem>
                            <SelectItem value="shorts">短视频</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>平台</Label>
                        <Select
                          value={newScript.platform}
                          onValueChange={(value: 'wechat' | 'douyin' | 'xiaohongshu' | 'bilibili' | 'youtube') => 
                            setNewScript({ ...newScript, platform: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="wechat">微信公众号</SelectItem>
                            <SelectItem value="douyin">抖音</SelectItem>
                            <SelectItem value="xiaohongshu">小红书</SelectItem>
                            <SelectItem value="bilibili">B站</SelectItem>
                            <SelectItem value="youtube">YouTube</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>标签（逗号分隔）</Label>
                      <Input
                        value={newScript.tags}
                        onChange={(e) => setNewScript({ ...newScript, tags: e.target.value })}
                        placeholder="如：学习, 效率, 成长"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>内容</Label>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={generateContent}
                          disabled={isGenerating || !newScript.title.trim()}
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              生成中...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              AI生成
                            </>
                          )}
                        </Button>
                      </div>
                      <Textarea
                        value={newScript.content}
                        onChange={(e) => setNewScript({ ...newScript, content: e.target.value })}
                        placeholder="输入或生成文案内容..."
                        rows={10}
                        className="font-mono text-sm"
                      />
                    </div>
                    <Button onClick={addScript} className="w-full">创建文案</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredScripts.map((script, index) => (
                <motion.div
                  key={script.id}
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <Card className="hover:shadow-md transition-shadow h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base line-clamp-1 flex items-center gap-2">
                            {typeIcons[script.type]}
                            {script.title}
                          </CardTitle>
                          <CardDescription className="mt-1 flex items-center gap-2">
                            <Badge className={cn('text-xs px-1.5', platformColors[script.platform].bg, platformColors[script.platform].text)}>
                              {platformLabels[script.platform]}
                            </Badge>
                            <Badge className={cn('text-xs px-1.5', statusColors[script.status])}>
                              {statusLabels[script.status]}
                            </Badge>
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit2 className="w-4 h-4 mr-2" />
                              编辑
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => deleteScript(script.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              删除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {script.content}
                      </p>
                      
                      {script.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {script.tags.slice(0, 3).map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {script.status === 'published' && (
                        <Separator className="my-3" />
                      )}
                      
                      {script.status === 'published' && (
                        <div className="grid grid-cols-4 gap-2 text-center text-sm">
                          <div>
                            <div className="font-semibold text-pink-600">{formatNumber(script.views)}</div>
                            <div className="text-xs text-muted-foreground">播放</div>
                          </div>
                          <div>
                            <div className="font-semibold text-red-500">{formatNumber(script.likes)}</div>
                            <div className="text-xs text-muted-foreground">点赞</div>
                          </div>
                          <div>
                            <div className="font-semibold text-blue-500">{formatNumber(script.comments)}</div>
                            <div className="text-xs text-muted-foreground">评论</div>
                          </div>
                          <div>
                            <div className="font-semibold text-green-500">{formatNumber(script.shares)}</div>
                            <div className="text-xs text-muted-foreground">分享</div>
                          </div>
                        </div>
                      )}
                      
                      <Separator className="my-3" />
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {script.createdAt.toLocaleDateString('zh-CN')}
                        </span>
                        <Button variant="ghost" size="sm">
                          查看详情
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>

        {/* 选题策划 */}
        <TabsContent value="topics" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-lg font-semibold">选题列表</h3>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索选题..."
                  value={topicSearch}
                  onChange={(e) => setTopicSearch(e.target.value)}
                  className="pl-8 w-full sm:w-[200px]"
                />
              </div>
              <Dialog open={isAddTopicOpen} onOpenChange={setIsAddTopicOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1 shrink-0">
                    <Plus className="w-4 h-4" />
                    新建选题
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>新建选题</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>选题标题</Label>
                      <Input
                        value={newTopic.title}
                        onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                        placeholder="输入选题标题"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>分类</Label>
                        <Input
                          value={newTopic.category}
                          onChange={(e) => setNewTopic({ ...newTopic, category: e.target.value })}
                          placeholder="如：技术教程、生活记录"
                        />
                      </div>
                      <div>
                        <Label>优先级</Label>
                        <Select
                          value={newTopic.priority}
                          onValueChange={(value: 'high' | 'medium' | 'low') => 
                            setNewTopic({ ...newTopic, priority: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">高优先级</SelectItem>
                            <SelectItem value="medium">中优先级</SelectItem>
                            <SelectItem value="low">低优先级</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>截止日期</Label>
                      <Input
                        type="date"
                        value={newTopic.deadline}
                        onChange={(e) => setNewTopic({ ...newTopic, deadline: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>描述</Label>
                      <Textarea
                        value={newTopic.description}
                        onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                        placeholder="描述选题内容和目标..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>标签（逗号分隔）</Label>
                      <Input
                        value={newTopic.tags}
                        onChange={(e) => setNewTopic({ ...newTopic, tags: e.target.value })}
                        placeholder="如：教程, AI, 入门"
                      />
                    </div>
                    <Button onClick={addTopic} className="w-full">创建选题</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredTopics.map((topic, index) => (
                <motion.div
                  key={topic.id}
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{topic.title}</h4>
                            <Badge className={cn('text-xs', priorityColors[topic.priority])}>
                              {priorityLabels[topic.priority]}优先
                            </Badge>
                            <Badge className={cn('text-xs', topicStatusColors[topic.status])}>
                              {topicStatusLabels[topic.status]}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{topic.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Target className="w-3 h-3" />
                              {topic.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              截止：{topic.deadline.toLocaleDateString('zh-CN')}
                            </span>
                          </div>
                          {topic.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {topic.tags.map((tag, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Select
                            value={topic.status}
                            onValueChange={(value: TopicPlan['status']) => updateTopicStatus(topic.id, value)}
                          >
                            <SelectTrigger className="w-[100px] h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="planning">策划中</SelectItem>
                              <SelectItem value="scripting">写脚本</SelectItem>
                              <SelectItem value="filming">拍摄中</SelectItem>
                              <SelectItem value="editing">剪辑中</SelectItem>
                              <SelectItem value="ready">待发布</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive"
                            onClick={() => deleteTopic(topic.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>

        {/* 发布日历 */}
        <TabsContent value="calendar" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-lg font-semibold">发布计划</h3>
            <Dialog open={isAddScheduleOpen} onOpenChange={setIsAddScheduleOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <Plus className="w-4 h-4" />
                  添加排期
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加发布排期</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>内容标题</Label>
                    <Input
                      value={newSchedule.title}
                      onChange={(e) => setNewSchedule({ ...newSchedule, title: e.target.value })}
                      placeholder="输入要发布的内容标题"
                    />
                  </div>
                  <div>
                    <Label>发布平台</Label>
                    <Select
                      value={newSchedule.platform}
                      onValueChange={(value: 'wechat' | 'douyin' | 'xiaohongshu' | 'bilibili' | 'youtube') => 
                        setNewSchedule({ ...newSchedule, platform: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wechat">微信公众号</SelectItem>
                        <SelectItem value="douyin">抖音</SelectItem>
                        <SelectItem value="xiaohongshu">小红书</SelectItem>
                        <SelectItem value="bilibili">B站</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>发布日期</Label>
                      <Input
                        type="date"
                        value={newSchedule.publishDate}
                        onChange={(e) => setNewSchedule({ ...newSchedule, publishDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>发布时间</Label>
                      <Input
                        type="time"
                        value={newSchedule.publishTime}
                        onChange={(e) => setNewSchedule({ ...newSchedule, publishTime: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button onClick={addSchedule} className="w-full">添加排期</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* 日历视图 */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-2">
            {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2 hidden lg:block">
                {day}
              </div>
            ))}
            {Array.from({ length: 7 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() + i);
              const dayEvents = calendarEvents.filter(
                e => e.publishDate.toDateString() === date.toDateString()
              );
              const isToday = date.toDateString() === new Date().toDateString();
              
              return (
                <Card 
                  key={i} 
                  className={cn(
                    "min-h-[120px]",
                    isToday && "border-pink-300 bg-pink-50/50"
                  )}
                >
                  <CardHeader className="p-2 pb-1">
                    <div className={cn(
                      "text-sm font-medium",
                      isToday && "text-pink-600"
                    )}>
                      {date.toLocaleDateString('zh-CN', { weekday: 'short', day: 'numeric' })}
                    </div>
                  </CardHeader>
                  <CardContent className="p-2 pt-0">
                    <div className="space-y-1">
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className={cn(
                            "text-xs p-1.5 rounded cursor-pointer hover:opacity-80",
                            platformColors[event.platform].bg
                          )}
                        >
                          <div className={cn("font-medium truncate", platformColors[event.platform].text)}>
                            {event.title}
                          </div>
                          <div className={cn("opacity-70", platformColors[event.platform].text)}>
                            {event.publishTime}
                          </div>
                        </div>
                      ))}
                      {dayEvents.length === 0 && (
                        <div className="text-xs text-muted-foreground text-center py-2">
                          暂无安排
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* 排期列表 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">排期详情</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-96">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>内容</TableHead>
                      <TableHead>平台</TableHead>
                      <TableHead>发布时间</TableHead>
                      <TableHead>状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {calendarEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.title}</TableCell>
                        <TableCell>
                          <Badge className={cn(platformColors[event.platform].bg, platformColors[event.platform].text)}>
                            {platformLabels[event.platform]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {event.publishDate.toLocaleDateString('zh-CN')} {event.publishTime}
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[event.status]}>
                            {statusLabels[event.status]}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 数据分析 */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">数据概览</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">近7天</Button>
              <Button variant="ghost" size="sm">近30天</Button>
            </div>
          </div>

          {/* 各平台数据卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analytics.map((data, index) => {
              const viewsGrowth = calcGrowth(data.views, data.previousViews);
              const likesGrowth = calcGrowth(data.likes, data.previousLikes);
              const followersGrowth = calcGrowth(data.followers, data.previousFollowers);
              
              return (
                <motion.div
                  key={data.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          <div className={cn("p-1.5 rounded", platformColors[data.platform].bg)}>
                            <span className={platformColors[data.platform].text}>
                              {platformColors[data.platform].icon}
                            </span>
                          </div>
                          {platformLabels[data.platform]}
                        </CardTitle>
                        <Badge variant="secondary">{data.engagement}% 互动</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="font-bold text-lg">{formatNumber(data.views)}</div>
                          <div className="text-xs text-muted-foreground">播放</div>
                          <div className={cn(
                            "text-xs flex items-center justify-center",
                            viewsGrowth >= 0 ? "text-green-600" : "text-red-600"
                          )}>
                            {viewsGrowth >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {Math.abs(viewsGrowth)}%
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-lg">{formatNumber(data.likes)}</div>
                          <div className="text-xs text-muted-foreground">点赞</div>
                          <div className={cn(
                            "text-xs flex items-center justify-center",
                            likesGrowth >= 0 ? "text-green-600" : "text-red-600"
                          )}>
                            {likesGrowth >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {Math.abs(likesGrowth)}%
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-lg">{formatNumber(data.followers)}</div>
                          <div className="text-xs text-muted-foreground">粉丝</div>
                          <div className={cn(
                            "text-xs flex items-center justify-center",
                            followersGrowth >= 0 ? "text-green-600" : "text-red-600"
                          )}>
                            {followersGrowth >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {Math.abs(followersGrowth)}%
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">互动率</span>
                          <span className="font-medium">{data.engagement}%</span>
                        </div>
                        <Progress value={data.engagement * 10} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* 详细数据表格 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">详细数据</CardTitle>
              <CardDescription>各平台近7天数据汇总</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-80">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>平台</TableHead>
                      <TableHead className="text-right">播放量</TableHead>
                      <TableHead className="text-right">点赞数</TableHead>
                      <TableHead className="text-right">评论数</TableHead>
                      <TableHead className="text-right">分享数</TableHead>
                      <TableHead className="text-right">粉丝数</TableHead>
                      <TableHead className="text-right">互动率</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analytics.map((data) => (
                      <TableRow key={data.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={cn("p-1 rounded", platformColors[data.platform].bg)}>
                              <span className={platformColors[data.platform].text}>
                                {platformColors[data.platform].icon}
                              </span>
                            </div>
                            {platformLabels[data.platform]}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">{formatNumber(data.views)}</TableCell>
                        <TableCell className="text-right">{formatNumber(data.likes)}</TableCell>
                        <TableCell className="text-right">{formatNumber(data.comments)}</TableCell>
                        <TableCell className="text-right">{formatNumber(data.shares)}</TableCell>
                        <TableCell className="text-right">{formatNumber(data.followers)}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary">{data.engagement}%</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* 内容表现排名 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">热门内容 TOP 5</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contentScripts
                    .filter(s => s.status === 'published')
                    .sort((a, b) => b.views - a.views)
                    .slice(0, 5)
                    .map((script, index) => (
                      <div key={script.id} className="flex items-center gap-3">
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                          index === 0 ? "bg-amber-100 text-amber-700" :
                          index === 1 ? "bg-slate-100 text-slate-700" :
                          index === 2 ? "bg-orange-100 text-orange-700" :
                          "bg-muted text-muted-foreground"
                        )}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{script.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {platformLabels[script.platform]}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatNumber(script.views)}</div>
                          <div className="text-xs text-muted-foreground">播放</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">互动最高 TOP 5</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contentScripts
                    .filter(s => s.status === 'published')
                    .sort((a, b) => (b.likes + b.comments + b.shares) - (a.likes + a.comments + a.shares))
                    .slice(0, 5)
                    .map((script, index) => (
                      <div key={script.id} className="flex items-center gap-3">
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                          index === 0 ? "bg-pink-100 text-pink-700" :
                          index === 1 ? "bg-slate-100 text-slate-700" :
                          index === 2 ? "bg-orange-100 text-orange-700" :
                          "bg-muted text-muted-foreground"
                        )}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{script.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {platformLabels[script.platform]}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-pink-600">
                            {formatNumber(script.likes + script.comments + script.shares)}
                          </div>
                          <div className="text-xs text-muted-foreground">互动</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
