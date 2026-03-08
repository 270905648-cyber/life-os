'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  Bell,
  MapPin,
  CreditCard,
  Plus,
  Search,
  Edit2,
  Trash2,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Phone,
  User,
  Building,
  Home,
  Briefcase,
  Copy,
  Eye,
  EyeOff,
  MoreVertical,
  Filter,
  RefreshCw,
  CreditCard as CardIcon,
  FileText,
  Shield,
  X,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

interface FinanceRecord {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: Date;
}

interface Reminder {
  id: string;
  title: string;
  time: Date;
  repeat: 'none' | 'daily' | 'weekly' | 'monthly';
  status: 'pending' | 'completed' | 'overdue';
  notes?: string;
}

interface Address {
  id: string;
  name: string;
  category: 'home' | 'work' | 'family' | 'other';
  location: string;
  contact?: string;
  phone?: string;
  notes?: string;
}

interface CardRecord {
  id: string;
  type: 'id' | 'bank' | 'credit' | 'social' | 'other';
  name: string;
  number: string;
  expiryDate?: string;
  holder?: string;
  notes?: string;
}

// ============== 模拟数据 ==============

const mockFinanceRecords: FinanceRecord[] = [
  {
    id: '1',
    type: 'income',
    category: '工资',
    amount: 15000,
    description: '12月工资',
    date: new Date(Date.now() - 86400000 * 5),
  },
  {
    id: '2',
    type: 'expense',
    category: '餐饮',
    amount: 156,
    description: '朋友聚餐',
    date: new Date(Date.now() - 86400000 * 4),
  },
  {
    id: '3',
    type: 'expense',
    category: '交通',
    amount: 200,
    description: '地铁充值',
    date: new Date(Date.now() - 86400000 * 3),
  },
  {
    id: '4',
    type: 'expense',
    category: '购物',
    amount: 899,
    description: '购买运动鞋',
    date: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: '5',
    type: 'income',
    category: '副业',
    amount: 3000,
    description: '兼职收入',
    date: new Date(Date.now() - 86400000),
  },
  {
    id: '6',
    type: 'expense',
    category: '娱乐',
    amount: 280,
    description: '电影票+爆米花',
    date: new Date(),
  },
];

const mockReminders: Reminder[] = [
  {
    id: '1',
    title: '缴纳房租',
    time: new Date(Date.now() + 86400000),
    repeat: 'monthly',
    status: 'pending',
    notes: '每月1号前缴纳',
  },
  {
    id: '2',
    title: '健身锻炼',
    time: new Date(Date.now() + 3600000 * 2),
    repeat: 'daily',
    status: 'pending',
    notes: '下午6点健身房',
  },
  {
    id: '3',
    title: '学习英语',
    time: new Date(Date.now() + 3600000 * 8),
    repeat: 'daily',
    status: 'pending',
  },
  {
    id: '4',
    title: '信用卡还款',
    time: new Date(Date.now() - 86400000),
    repeat: 'monthly',
    status: 'completed',
    notes: '每月15号',
  },
  {
    id: '5',
    title: '周报提交',
    time: new Date(Date.now() + 86400000 * 2),
    repeat: 'weekly',
    status: 'pending',
    notes: '每周五下午',
  },
  {
    id: '6',
    title: '体检预约',
    time: new Date(Date.now() - 3600000 * 2),
    repeat: 'none',
    status: 'overdue',
    notes: '去医院体检中心',
  },
];

const mockAddresses: Address[] = [
  {
    id: '1',
    name: '家',
    category: 'home',
    location: '北京市朝阳区建国路88号阳光花园小区3号楼1单元101室',
    contact: '张三',
    phone: '138****1234',
    notes: '快递地址',
  },
  {
    id: '2',
    name: '公司',
    category: 'work',
    location: '北京市海淀区中关村大街1号科技大厦A座15层',
    contact: '前台',
    phone: '010-8888****',
    notes: '工作日收件地址',
  },
  {
    id: '3',
    name: '父母家',
    category: 'family',
    location: '上海市浦东新区陆家嘴环路1000号金融中心2号楼2202室',
    contact: '父亲',
    phone: '139****5678',
  },
  {
    id: '4',
    name: '常用快递柜',
    category: 'other',
    location: '小区东门丰巢快递柜 A区',
    notes: '大件快递存放点',
  },
];

const mockCardRecords: CardRecord[] = [
  {
    id: '1',
    type: 'id',
    name: '身份证',
    number: '110************1234',
    holder: '张三',
    notes: '有效期至2030年',
  },
  {
    id: '2',
    type: 'bank',
    name: '工商银行储蓄卡',
    number: '6222************5678',
    holder: '张三',
  },
  {
    id: '3',
    type: 'credit',
    name: '招商银行信用卡',
    number: '6214************9012',
    holder: '张三',
    expiryDate: '2027/08',
    notes: '额度5万，账单日15号',
  },
  {
    id: '4',
    type: 'social',
    name: '社保卡',
    number: '110************3456',
    holder: '张三',
  },
  {
    id: '5',
    type: 'other',
    name: '驾照',
    number: '1101**********78',
    holder: '张三',
    notes: 'C1驾照，2025年换证',
  },
];

// ============== 辅助函数和配置 ==============

const financeCategoryColors: Record<string, string> = {
  工资: 'bg-green-100 text-green-700 border-green-200',
  副业: 'bg-teal-100 text-teal-700 border-teal-200',
  餐饮: 'bg-orange-100 text-orange-700 border-orange-200',
  交通: 'bg-blue-100 text-blue-700 border-blue-200',
  购物: 'bg-pink-100 text-pink-700 border-pink-200',
  娱乐: 'bg-purple-100 text-purple-700 border-purple-200',
  医疗: 'bg-red-100 text-red-700 border-red-200',
  教育: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  其他: 'bg-gray-100 text-gray-700 border-gray-200',
};

const reminderStatusColors: Record<string, string> = {
  pending: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
};

const reminderStatusLabels: Record<string, string> = {
  pending: '待处理',
  completed: '已完成',
  overdue: '已过期',
};

const repeatLabels: Record<string, string> = {
  none: '不重复',
  daily: '每天',
  weekly: '每周',
  monthly: '每月',
};

const addressCategoryIcons: Record<string, React.ReactNode> = {
  home: <Home className="w-4 h-4" />,
  work: <Briefcase className="w-4 h-4" />,
  family: <User className="w-4 h-4" />,
  other: <MapPin className="w-4 h-4" />,
};

const addressCategoryLabels: Record<string, string> = {
  home: '家庭',
  work: '工作',
  family: '家人',
  other: '其他',
};

const cardTypeIcons: Record<string, React.ReactNode> = {
  id: <FileText className="w-4 h-4" />,
  bank: <Building className="w-4 h-4" />,
  credit: <CreditCard className="w-4 h-4" />,
  social: <Shield className="w-4 h-4" />,
  other: <CardIcon className="w-4 h-4" />,
};

const cardTypeLabels: Record<string, string> = {
  id: '身份证件',
  bank: '银行卡',
  credit: '信用卡',
  social: '社保卡',
  other: '其他',
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// ============== 主组件 ==============

export function ToolsModule() {
  const [financeRecords, setFinanceRecords] = useState<FinanceRecord[]>(mockFinanceRecords);
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders);
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [cardRecords, setCardRecords] = useState<CardRecord[]>(mockCardRecords);
  const [activeTab, setActiveTab] = useState('finance');

  // Dialog states
  const [isAddFinanceOpen, setIsAddFinanceOpen] = useState(false);
  const [isAddReminderOpen, setIsAddReminderOpen] = useState(false);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);

  // Form states
  const [newFinance, setNewFinance] = useState({
    type: 'expense' as 'income' | 'expense',
    category: '餐饮',
    amount: 0,
    description: '',
  });
  const [newReminder, setNewReminder] = useState({
    title: '',
    time: '',
    repeat: 'none' as 'none' | 'daily' | 'weekly' | 'monthly',
    notes: '',
  });
  const [newAddress, setNewAddress] = useState({
    name: '',
    category: 'home' as 'home' | 'work' | 'family' | 'other',
    location: '',
    contact: '',
    phone: '',
    notes: '',
  });
  const [newCard, setNewCard] = useState({
    type: 'bank' as 'id' | 'bank' | 'credit' | 'social' | 'other',
    name: '',
    number: '',
    expiryDate: '',
    holder: '',
    notes: '',
  });

  // Search and filter states
  const [financeSearch, setFinanceSearch] = useState('');
  const [financeFilter, setFinanceFilter] = useState({
    type: 'all',
    category: 'all',
  });
  const [reminderSearch, setReminderSearch] = useState('');
  const [addressSearch, setAddressSearch] = useState('');
  const [cardSearch, setCardSearch] = useState('');

  // Card visibility state for hiding sensitive numbers
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());

  // 统计数据
  const totalIncome = financeRecords
    .filter(r => r.type === 'income')
    .reduce((sum, r) => sum + r.amount, 0);
  const totalExpense = financeRecords
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0);
  const balance = totalIncome - totalExpense;
  const pendingReminders = reminders.filter(r => r.status === 'pending').length;
  const overdueReminders = reminders.filter(r => r.status === 'overdue').length;

  // 财务记账操作
  const addFinanceRecord = () => {
    if (!newFinance.description.trim() || newFinance.amount <= 0) return;
    const record: FinanceRecord = {
      id: Date.now().toString(),
      ...newFinance,
      date: new Date(),
    };
    setFinanceRecords([record, ...financeRecords]);
    setNewFinance({ type: 'expense', category: '餐饮', amount: 0, description: '' });
    setIsAddFinanceOpen(false);
  };

  const deleteFinanceRecord = (id: string) => {
    setFinanceRecords(financeRecords.filter(r => r.id !== id));
  };

  // 事务提醒操作
  const addReminder = () => {
    if (!newReminder.title.trim() || !newReminder.time) return;
    const reminder: Reminder = {
      id: Date.now().toString(),
      title: newReminder.title,
      time: new Date(newReminder.time),
      repeat: newReminder.repeat,
      status: 'pending',
      notes: newReminder.notes,
    };
    setReminders([reminder, ...reminders]);
    setNewReminder({ title: '', time: '', repeat: 'none', notes: '' });
    setIsAddReminderOpen(false);
  };

  const toggleReminderStatus = (id: string) => {
    setReminders(reminders.map(r =>
      r.id === id
        ? { ...r, status: r.status === 'completed' ? 'pending' : 'completed' }
        : r
    ));
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  // 地址管理操作
  const addAddress = () => {
    if (!newAddress.name.trim() || !newAddress.location.trim()) return;
    const address: Address = {
      id: Date.now().toString(),
      ...newAddress,
    };
    setAddresses([address, ...addresses]);
    setNewAddress({ name: '', category: 'home', location: '', contact: '', phone: '', notes: '' });
    setIsAddAddressOpen(false);
  };

  const deleteAddress = (id: string) => {
    setAddresses(addresses.filter(a => a.id !== id));
  };

  const copyAddress = (location: string) => {
    navigator.clipboard.writeText(location);
  };

  // 证件卡片操作
  const addCardRecord = () => {
    if (!newCard.name.trim() || !newCard.number.trim()) return;
    const card: CardRecord = {
      id: Date.now().toString(),
      ...newCard,
    };
    setCardRecords([card, ...cardRecords]);
    setNewCard({ type: 'bank', name: '', number: '', expiryDate: '', holder: '', notes: '' });
    setIsAddCardOpen(false);
  };

  const deleteCardRecord = (id: string) => {
    setCardRecords(cardRecords.filter(c => c.id !== id));
  };

  const toggleCardVisibility = (id: string) => {
    setVisibleCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const copyCardNumber = (number: string) => {
    navigator.clipboard.writeText(number);
  };

  // 过滤后的数据
  const filteredFinanceRecords = financeRecords.filter(r => {
    const matchesSearch = r.description.includes(financeSearch) || r.category.includes(financeSearch);
    const matchesType = financeFilter.type === 'all' || r.type === financeFilter.type;
    const matchesCategory = financeFilter.category === 'all' || r.category === financeFilter.category;
    return matchesSearch && matchesType && matchesCategory;
  });

  const filteredReminders = reminders.filter(r =>
    r.title.includes(reminderSearch) || (r.notes?.includes(reminderSearch) ?? false)
  );

  const filteredAddresses = addresses.filter(a =>
    a.name.includes(addressSearch) || a.location.includes(addressSearch)
  );

  const filteredCards = cardRecords.filter(c =>
    c.name.includes(cardSearch) || c.number.includes(cardSearch)
  );

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* 模块头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wallet className="w-7 h-7 text-emerald-500" />
            生活工具
          </h1>
          <p className="text-muted-foreground">财务记账、事务提醒、地址管理、证件卡片</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-lg px-3">
            <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
            余额 ¥{balance.toLocaleString()}
          </Badge>
        </div>
      </div>

      {/* 核心数据卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-2xl font-bold text-green-600">¥{totalIncome.toLocaleString()}</span>
            </div>
            <p className="text-sm text-muted-foreground">本月收入</p>
            <p className="text-xs text-green-600 mt-1">
              {financeRecords.filter(r => r.type === 'income').length} 笔记录
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-rose-500/10 to-pink-500/10 border-rose-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-rose-500" />
              <span className="text-2xl font-bold text-rose-600">¥{totalExpense.toLocaleString()}</span>
            </div>
            <p className="text-sm text-muted-foreground">本月支出</p>
            <p className="text-xs text-rose-600 mt-1">
              {financeRecords.filter(r => r.type === 'expense').length} 笔记录
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-500" />
              <span className="text-2xl font-bold">{pendingReminders}</span>
            </div>
            <p className="text-sm text-muted-foreground">待处理提醒</p>
            <p className="text-xs text-red-500 mt-1">
              {overdueReminders} 项已过期
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-500" />
              <span className="text-2xl font-bold">{cardRecords.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">证件卡片</p>
            <p className="text-xs text-amber-600 mt-1">
              {addresses.length} 个地址
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 主要内容标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="finance" className="gap-1">
            <Wallet className="w-4 h-4" />
            <span className="hidden sm:inline">财务记账</span>
          </TabsTrigger>
          <TabsTrigger value="reminders" className="gap-1">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">事务提醒</span>
          </TabsTrigger>
          <TabsTrigger value="addresses" className="gap-1">
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">地址管理</span>
          </TabsTrigger>
          <TabsTrigger value="cards" className="gap-1">
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">证件卡片</span>
          </TabsTrigger>
        </TabsList>

        {/* 财务记账 */}
        <TabsContent value="finance" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-lg font-semibold">财务记录</h3>
            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索记录..."
                  value={financeSearch}
                  onChange={(e) => setFinanceSearch(e.target.value)}
                  className="pl-8 w-full sm:w-[180px]"
                />
              </div>
              <Select
                value={financeFilter.type}
                onValueChange={(value) => setFinanceFilter({ ...financeFilter, type: value })}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="income">收入</SelectItem>
                  <SelectItem value="expense">支出</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isAddFinanceOpen} onOpenChange={setIsAddFinanceOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1 shrink-0">
                    <Plus className="w-4 h-4" />
                    记一笔
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>添加财务记录</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={newFinance.type === 'income' ? 'default' : 'outline'}
                        onClick={() => setNewFinance({ ...newFinance, type: 'income' })}
                        className="w-full"
                      >
                        <TrendingUp className="w-4 h-4 mr-1" />
                        收入
                      </Button>
                      <Button
                        variant={newFinance.type === 'expense' ? 'default' : 'outline'}
                        onClick={() => setNewFinance({ ...newFinance, type: 'expense' })}
                        className="w-full"
                      >
                        <TrendingDown className="w-4 h-4 mr-1" />
                        支出
                      </Button>
                    </div>
                    <div>
                      <Label>金额</Label>
                      <Input
                        type="number"
                        value={newFinance.amount || ''}
                        onChange={(e) => setNewFinance({ ...newFinance, amount: Number(e.target.value) })}
                        placeholder="输入金额"
                      />
                    </div>
                    <div>
                      <Label>分类</Label>
                      <Select
                        value={newFinance.category}
                        onValueChange={(value) => setNewFinance({ ...newFinance, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {newFinance.type === 'income' ? (
                            <>
                              <SelectItem value="工资">工资</SelectItem>
                              <SelectItem value="副业">副业</SelectItem>
                              <SelectItem value="其他">其他</SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="餐饮">餐饮</SelectItem>
                              <SelectItem value="交通">交通</SelectItem>
                              <SelectItem value="购物">购物</SelectItem>
                              <SelectItem value="娱乐">娱乐</SelectItem>
                              <SelectItem value="医疗">医疗</SelectItem>
                              <SelectItem value="教育">教育</SelectItem>
                              <SelectItem value="其他">其他</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>说明</Label>
                      <Input
                        value={newFinance.description}
                        onChange={(e) => setNewFinance({ ...newFinance, description: e.target.value })}
                        placeholder="简短描述..."
                      />
                    </div>
                    <Button onClick={addFinanceRecord} className="w-full">添加记录</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <ScrollArea className="max-h-[500px] pr-4">
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredFinanceRecords.map((record, index) => (
                  <motion.div
                    key={record.id}
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ delay: index * 0.03 }}
                    layout
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center",
                              record.type === 'income'
                                ? "bg-green-100 text-green-600"
                                : "bg-rose-100 text-rose-600"
                            )}>
                              {record.type === 'income'
                                ? <TrendingUp className="w-5 h-5" />
                                : <TrendingDown className="w-5 h-5" />
                              }
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{record.description}</h4>
                                <Badge variant="outline" className={cn('text-xs', financeCategoryColors[record.category] || financeCategoryColors['其他'])}>
                                  {record.category}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {record.date.toLocaleDateString('zh-CN')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={cn(
                              "text-lg font-semibold",
                              record.type === 'income' ? "text-green-600" : "text-rose-600"
                            )}>
                              {record.type === 'income' ? '+' : '-'}¥{record.amount.toLocaleString()}
                            </span>
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
                                  onClick={() => deleteFinanceRecord(record.id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  删除
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* 事务提醒 */}
        <TabsContent value="reminders" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-lg font-semibold">提醒事项</h3>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索提醒..."
                  value={reminderSearch}
                  onChange={(e) => setReminderSearch(e.target.value)}
                  className="pl-8 w-full sm:w-[180px]"
                />
              </div>
              <Dialog open={isAddReminderOpen} onOpenChange={setIsAddReminderOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1 shrink-0">
                    <Plus className="w-4 h-4" />
                    添加提醒
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>添加提醒事项</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>标题</Label>
                      <Input
                        value={newReminder.title}
                        onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                        placeholder="提醒内容..."
                      />
                    </div>
                    <div>
                      <Label>时间</Label>
                      <Input
                        type="datetime-local"
                        value={newReminder.time}
                        onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>重复</Label>
                      <Select
                        value={newReminder.repeat}
                        onValueChange={(value: 'none' | 'daily' | 'weekly' | 'monthly') =>
                          setNewReminder({ ...newReminder, repeat: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">不重复</SelectItem>
                          <SelectItem value="daily">每天</SelectItem>
                          <SelectItem value="weekly">每周</SelectItem>
                          <SelectItem value="monthly">每月</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>备注</Label>
                      <Textarea
                        value={newReminder.notes}
                        onChange={(e) => setNewReminder({ ...newReminder, notes: e.target.value })}
                        placeholder="附加说明..."
                        rows={2}
                      />
                    </div>
                    <Button onClick={addReminder} className="w-full">添加提醒</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <ScrollArea className="max-h-[500px] pr-4">
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredReminders.map((reminder, index) => (
                  <motion.div
                    key={reminder.id}
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ delay: index * 0.03 }}
                    layout
                  >
                    <Card className={cn(
                      "hover:shadow-md transition-all cursor-pointer",
                      reminder.status === 'completed' && "opacity-60",
                      reminder.status === 'overdue' && "border-red-200 bg-red-50/50"
                    )}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleReminderStatus(reminder.id)}
                              className={cn(
                                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                reminder.status === 'completed'
                                  ? "bg-green-500 border-green-500 text-white"
                                  : reminder.status === 'overdue'
                                  ? "border-red-400 text-red-400"
                                  : "border-gray-300 hover:border-primary"
                              )}
                            >
                              {reminder.status === 'completed' && <CheckCircle2 className="w-4 h-4" />}
                              {reminder.status === 'overdue' && <AlertCircle className="w-4 h-4" />}
                            </button>
                            <div>
                              <h4 className={cn(
                                "font-medium",
                                reminder.status === 'completed' && "line-through"
                              )}>
                                {reminder.title}
                              </h4>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {reminder.time.toLocaleString('zh-CN', {
                                    month: 'numeric',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                                {reminder.repeat !== 'none' && (
                                  <Badge variant="secondary" className="text-xs">
                                    <RefreshCw className="w-3 h-3 mr-1" />
                                    {repeatLabels[reminder.repeat]}
                                  </Badge>
                                )}
                              </div>
                              {reminder.notes && (
                                <p className="text-xs text-muted-foreground mt-1">{reminder.notes}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={cn('text-xs', reminderStatusColors[reminder.status])}>
                              {reminderStatusLabels[reminder.status]}
                            </Badge>
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
                                  onClick={() => deleteReminder(reminder.id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  删除
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* 地址管理 */}
        <TabsContent value="addresses" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-lg font-semibold">地址列表</h3>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索地址..."
                  value={addressSearch}
                  onChange={(e) => setAddressSearch(e.target.value)}
                  className="pl-8 w-full sm:w-[180px]"
                />
              </div>
              <Dialog open={isAddAddressOpen} onOpenChange={setIsAddAddressOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1 shrink-0">
                    <Plus className="w-4 h-4" />
                    添加地址
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>添加新地址</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>名称</Label>
                        <Input
                          value={newAddress.name}
                          onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                          placeholder="如：家、公司"
                        />
                      </div>
                      <div>
                        <Label>分类</Label>
                        <Select
                          value={newAddress.category}
                          onValueChange={(value: 'home' | 'work' | 'family' | 'other') =>
                            setNewAddress({ ...newAddress, category: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="home">家庭</SelectItem>
                            <SelectItem value="work">工作</SelectItem>
                            <SelectItem value="family">家人</SelectItem>
                            <SelectItem value="other">其他</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label>详细地址</Label>
                      <Textarea
                        value={newAddress.location}
                        onChange={(e) => setNewAddress({ ...newAddress, location: e.target.value })}
                        placeholder="省市区街道门牌号..."
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>联系人</Label>
                        <Input
                          value={newAddress.contact}
                          onChange={(e) => setNewAddress({ ...newAddress, contact: e.target.value })}
                          placeholder="联系人姓名"
                        />
                      </div>
                      <div>
                        <Label>电话</Label>
                        <Input
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                          placeholder="联系电话"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>备注</Label>
                      <Input
                        value={newAddress.notes}
                        onChange={(e) => setNewAddress({ ...newAddress, notes: e.target.value })}
                        placeholder="附加说明..."
                      />
                    </div>
                    <Button onClick={addAddress} className="w-full">添加地址</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredAddresses.map((address, index) => (
                <motion.div
                  key={address.id}
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <Card className="hover:shadow-md transition-shadow h-full">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            address.category === 'home' && "bg-blue-100 text-blue-600",
                            address.category === 'work' && "bg-amber-100 text-amber-600",
                            address.category === 'family' && "bg-pink-100 text-pink-600",
                            address.category === 'other' && "bg-gray-100 text-gray-600"
                          )}>
                            {addressCategoryIcons[address.category]}
                          </div>
                          <div>
                            <h4 className="font-medium">{address.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {addressCategoryLabels[address.category]}
                            </Badge>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => copyAddress(address.location)}>
                              <Copy className="w-4 h-4 mr-2" />
                              复制地址
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit2 className="w-4 h-4 mr-2" />
                              编辑
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => deleteAddress(address.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              删除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {address.location}
                      </p>

                      <Separator className="my-2" />

                      <div className="space-y-1 text-sm">
                        {address.contact && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="w-3 h-3" />
                            <span>{address.contact}</span>
                          </div>
                        )}
                        {address.phone && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            <span>{address.phone}</span>
                          </div>
                        )}
                        {address.notes && (
                          <p className="text-xs text-muted-foreground mt-2">{address.notes}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>

        {/* 证件卡片 */}
        <TabsContent value="cards" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-lg font-semibold">证件卡片</h3>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索卡片..."
                  value={cardSearch}
                  onChange={(e) => setCardSearch(e.target.value)}
                  className="pl-8 w-full sm:w-[180px]"
                />
              </div>
              <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1 shrink-0">
                    <Plus className="w-4 h-4" />
                    添加卡片
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>添加证件卡片</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>卡片类型</Label>
                        <Select
                          value={newCard.type}
                          onValueChange={(value: 'id' | 'bank' | 'credit' | 'social' | 'other') =>
                            setNewCard({ ...newCard, type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="id">身份证件</SelectItem>
                            <SelectItem value="bank">银行卡</SelectItem>
                            <SelectItem value="credit">信用卡</SelectItem>
                            <SelectItem value="social">社保卡</SelectItem>
                            <SelectItem value="other">其他</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>名称</Label>
                        <Input
                          value={newCard.name}
                          onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                          placeholder="卡片名称"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>卡号</Label>
                      <Input
                        value={newCard.number}
                        onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                        placeholder="证件号码/卡号"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>持卡人</Label>
                        <Input
                          value={newCard.holder}
                          onChange={(e) => setNewCard({ ...newCard, holder: e.target.value })}
                          placeholder="持卡人姓名"
                        />
                      </div>
                      <div>
                        <Label>有效期</Label>
                        <Input
                          value={newCard.expiryDate}
                          onChange={(e) => setNewCard({ ...newCard, expiryDate: e.target.value })}
                          placeholder="如：2027/08"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>备注</Label>
                      <Input
                        value={newCard.notes}
                        onChange={(e) => setNewCard({ ...newCard, notes: e.target.value })}
                        placeholder="附加说明..."
                      />
                    </div>
                    <Button onClick={addCardRecord} className="w-full">添加卡片</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <Card className={cn(
                    "hover:shadow-md transition-all overflow-hidden",
                    card.type === 'credit' && "bg-gradient-to-br from-slate-800 to-slate-900 text-white",
                    card.type === 'bank' && "bg-gradient-to-br from-blue-600 to-blue-800 text-white",
                    card.type === 'id' && "bg-gradient-to-br from-emerald-500 to-teal-600 text-white",
                    card.type === 'social' && "bg-gradient-to-br from-red-500 to-rose-600 text-white",
                    card.type === 'other' && "bg-gradient-to-br from-gray-100 to-gray-200"
                  )}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            card.type === 'other' ? "bg-gray-200 text-gray-700" : "bg-white/20"
                          )}>
                            {cardTypeIcons[card.type]}
                          </div>
                          <div>
                            <h4 className="font-medium">{card.name}</h4>
                            <Badge variant="outline" className={cn(
                              "text-xs",
                              card.type !== 'other' && "border-white/30 text-white"
                            )}>
                              {cardTypeLabels[card.type]}
                            </Badge>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className={cn(
                              "h-8 w-8",
                              card.type !== 'other' && "text-white hover:bg-white/10"
                            )}>
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => toggleCardVisibility(card.id)}>
                              {visibleCards.has(card.id) ? (
                                <>
                                  <EyeOff className="w-4 h-4 mr-2" />
                                  隐藏卡号
                                </>
                              ) : (
                                <>
                                  <Eye className="w-4 h-4 mr-2" />
                                  显示完整卡号
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => copyCardNumber(card.number)}>
                              <Copy className="w-4 h-4 mr-2" />
                              复制卡号
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => deleteCardRecord(card.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              删除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="space-y-2">
                        <div className={cn(
                          "text-lg font-mono tracking-wider",
                          card.type === 'other' && "text-gray-700"
                        )}>
                          {visibleCards.has(card.id)
                            ? card.number
                            : card.number.replace(/\*(?!\*)/g, '•')
                          }
                        </div>
                        <div className={cn(
                          "flex items-center justify-between text-sm",
                          card.type === 'other' ? "text-gray-500" : "text-white/70"
                        )}>
                          <span>{card.holder || '-'}</span>
                          {card.expiryDate && <span>有效期: {card.expiryDate}</span>}
                        </div>
                      </div>

                      {card.notes && (
                        <p className={cn(
                          "text-xs mt-3 pt-2 border-t",
                          card.type === 'other' ? "text-gray-500 border-gray-300" : "text-white/50 border-white/20"
                        )}>
                          {card.notes}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
