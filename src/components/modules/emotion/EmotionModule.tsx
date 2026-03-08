'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Users,
  MessageCircle,
  Calendar,
  Plus,
  ChevronRight,
  Edit2,
  Trash2,
  Star,
  Phone,
  Clock,
  User,
  UserPlus,
  Sparkles,
  Activity,
  Coffee,
  Briefcase,
  Home,
  MoreHorizontal,
  X,
  CheckCircle2,
  AlertCircle,
  Smile,
  Meh,
  Frown,
  TrendingUp
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// 关系类型
type RelationType = 'family' | 'friend' | 'colleague' | 'romantic';

// 相亲状态
type DatingStatus = 'contacting' | 'dating' | 'paused' | 'ended';

// 心情类型
type MoodType = 'great' | 'good' | 'neutral' | 'bad' | 'terrible';

// 关系记录数据类型
interface Relationship {
  id: string;
  name: string;
  type: RelationType;
  closeness: number; // 1-100
  lastContact: Date;
  notes: string;
  tags: string[];
}

// 沟通策略数据类型
interface CommunicationStrategy {
  id: string;
  title: string;
  scenario: string;
  approach: string;
  notes: string;
  targetPerson: string;
  status: 'planned' | 'executed' | 'completed';
  createdAt: Date;
}

// 相亲档案数据类型
interface DatingProfile {
  id: string;
  name: string;
  age: number;
  occupation: string;
  requirements: string[];
  status: DatingStatus;
  contactDate: Date;
  dates: number;
  notes: string;
  avatar?: string;
}

// 情感复盘数据类型
interface EmotionalReview {
  id: string;
  title: string;
  content: string;
  mood: MoodType;
  date: Date;
  tags: string[];
}

// 关系类型配置
const relationTypeConfig: Record<RelationType, { label: string; icon: React.ReactNode; color: string; bgColor: string }> = {
  family: { label: '家人', icon: <Home className="w-4 h-4" />, color: 'text-rose-600', bgColor: 'bg-rose-50' },
  friend: { label: '朋友', icon: <Users className="w-4 h-4" />, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  colleague: { label: '同事', icon: <Briefcase className="w-4 h-4" />, color: 'text-amber-600', bgColor: 'bg-amber-50' },
  romantic: { label: '恋人', icon: <Heart className="w-4 h-4" />, color: 'text-pink-600', bgColor: 'bg-pink-50' }
};

// 相亲状态配置
const datingStatusConfig: Record<DatingStatus, { label: string; color: string }> = {
  contacting: { label: '接触中', color: 'bg-blue-500' },
  dating: { label: '约会中', color: 'bg-pink-500' },
  paused: { label: '已暂停', color: 'bg-amber-500' },
  ended: { label: '已结束', color: 'bg-gray-500' }
};

// 心情类型配置
const moodConfig: Record<MoodType, { label: string; icon: React.ReactNode; color: string }> = {
  great: { label: '超棒', icon: <Smile className="w-5 h-5" />, color: 'text-green-500' },
  good: { label: '不错', icon: <Smile className="w-5 h-5" />, color: 'text-emerald-500' },
  neutral: { label: '一般', icon: <Meh className="w-5 h-5" />, color: 'text-amber-500' },
  bad: { label: '不好', icon: <Frown className="w-5 h-5" />, color: 'text-orange-500' },
  terrible: { label: '很差', icon: <Frown className="w-5 h-5" />, color: 'text-red-500' }
};

// 模拟关系记录数据
const mockRelationships: Relationship[] = [
  { id: '1', name: '妈妈', type: 'family', closeness: 95, lastContact: new Date(Date.now() - 86400000), notes: '每周通话，关心身体健康', tags: ['亲密', '家人'] },
  { id: '2', name: '爸爸', type: 'family', closeness: 88, lastContact: new Date(Date.now() - 86400000 * 3), notes: '喜欢下棋，偶尔一起下棋', tags: ['亲密', '家人'] },
  { id: '3', name: '小明', type: 'friend', closeness: 75, lastContact: new Date(Date.now() - 86400000 * 5), notes: '大学室友，现在在同一城市', tags: ['大学', '好友'] },
  { id: '4', name: '小红', type: 'friend', closeness: 70, lastContact: new Date(Date.now() - 86400000 * 7), notes: '健身搭子，一起健身', tags: ['健身', '朋友'] },
  { id: '5', name: '王经理', type: 'colleague', closeness: 60, lastContact: new Date(Date.now() - 86400000 * 2), notes: '直属领导，沟通较多', tags: ['工作', '领导'] },
  { id: '6', name: '小李', type: 'colleague', closeness: 55, lastContact: new Date(Date.now() - 86400000), notes: '项目合作伙伴', tags: ['工作', '合作'] }
];

// 模拟沟通策略数据
const mockStrategies: CommunicationStrategy[] = [
  { id: '1', title: '年终绩效沟通', scenario: '年终绩效面谈', approach: '先肯定成果，再提出改进建议，最后设定明年目标', notes: '注意倾听对方的想法', targetPerson: '王经理', status: 'completed', createdAt: new Date(Date.now() - 86400000 * 10) },
  { id: '2', title: '项目延期说明', scenario: '项目进度延期，需要向客户说明', approach: '诚实说明原因，提供补救方案，强调后续保障', notes: '准备好详细的延期原因分析', targetPerson: '客户张总', status: 'executed', createdAt: new Date(Date.now() - 86400000 * 5) },
  { id: '3', title: '朋友生日祝福', scenario: '小明生日', approach: '准备一份有意义的礼物，写一张手写卡片', notes: '他喜欢篮球', targetPerson: '小明', status: 'planned', createdAt: new Date() },
  { id: '4', title: '家庭聚会安排', scenario: '春节家庭聚会', approach: '提前沟通时间地点，照顾老人需求', notes: '地点选在方便老人的地方', targetPerson: '家人', status: 'planned', createdAt: new Date() }
];

// 模拟相亲档案数据
const mockDatingProfiles: DatingProfile[] = [
  { id: '1', name: '小芳', age: 28, occupation: '教师', requirements: ['善良', '有责任心', '经济独立'], status: 'dating', contactDate: new Date(Date.now() - 86400000 * 15), dates: 3, notes: '性格温柔，喜欢阅读和旅行' },
  { id: '2', name: '小婷', age: 26, occupation: '设计师', requirements: ['有上进心', '幽默'], status: 'contacting', contactDate: new Date(Date.now() - 86400000 * 5), dates: 0, notes: '刚认识，微信聊过几次' },
  { id: '3', name: '小雨', age: 27, occupation: 'HR', requirements: ['稳定', '孝顺'], status: 'ended', contactDate: new Date(Date.now() - 86400000 * 30), dates: 2, notes: '性格不合，已和平结束' },
  { id: '4', name: '小雪', age: 29, occupation: '护士', requirements: ['理解医护工作', '成熟稳重'], status: 'paused', contactDate: new Date(Date.now() - 86400000 * 20), dates: 1, notes: '最近工作忙，暂停约会' }
];

// 模拟情感复盘数据
const mockReviews: EmotionalReview[] = [
  { id: '1', title: '今天和妈妈的通话', content: '和妈妈聊了很久，她最近身体不太好，很担心。决定下周末回家看看她。家人永远是最重要的。', mood: 'good', date: new Date(Date.now() - 86400000), tags: ['家人', '关心'] },
  { id: '2', title: '朋友聚会感受', content: '今天和小明、小红一起吃饭，聊了很多大学时的趣事。感觉友情是需要维护的，以后要多组织这样的聚会。', mood: 'great', date: new Date(Date.now() - 86400000 * 3), tags: ['朋友', '聚会'] },
  { id: '3', title: '工作压力反思', content: '最近工作压力很大，和领导沟通后感觉好多了。沟通真的很重要，不能一个人扛着。', mood: 'neutral', date: new Date(Date.now() - 86400000 * 5), tags: ['工作', '压力'] },
  { id: '4', title: '约会心得', content: '和小芳的第三次约会，感觉越来越了解她了。她是一个很善良的人，喜欢她的温柔和善解人意。', mood: 'great', date: new Date(Date.now() - 86400000 * 2), tags: ['约会', '相亲'] },
  { id: '5', title: '一次失败的沟通', content: '今天和一个同事沟通时有点不愉快，可能是我的表达方式有问题。反思一下，应该更注意倾听和理解对方的立场。', mood: 'bad', date: new Date(Date.now() - 86400000 * 7), tags: ['反思', '工作'] }
];

export function EmotionModule() {
  const [activeTab, setActiveTab] = useState('relationships');
  
  // 数据状态
  const [relationships, setRelationships] = useState<Relationship[]>(mockRelationships);
  const [strategies, setStrategies] = useState<CommunicationStrategy[]>(mockStrategies);
  const [datingProfiles, setDatingProfiles] = useState<DatingProfile[]>(mockDatingProfiles);
  const [reviews, setReviews] = useState<EmotionalReview[]>(mockReviews);
  
  // 弹窗状态
  const [isAddRelationOpen, setIsAddRelationOpen] = useState(false);
  const [isAddStrategyOpen, setIsAddStrategyOpen] = useState(false);
  const [isAddDatingOpen, setIsAddDatingOpen] = useState(false);
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  
  // 新记录表单
  const [newRelation, setNewRelation] = useState({
    name: '',
    type: 'friend' as RelationType,
    closeness: 50,
    notes: ''
  });
  
  const [newStrategy, setNewStrategy] = useState({
    title: '',
    scenario: '',
    approach: '',
    notes: '',
    targetPerson: ''
  });
  
  const [newDating, setNewDating] = useState({
    name: '',
    age: 25,
    occupation: '',
    requirements: '',
    notes: ''
  });
  
  const [newReview, setNewReview] = useState({
    title: '',
    content: '',
    mood: 'neutral' as MoodType,
    tags: ''
  });

  // 统计数据
  const totalRelations = relationships.length;
  const avgCloseness = Math.round(relationships.reduce((acc, r) => acc + r.closeness, 0) / totalRelations);
  const activeDating = datingProfiles.filter(d => d.status === 'dating' || d.status === 'contacting').length;
  const recentReviews = reviews.filter(r => r.date >= new Date(Date.now() - 7 * 86400000)).length;

  // 添加关系记录
  const addRelation = () => {
    if (!newRelation.name.trim()) return;
    const relation: Relationship = {
      id: Date.now().toString(),
      name: newRelation.name,
      type: newRelation.type,
      closeness: newRelation.closeness,
      lastContact: new Date(),
      notes: newRelation.notes,
      tags: []
    };
    setRelationships([relation, ...relationships]);
    setNewRelation({ name: '', type: 'friend', closeness: 50, notes: '' });
    setIsAddRelationOpen(false);
  };

  // 添加沟通策略
  const addStrategy = () => {
    if (!newStrategy.title.trim()) return;
    const strategy: CommunicationStrategy = {
      id: Date.now().toString(),
      ...newStrategy,
      status: 'planned',
      createdAt: new Date()
    };
    setStrategies([strategy, ...strategies]);
    setNewStrategy({ title: '', scenario: '', approach: '', notes: '', targetPerson: '' });
    setIsAddStrategyOpen(false);
  };

  // 添加相亲档案
  const addDating = () => {
    if (!newDating.name.trim()) return;
    const profile: DatingProfile = {
      id: Date.now().toString(),
      name: newDating.name,
      age: newDating.age,
      occupation: newDating.occupation,
      requirements: newDating.requirements.split(/[,，]/).filter(Boolean),
      status: 'contacting',
      contactDate: new Date(),
      dates: 0,
      notes: newDating.notes
    };
    setDatingProfiles([profile, ...datingProfiles]);
    setNewDating({ name: '', age: 25, occupation: '', requirements: '', notes: '' });
    setIsAddDatingOpen(false);
  };

  // 添加情感复盘
  const addReview = () => {
    if (!newReview.title.trim() || !newReview.content.trim()) return;
    const review: EmotionalReview = {
      id: Date.now().toString(),
      title: newReview.title,
      content: newReview.content,
      mood: newReview.mood,
      date: new Date(),
      tags: newReview.tags.split(/[,，]/).filter(Boolean)
    };
    setReviews([review, ...reviews]);
    setNewReview({ title: '', content: '', mood: 'neutral', tags: '' });
    setIsAddReviewOpen(false);
  };

  // 删除关系
  const deleteRelation = (id: string) => {
    setRelationships(relationships.filter(r => r.id !== id));
  };

  // 删除策略
  const deleteStrategy = (id: string) => {
    setStrategies(strategies.filter(s => s.id !== id));
  };

  // 删除相亲档案
  const deleteDating = (id: string) => {
    setDatingProfiles(datingProfiles.filter(d => d.id !== id));
  };

  // 删除复盘
  const deleteReview = (id: string) => {
    setReviews(reviews.filter(r => r.id !== id));
  };

  // 更新相亲状态
  const updateDatingStatus = (id: string, status: DatingStatus) => {
    setDatingProfiles(datingProfiles.map(d => 
      d.id === id ? { ...d, status } : d
    ));
  };

  // 更新策略状态
  const updateStrategyStatus = (id: string, status: 'planned' | 'executed' | 'completed') => {
    setStrategies(strategies.map(s => 
      s.id === id ? { ...s, status } : s
    ));
  };

  // 获取亲密度描述
  const getClosenessLabel = (closeness: number) => {
    if (closeness >= 80) return { label: '非常亲密', color: 'text-green-600' };
    if (closeness >= 60) return { label: '关系良好', color: 'text-emerald-600' };
    if (closeness >= 40) return { label: '一般关系', color: 'text-amber-600' };
    return { label: '需要维护', color: 'text-red-600' };
  };

  return (
    <ScrollArea className="h-[calc(100vh-120px)]">
      <div className="space-y-6 p-4 md:p-6">
        {/* 模块头部 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Heart className="w-7 h-7 text-pink-500" />
              情感人际
            </h1>
            <p className="text-muted-foreground">关系记录、沟通策略、相亲管理、情感复盘</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-lg px-3">
              <Activity className="w-4 h-4 mr-1 text-pink-500" />
              亲密度 {avgCloseness}
            </Badge>
          </div>
        </div>

        {/* 核心数据卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border-pink-500/20">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-pink-100">
                  <Users className="w-4 h-4 text-pink-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalRelations}</div>
                  <p className="text-xs text-muted-foreground">关系记录</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-100">
                  <MessageCircle className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{strategies.length}</div>
                  <p className="text-xs text-muted-foreground">沟通策略</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-rose-500/10 to-pink-500/10 border-rose-500/20">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-rose-100">
                  <Heart className="w-4 h-4 text-rose-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{activeDating}</div>
                  <p className="text-xs text-muted-foreground">相亲中</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-100">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{recentReviews}</div>
                  <p className="text-xs text-muted-foreground">本周复盘</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 主要内容标签页 */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="relationships">关系记录</TabsTrigger>
            <TabsTrigger value="strategies">沟通策略</TabsTrigger>
            <TabsTrigger value="dating">相亲管理</TabsTrigger>
            <TabsTrigger value="reviews">情感复盘</TabsTrigger>
          </TabsList>

          {/* 关系记录 */}
          <TabsContent value="relationships" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">我的关系网络</h3>
              <Dialog open={isAddRelationOpen} onOpenChange={setIsAddRelationOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1">
                    <Plus className="w-4 h-4" />
                    添加关系
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>添加关系记录</DialogTitle>
                    <DialogDescription>记录一个重要的人际关系</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>姓名</Label>
                      <Input
                        value={newRelation.name}
                        onChange={(e) => setNewRelation({ ...newRelation, name: e.target.value })}
                        placeholder="输入对方姓名"
                      />
                    </div>
                    <div>
                      <Label>关系类型</Label>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {Object.entries(relationTypeConfig).map(([key, config]) => (
                          <Button
                            key={key}
                            variant={newRelation.type === key ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setNewRelation({ ...newRelation, type: key as RelationType })}
                            className="flex flex-col gap-1 h-auto py-2"
                          >
                            <span className={cn(newRelation.type !== key && config.color)}>{config.icon}</span>
                            <span>{config.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>亲密度: {newRelation.closeness}</Label>
                      <div className="mt-2">
                        <input
                          type="range"
                          min="1"
                          max="100"
                          value={newRelation.closeness}
                          onChange={(e) => setNewRelation({ ...newRelation, closeness: Number(e.target.value) })}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      <p className={cn("text-sm mt-1", getClosenessLabel(newRelation.closeness).color)}>
                        {getClosenessLabel(newRelation.closeness).label}
                      </p>
                    </div>
                    <div>
                      <Label>备注</Label>
                      <Textarea
                        value={newRelation.notes}
                        onChange={(e) => setNewRelation({ ...newRelation, notes: e.target.value })}
                        placeholder="记录一些关于这段关系的信息..."
                        rows={3}
                      />
                    </div>
                    <Button onClick={addRelation} className="w-full">添加关系</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {relationships.map((relation, index) => {
                  const config = relationTypeConfig[relation.type];
                  const closenessInfo = getClosenessLabel(relation.closeness);
                  return (
                    <motion.div
                      key={relation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={cn("p-3 rounded-xl", config.bgColor)}>
                              <span className={config.color}>{config.icon}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium truncate">{relation.name}</h4>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                  onClick={() => deleteRelation(relation.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">{config.label}</Badge>
                                <span className={cn("text-xs", closenessInfo.color)}>{closenessInfo.label}</span>
                              </div>
                              <div className="mt-2">
                                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                  <span>亲密度</span>
                                  <span>{relation.closeness}%</span>
                                </div>
                                <Progress value={relation.closeness} className="h-1.5" />
                              </div>
                              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>上次联系: {relation.lastContact.toLocaleDateString('zh-CN')}</span>
                              </div>
                              {relation.notes && (
                                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{relation.notes}</p>
                              )}
                              <div className="flex flex-wrap gap-1 mt-2">
                                {relation.tags.map((tag, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </TabsContent>

          {/* 沟通策略 */}
          <TabsContent value="strategies" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">沟通策略</h3>
              <Dialog open={isAddStrategyOpen} onOpenChange={setIsAddStrategyOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1">
                    <Plus className="w-4 h-4" />
                    新建策略
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>新建沟通策略</DialogTitle>
                    <DialogDescription>规划一次重要的沟通</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>策略标题</Label>
                      <Input
                        value={newStrategy.title}
                        onChange={(e) => setNewStrategy({ ...newStrategy, title: e.target.value })}
                        placeholder="例如：年终绩效沟通"
                      />
                    </div>
                    <div>
                      <Label>目标对象</Label>
                      <Input
                        value={newStrategy.targetPerson}
                        onChange={(e) => setNewStrategy({ ...newStrategy, targetPerson: e.target.value })}
                        placeholder="要沟通的对象"
                      />
                    </div>
                    <div>
                      <Label>沟通场景</Label>
                      <Textarea
                        value={newStrategy.scenario}
                        onChange={(e) => setNewStrategy({ ...newStrategy, scenario: e.target.value })}
                        placeholder="描述这次沟通的背景和场景..."
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>沟通方式</Label>
                      <Textarea
                        value={newStrategy.approach}
                        onChange={(e) => setNewStrategy({ ...newStrategy, approach: e.target.value })}
                        placeholder="计划采用的沟通方式和策略..."
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>备注</Label>
                      <Textarea
                        value={newStrategy.notes}
                        onChange={(e) => setNewStrategy({ ...newStrategy, notes: e.target.value })}
                        placeholder="其他需要注意的事项..."
                        rows={2}
                      />
                    </div>
                    <Button onClick={addStrategy} className="w-full">创建策略</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {strategies.map((strategy, index) => (
                  <motion.div
                    key={strategy.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={cn(
                      strategy.status === 'completed' && "bg-muted/30",
                      strategy.status === 'executed' && "border-blue-200"
                    )}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base flex items-center gap-2">
                              <MessageCircle className="w-4 h-4 text-purple-500" />
                              {strategy.title}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <User className="w-3 h-3" />
                              {strategy.targetPerson}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Select
                              value={strategy.status}
                              onValueChange={(value) => updateStrategyStatus(strategy.id, value as 'planned' | 'executed' | 'completed')}
                            >
                              <SelectTrigger className="w-24 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="planned">计划中</SelectItem>
                                <SelectItem value="executed">已执行</SelectItem>
                                <SelectItem value="completed">已完成</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => deleteStrategy(strategy.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <Label className="text-xs text-muted-foreground">沟通场景</Label>
                            <p className="text-sm mt-1">{strategy.scenario}</p>
                          </div>
                          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg">
                            <Label className="text-xs text-muted-foreground">沟通方式</Label>
                            <p className="text-sm mt-1">{strategy.approach}</p>
                          </div>
                        </div>
                        {strategy.notes && (
                          <div className="flex items-start gap-2 text-sm text-muted-foreground">
                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{strategy.notes}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>创建于 {strategy.createdAt.toLocaleDateString('zh-CN')}</span>
                          <Badge variant={
                            strategy.status === 'completed' ? 'default' :
                            strategy.status === 'executed' ? 'secondary' : 'outline'
                          }>
                            {strategy.status === 'completed' ? '已完成' :
                             strategy.status === 'executed' ? '已执行' : '计划中'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>

          {/* 相亲管理 */}
          <TabsContent value="dating" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">相亲档案</h3>
              <Dialog open={isAddDatingOpen} onOpenChange={setIsAddDatingOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1">
                    <UserPlus className="w-4 h-4" />
                    添加档案
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>添加相亲档案</DialogTitle>
                    <DialogDescription>记录一位相亲对象的信息</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>姓名</Label>
                        <Input
                          value={newDating.name}
                          onChange={(e) => setNewDating({ ...newDating, name: e.target.value })}
                          placeholder="对方姓名"
                        />
                      </div>
                      <div>
                        <Label>年龄</Label>
                        <Input
                          type="number"
                          value={newDating.age}
                          onChange={(e) => setNewDating({ ...newDating, age: Number(e.target.value) })}
                          placeholder="年龄"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>职业</Label>
                      <Input
                        value={newDating.occupation}
                        onChange={(e) => setNewDating({ ...newDating, occupation: e.target.value })}
                        placeholder="对方职业"
                      />
                    </div>
                    <div>
                      <Label>对方要求</Label>
                      <Textarea
                        value={newDating.requirements}
                        onChange={(e) => setNewDating({ ...newDating, requirements: e.target.value })}
                        placeholder="对方的要求，用逗号分隔..."
                        rows={2}
                      />
                    </div>
                    <div>
                      <Label>备注</Label>
                      <Textarea
                        value={newDating.notes}
                        onChange={(e) => setNewDating({ ...newDating, notes: e.target.value })}
                        placeholder="其他信息..."
                        rows={2}
                      />
                    </div>
                    <Button onClick={addDating} className="w-full">添加档案</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {datingProfiles.map((profile, index) => {
                  const statusConfig = datingStatusConfig[profile.status];
                  return (
                    <motion.div
                      key={profile.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className={cn(
                        "overflow-hidden",
                        profile.status === 'ended' && "opacity-60"
                      )}>
                        <div className={cn("h-1.5", statusConfig.color)} />
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-medium text-lg">
                                {profile.name.charAt(0)}
                              </div>
                              <div>
                                <CardTitle className="text-base">{profile.name}</CardTitle>
                                <CardDescription className="flex items-center gap-2">
                                  <span>{profile.age}岁</span>
                                  <span>·</span>
                                  <span>{profile.occupation}</span>
                                </CardDescription>
                              </div>
                            </div>
                            <Select
                              value={profile.status}
                              onValueChange={(value) => updateDatingStatus(profile.id, value as DatingStatus)}
                            >
                              <SelectTrigger className="w-24 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="contacting">接触中</SelectItem>
                                <SelectItem value="dating">约会中</SelectItem>
                                <SelectItem value="paused">已暂停</SelectItem>
                                <SelectItem value="ended">已结束</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              认识于 {profile.contactDate.toLocaleDateString('zh-CN')}
                            </span>
                            <span className="flex items-center gap-1">
                              <Coffee className="w-3 h-3" />
                              约会 {profile.dates} 次
                            </span>
                          </div>
                          
                          <div>
                            <Label className="text-xs text-muted-foreground">对方要求</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {profile.requirements.map((req, i) => (
                                <Badge key={i} variant="outline" className="text-xs">{req}</Badge>
                              ))}
                            </div>
                          </div>
                          
                          {profile.notes && (
                            <p className="text-sm text-muted-foreground">{profile.notes}</p>
                          )}
                          
                          <Separator />
                          
                          <div className="flex items-center justify-between">
                            <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive"
                              onClick={() => deleteDating(profile.id)}
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              删除
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </TabsContent>

          {/* 情感复盘 */}
          <TabsContent value="reviews" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">情感复盘</h3>
              <Dialog open={isAddReviewOpen} onOpenChange={setIsAddReviewOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1">
                    <Plus className="w-4 h-4" />
                    写复盘
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>写情感复盘</DialogTitle>
                    <DialogDescription>记录你的情感体验和反思</DialogDescription>
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
                      <Label>心情</Label>
                      <div className="flex gap-2 mt-2">
                        {Object.entries(moodConfig).map(([key, config]) => (
                          <Button
                            key={key}
                            variant={newReview.mood === key ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setNewReview({ ...newReview, mood: key as MoodType })}
                            className="flex flex-col gap-1 h-auto py-2 px-3"
                          >
                            <span className={cn(newReview.mood !== key && config.color)}>{config.icon}</span>
                            <span className="text-xs">{config.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>内容</Label>
                      <Textarea
                        value={newReview.content}
                        onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
                        placeholder="记录你的感受、思考和收获..."
                        rows={5}
                      />
                    </div>
                    <div>
                      <Label>标签</Label>
                      <Input
                        value={newReview.tags}
                        onChange={(e) => setNewReview({ ...newReview, tags: e.target.value })}
                        placeholder="用逗号分隔多个标签"
                      />
                    </div>
                    <Button onClick={addReview} className="w-full">保存复盘</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {reviews.map((review, index) => {
                  const mood = moodConfig[review.mood];
                  return (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card>
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className={cn(
                                "p-2 rounded-lg",
                                review.mood === 'great' || review.mood === 'good' ? "bg-green-50" :
                                review.mood === 'neutral' ? "bg-amber-50" : "bg-red-50"
                              )}>
                                <span className={mood.color}>{mood.icon}</span>
                              </div>
                              <div>
                                <CardTitle className="text-base">{review.title}</CardTitle>
                                <CardDescription className="flex items-center gap-2 mt-1">
                                  <Calendar className="w-3 h-3" />
                                  {review.date.toLocaleDateString('zh-CN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={mood.color}>{mood.label}</Badge>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => deleteReview(review.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{review.content}</p>
                          
                          {review.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {review.tags.map((tag, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
