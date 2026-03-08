'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Plus,
  Search,
  Edit2,
  Trash2,
  FileText,
  Calendar,
  PieChart,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard,
  Receipt,
  Layers,
  Copy,
  MoreVertical,
  CheckCircle2,
  Clock,
  Sparkles,
  X,
  Download,
  Filter,
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

interface Project {
  id: string;
  name: string;
  type: 'consulting' | 'freelance' | 'ecommerce' | 'content' | 'other';
  status: 'active' | 'paused' | 'completed';
  startDate: Date;
  totalRevenue: number;
  totalExpense: number;
  description: string;
  color: string;
}

interface Transaction {
  id: string;
  projectId: string;
  projectName: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: Date;
  note: string;
}

interface Template {
  id: string;
  name: string;
  category: 'marketing' | 'finance' | 'operation' | 'content' | 'other';
  content: string;
  usageCount: number;
  createdAt: Date;
  tags: string[];
}

interface Statistics {
  month: string;
  revenue: number;
  expense: number;
  profit: number;
}

// ============== 模拟数据 ==============

const mockProjects: Project[] = [
  {
    id: '1',
    name: '在线编程教学',
    type: 'content',
    status: 'active',
    startDate: new Date('2024-01-15'),
    totalRevenue: 45000,
    totalExpense: 8500,
    description: '通过在线平台提供编程教学服务',
    color: '#10b981',
  },
  {
    id: '2',
    name: '设计接单工作室',
    type: 'freelance',
    status: 'active',
    startDate: new Date('2024-03-01'),
    totalRevenue: 28000,
    totalExpense: 4200,
    description: '承接UI/UX设计项目',
    color: '#8b5cf6',
  },
  {
    id: '3',
    name: '淘宝店铺运营',
    type: 'ecommerce',
    status: 'active',
    startDate: new Date('2024-02-20'),
    totalRevenue: 65000,
    totalExpense: 32000,
    description: '经营家居装饰品类电商',
    color: '#f59e0b',
  },
  {
    id: '4',
    name: '企业管理咨询',
    type: 'consulting',
    status: 'paused',
    startDate: new Date('2023-09-01'),
    totalRevenue: 120000,
    totalExpense: 15000,
    description: '中小企业数字化转型咨询',
    color: '#3b82f6',
  },
  {
    id: '5',
    name: '短视频内容创作',
    type: 'content',
    status: 'active',
    startDate: new Date('2024-05-01'),
    totalRevenue: 12000,
    totalExpense: 3800,
    description: '抖音/小红书内容变现',
    color: '#ec4899',
  },
];

const mockTransactions: Transaction[] = [
  {
    id: '1',
    projectId: '1',
    projectName: '在线编程教学',
    type: 'income',
    amount: 3500,
    category: '课程收入',
    date: new Date('2024-12-01'),
    note: '12月课程费用',
  },
  {
    id: '2',
    projectId: '3',
    projectName: '淘宝店铺运营',
    type: 'expense',
    amount: 2800,
    category: '进货成本',
    date: new Date('2024-12-03'),
    note: '新款商品进货',
  },
  {
    id: '3',
    projectId: '2',
    projectName: '设计接单工作室',
    type: 'income',
    amount: 5600,
    category: '项目收入',
    date: new Date('2024-12-05'),
    note: '企业官网设计项目',
  },
  {
    id: '4',
    projectId: '1',
    projectName: '在线编程教学',
    type: 'expense',
    amount: 500,
    category: '平台费用',
    date: new Date('2024-12-08'),
    note: '平台服务费',
  },
  {
    id: '5',
    projectId: '5',
    projectName: '短视频内容创作',
    type: 'income',
    amount: 2200,
    category: '广告收入',
    date: new Date('2024-12-10'),
    note: '品牌合作推广',
  },
  {
    id: '6',
    projectId: '3',
    projectName: '淘宝店铺运营',
    type: 'income',
    amount: 8500,
    category: '销售收入',
    date: new Date('2024-12-12'),
    note: '双12促销收入',
  },
  {
    id: '7',
    projectId: '2',
    projectName: '设计接单工作室',
    type: 'expense',
    amount: 1200,
    category: '软件订阅',
    date: new Date('2024-12-15'),
    note: '设计软件年度订阅',
  },
];

const mockTemplates: Template[] = [
  {
    id: '1',
    name: '客户需求调研模板',
    category: 'marketing',
    content: '## 客户基本信息\n- 公司名称：\n- 联系人：\n- 行业领域：\n\n## 需求描述\n- 核心需求：\n- 期望效果：\n- 预算范围：\n- 时间要求：\n\n## 痛点分析\n- 当前问题：\n- 影响程度：',
    usageCount: 28,
    createdAt: new Date('2024-06-15'),
    tags: ['调研', '需求', '客户'],
  },
  {
    id: '2',
    name: '项目报价单模板',
    category: 'finance',
    content: '## 报价单\n\n**项目名称：**\n**报价日期：**\n**有效期：** 30天\n\n| 序号 | 服务项目 | 描述 | 单价 | 数量 | 小计 |\n|------|----------|------|------|------|------|\n| 1 | | | | | |\n\n**总计：** ¥\n\n**付款方式：**\n- 预付款：50%\n- 尾款：项目交付后结清',
    usageCount: 45,
    createdAt: new Date('2024-04-20'),
    tags: ['报价', '财务', '合同'],
  },
  {
    id: '3',
    name: '每日运营检查清单',
    category: 'operation',
    content: '## 每日运营检查清单\n\n### 上午\n- [ ] 检查订单状态\n- [ ] 回复客户消息\n- [ ] 更新库存数据\n- [ ] 发布社交媒体内容\n\n### 下午\n- [ ] 处理售后问题\n- [ ] 数据统计录入\n- [ ] 对接供应商\n\n### 晚上\n- [ ] 复盘当日运营\n- [ ] 规划明日任务',
    usageCount: 120,
    createdAt: new Date('2024-03-10'),
    tags: ['运营', '检查清单', '日常'],
  },
  {
    id: '4',
    name: '短视频脚本模板',
    category: 'content',
    content: '## 短视频脚本\n\n**主题：**\n**时长：** 秒\n**风格：**\n\n### 脚本结构\n\n**开头（3秒）：** 钩子 - \n\n**中间（主体）：**\n1. \n2. \n3. \n\n**结尾（5秒）：** 引导互动 - \n\n### 拍摄要求\n- 场景：\n- 道具：\n- 音乐：',
    usageCount: 35,
    createdAt: new Date('2024-07-01'),
    tags: ['视频', '脚本', '内容创作'],
  },
  {
    id: '5',
    name: '月度财务报表模板',
    category: 'finance',
    content: '## 月度财务报表\n\n**月份：**\n**项目：**\n\n### 收入明细\n| 来源 | 金额 | 占比 |\n|------|------|------|\n| | | |\n\n**收入合计：** ¥\n\n### 支出明细\n| 类别 | 金额 | 占比 |\n|------|------|------|\n| | | |\n\n**支出合计：** ¥\n\n### 本月利润：**¥**\n\n### 环比分析\n- 收入变化：\n- 支出变化：\n- 利润变化：',
    usageCount: 52,
    createdAt: new Date('2024-05-15'),
    tags: ['财务', '报表', '月度'],
  },
];

const mockStatistics: Statistics[] = [
  { month: '2024-07', revenue: 28000, expense: 12000, profit: 16000 },
  { month: '2024-08', revenue: 32000, expense: 14500, profit: 17500 },
  { month: '2024-09', revenue: 25000, expense: 11000, profit: 14000 },
  { month: '2024-10', revenue: 38000, expense: 16000, profit: 22000 },
  { month: '2024-11', revenue: 42000, expense: 18000, profit: 24000 },
  { month: '2024-12', revenue: 35000, expense: 15000, profit: 20000 },
];

// ============== 辅助函数和配置 ==============

const projectTypeLabels: Record<string, string> = {
  consulting: '咨询顾问',
  freelance: '自由职业',
  ecommerce: '电商运营',
  content: '内容创作',
  other: '其他',
};

const projectTypeColors: Record<string, string> = {
  consulting: 'bg-blue-100 text-blue-700 border-blue-200',
  freelance: 'bg-purple-100 text-purple-700 border-purple-200',
  ecommerce: 'bg-amber-100 text-amber-700 border-amber-200',
  content: 'bg-pink-100 text-pink-700 border-pink-200',
  other: 'bg-gray-100 text-gray-700 border-gray-200',
};

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700 border-green-200',
  paused: 'bg-amber-100 text-amber-700 border-amber-200',
  completed: 'bg-gray-100 text-gray-700 border-gray-200',
};

const statusLabels: Record<string, string> = {
  active: '运营中',
  paused: '已暂停',
  completed: '已完成',
};

const categoryLabels: Record<string, string> = {
  marketing: '营销推广',
  finance: '财务管理',
  operation: '运营管理',
  content: '内容创作',
  other: '其他',
};

const categoryColors: Record<string, string> = {
  marketing: 'bg-rose-100 text-rose-700 border-rose-200',
  finance: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  operation: 'bg-blue-100 text-blue-700 border-blue-200',
  content: 'bg-violet-100 text-violet-700 border-violet-200',
  other: 'bg-gray-100 text-gray-700 border-gray-200',
};

const categoryIcons: Record<string, typeof DollarSign> = {
  marketing: Target,
  finance: DollarSign,
  operation: Layers,
  content: FileText,
  other: FileText,
};

const expenseCategories = ['进货成本', '广告投放', '软件订阅', '平台费用', '人员开支', '其他'];
const incomeCategories = ['课程收入', '项目收入', '销售收入', '广告收入', '咨询服务', '其他'];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

// ============== 主组件 ==============

export function SidejobModule() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [activeTab, setActiveTab] = useState('projects');

  // Dialog states
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isAddTemplateOpen, setIsAddTemplateOpen] = useState(false);
  const [isViewTemplateOpen, setIsViewTemplateOpen] = useState(false);

  // Form states
  const [newProject, setNewProject] = useState({
    name: '',
    type: 'other' as Project['type'],
    description: '',
    color: '#10b981',
  });
  const [newTransaction, setNewTransaction] = useState({
    projectId: '',
    type: 'income' as 'income' | 'expense',
    amount: 0,
    category: '',
    note: '',
  });
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    category: 'other' as Template['category'],
    content: '',
    tags: '',
  });
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  // Search and filter states
  const [projectSearch, setProjectSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState({
    type: 'all',
    status: 'all',
  });
  const [transactionSearch, setTransactionSearch] = useState('');
  const [transactionFilter, setTransactionFilter] = useState({
    type: 'all',
    projectId: 'all',
  });
  const [templateSearch, setTemplateSearch] = useState('');
  const [templateFilter, setTemplateFilter] = useState('all');

  // 统计数据
  const totalRevenue = projects.reduce((sum, p) => sum + p.totalRevenue, 0);
  const totalExpense = projects.reduce((sum, p) => sum + p.totalExpense, 0);
  const totalProfit = totalRevenue - totalExpense;
  const profitMargin = totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0;
  const activeProjects = projects.filter(p => p.status === 'active').length;

  // 项目管理操作
  const addProject = () => {
    if (!newProject.name.trim()) return;
    const project: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      type: newProject.type,
      status: 'active',
      startDate: new Date(),
      totalRevenue: 0,
      totalExpense: 0,
      description: newProject.description,
      color: newProject.color,
    };
    setProjects([...projects, project]);
    setNewProject({ name: '', type: 'other', description: '', color: '#10b981' });
    setIsAddProjectOpen(false);
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const updateProjectStatus = (id: string, status: Project['status']) => {
    setProjects(projects.map(p => p.id === id ? { ...p, status } : p));
  };

  // 收支记录操作
  const addTransaction = () => {
    if (!newTransaction.projectId || newTransaction.amount <= 0) return;
    const project = projects.find(p => p.id === newTransaction.projectId);
    if (!project) return;

    const transaction: Transaction = {
      id: Date.now().toString(),
      projectId: newTransaction.projectId,
      projectName: project.name,
      type: newTransaction.type,
      amount: newTransaction.amount,
      category: newTransaction.category,
      date: new Date(),
      note: newTransaction.note,
    };

    setTransactions([transaction, ...transactions]);

    // 更新项目统计
    setProjects(projects.map(p => {
      if (p.id === newTransaction.projectId) {
        return {
          ...p,
          totalRevenue: newTransaction.type === 'income' ? p.totalRevenue + newTransaction.amount : p.totalRevenue,
          totalExpense: newTransaction.type === 'expense' ? p.totalExpense + newTransaction.amount : p.totalExpense,
        };
      }
      return p;
    }));

    setNewTransaction({ projectId: '', type: 'income', amount: 0, category: '', note: '' });
    setIsAddTransactionOpen(false);
  };

  const deleteTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;

    setTransactions(transactions.filter(t => t.id !== id));

    // 更新项目统计
    setProjects(projects.map(p => {
      if (p.id === transaction.projectId) {
        return {
          ...p,
          totalRevenue: transaction.type === 'income' ? p.totalRevenue - transaction.amount : p.totalRevenue,
          totalExpense: transaction.type === 'expense' ? p.totalExpense - transaction.amount : p.totalExpense,
        };
      }
      return p;
    }));
  };

  // 模板操作
  const addTemplate = () => {
    if (!newTemplate.name.trim() || !newTemplate.content.trim()) return;
    const template: Template = {
      id: Date.now().toString(),
      name: newTemplate.name,
      category: newTemplate.category,
      content: newTemplate.content,
      usageCount: 0,
      createdAt: new Date(),
      tags: newTemplate.tags.split(/[,，]/).map(t => t.trim()).filter(Boolean),
    };
    setTemplates([...templates, template]);
    setNewTemplate({ name: '', category: 'other', content: '', tags: '' });
    setIsAddTemplateOpen(false);
  };

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  const copyTemplateContent = (template: Template) => {
    setTemplates(templates.map(t => 
      t.id === template.id ? { ...t, usageCount: t.usageCount + 1 } : t
    ));
    navigator.clipboard.writeText(template.content);
  };

  // 过滤后的数据
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.includes(projectSearch) || p.description.includes(projectSearch);
    const matchesType = projectFilter.type === 'all' || p.type === projectFilter.type;
    const matchesStatus = projectFilter.status === 'all' || p.status === projectFilter.status;
    return matchesSearch && matchesType && matchesStatus;
  });

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.note.includes(transactionSearch) || t.category.includes(transactionSearch);
    const matchesType = transactionFilter.type === 'all' || t.type === transactionFilter.type;
    const matchesProject = transactionFilter.projectId === 'all' || t.projectId === transactionFilter.projectId;
    return matchesSearch && matchesType && matchesProject;
  });

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.includes(templateSearch) || t.tags.some(tag => tag.includes(templateSearch));
    const matchesCategory = templateFilter === 'all' || t.category === templateFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* 模块头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-emerald-500" />
            副业增收
          </h1>
          <p className="text-muted-foreground">项目管理、收支记录、运营模板、数据统计</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-lg px-3">
            <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
            利润率 {profitMargin}%
          </Badge>
        </div>
      </div>

      {/* 核心数据卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-500" />
              <span className="text-2xl font-bold">{formatCurrency(totalRevenue)}</span>
            </div>
            <p className="text-sm text-muted-foreground">总收入</p>
            <p className="text-xs text-emerald-600 mt-1">
              <ArrowUpRight className="w-3 h-3 inline mr-1" />
              环比 +12.5%
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-rose-500/10 to-pink-500/10 border-rose-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-rose-500" />
              <span className="text-2xl font-bold">{formatCurrency(totalExpense)}</span>
            </div>
            <p className="text-sm text-muted-foreground">总支出</p>
            <p className="text-xs text-rose-600 mt-1">
              <ArrowDownRight className="w-3 h-3 inline mr-1" />
              环比 -5.2%
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-500" />
              <span className="text-2xl font-bold">{formatCurrency(totalProfit)}</span>
            </div>
            <p className="text-sm text-muted-foreground">净利润</p>
            <p className="text-xs text-blue-600 mt-1">
              {activeProjects} 个项目在运营
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-500" />
              <span className="text-2xl font-bold">{projects.length}</span>
            </div>
            <p className="text-sm text-muted-foreground">项目总数</p>
            <p className="text-xs text-purple-600 mt-1">
              本月新增 {transactions.length} 笔交易
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 主要内容标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="projects" className="gap-1">
            <Briefcase className="w-4 h-4" />
            <span className="hidden sm:inline">项目管理</span>
          </TabsTrigger>
          <TabsTrigger value="transactions" className="gap-1">
            <Receipt className="w-4 h-4" />
            <span className="hidden sm:inline">收支记录</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="gap-1">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">运营模板</span>
          </TabsTrigger>
          <TabsTrigger value="statistics" className="gap-1">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">数据统计</span>
          </TabsTrigger>
        </TabsList>

        {/* 项目管理 */}
        <TabsContent value="projects" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-lg font-semibold">项目列表</h3>
            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索项目..."
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  className="pl-8 w-full sm:w-[180px]"
                />
              </div>
              <Select
                value={projectFilter.type}
                onValueChange={(value) => setProjectFilter({ ...projectFilter, type: value })}
              >
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="consulting">咨询顾问</SelectItem>
                  <SelectItem value="freelance">自由职业</SelectItem>
                  <SelectItem value="ecommerce">电商运营</SelectItem>
                  <SelectItem value="content">内容创作</SelectItem>
                  <SelectItem value="other">其他</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={projectFilter.status}
                onValueChange={(value) => setProjectFilter({ ...projectFilter, status: value })}
              >
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="active">运营中</SelectItem>
                  <SelectItem value="paused">已暂停</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1 shrink-0">
                    <Plus className="w-4 h-4" />
                    新建项目
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>新建项目</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>项目名称</Label>
                      <Input
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                        placeholder="输入项目名称"
                      />
                    </div>
                    <div>
                      <Label>项目类型</Label>
                      <Select
                        value={newProject.type}
                        onValueChange={(value: Project['type']) => setNewProject({ ...newProject, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="consulting">咨询顾问</SelectItem>
                          <SelectItem value="freelance">自由职业</SelectItem>
                          <SelectItem value="ecommerce">电商运营</SelectItem>
                          <SelectItem value="content">内容创作</SelectItem>
                          <SelectItem value="other">其他</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>项目描述</Label>
                      <Textarea
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        placeholder="简要描述项目内容..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>标识颜色</Label>
                      <div className="flex gap-2 mt-2">
                        {['#10b981', '#8b5cf6', '#f59e0b', '#3b82f6', '#ec4899', '#ef4444'].map(color => (
                          <button
                            key={color}
                            onClick={() => setNewProject({ ...newProject, color })}
                            className={cn(
                              "w-8 h-8 rounded-full border-2 transition-all",
                              newProject.color === color ? "border-foreground scale-110" : "border-transparent"
                            )}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    <Button onClick={addProject} className="w-full">创建项目</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
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
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: project.color }}
                          >
                            {project.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-medium">{project.name}</h4>
                            <div className="flex items-center gap-2 text-sm">
                              <Badge variant="outline" className={cn('text-xs', projectTypeColors[project.type])}>
                                {projectTypeLabels[project.type]}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => updateProjectStatus(project.id, 'active')}>
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              设为运营中
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateProjectStatus(project.id, 'paused')}>
                              <Clock className="w-4 h-4 mr-2" />
                              设为暂停
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateProjectStatus(project.id, 'completed')}>
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              设为已完成
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => deleteProject(project.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              删除项目
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <Badge className={cn('mt-2', statusColors[project.status])}>
                        {statusLabels[project.status]}
                      </Badge>

                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {project.description}
                      </p>

                      <Separator className="my-3" />

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">收入</span>
                          <span className="text-emerald-600 font-medium">{formatCurrency(project.totalRevenue)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">支出</span>
                          <span className="text-rose-600 font-medium">{formatCurrency(project.totalExpense)}</span>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">利润</span>
                          <span className={cn(
                            "font-bold",
                            project.totalRevenue - project.totalExpense >= 0 ? "text-emerald-600" : "text-rose-600"
                          )}>
                            {formatCurrency(project.totalRevenue - project.totalExpense)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        开始于 {formatDate(project.startDate)}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>

        {/* 收支记录 */}
        <TabsContent value="transactions" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-lg font-semibold">收支记录</h3>
            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索记录..."
                  value={transactionSearch}
                  onChange={(e) => setTransactionSearch(e.target.value)}
                  className="pl-8 w-full sm:w-[180px]"
                />
              </div>
              <Select
                value={transactionFilter.type}
                onValueChange={(value) => setTransactionFilter({ ...transactionFilter, type: value })}
              >
                <SelectTrigger className="w-[110px]">
                  <SelectValue placeholder="类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="income">收入</SelectItem>
                  <SelectItem value="expense">支出</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={transactionFilter.projectId}
                onValueChange={(value) => setTransactionFilter({ ...transactionFilter, projectId: value })}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="项目" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部项目</SelectItem>
                  {projects.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1 shrink-0">
                    <Plus className="w-4 h-4" />
                    新增记录
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>新增收支记录</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>关联项目</Label>
                      <Select
                        value={newTransaction.projectId}
                        onValueChange={(value) => setNewTransaction({ ...newTransaction, projectId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择项目" />
                        </SelectTrigger>
                        <SelectContent>
                          {projects.filter(p => p.status === 'active').map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>交易类型</Label>
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant={newTransaction.type === 'income' ? 'default' : 'outline'}
                          size="sm"
                          className="flex-1"
                          onClick={() => setNewTransaction({ ...newTransaction, type: 'income', category: '' })}
                        >
                          <TrendingUp className="w-4 h-4 mr-1" />
                          收入
                        </Button>
                        <Button
                          variant={newTransaction.type === 'expense' ? 'default' : 'outline'}
                          size="sm"
                          className="flex-1"
                          onClick={() => setNewTransaction({ ...newTransaction, type: 'expense', category: '' })}
                        >
                          <TrendingDown className="w-4 h-4 mr-1" />
                          支出
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label>金额</Label>
                      <Input
                        type="number"
                        value={newTransaction.amount || ''}
                        onChange={(e) => setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })}
                        placeholder="输入金额"
                      />
                    </div>
                    <div>
                      <Label>类别</Label>
                      <Select
                        value={newTransaction.category}
                        onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择类别" />
                        </SelectTrigger>
                        <SelectContent>
                          {(newTransaction.type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>备注</Label>
                      <Input
                        value={newTransaction.note}
                        onChange={(e) => setNewTransaction({ ...newTransaction, note: e.target.value })}
                        placeholder="添加备注说明..."
                      />
                    </div>
                    <Button onClick={addTransaction} className="w-full">添加记录</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card>
            <ScrollArea className="max-h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>日期</TableHead>
                    <TableHead>项目</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>类别</TableHead>
                    <TableHead className="text-right">金额</TableHead>
                    <TableHead>备注</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="popLayout">
                    {filteredTransactions.map((transaction, index) => (
                      <motion.tr
                        key={transaction.id}
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ delay: index * 0.02 }}
                        layout
                        className="border-b"
                      >
                        <TableCell className="whitespace-nowrap">
                          {formatDate(transaction.date)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {transaction.projectName}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {transaction.type === 'income' ? (
                            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              收入
                            </Badge>
                          ) : (
                            <Badge className="bg-rose-100 text-rose-700 border-rose-200">
                              <TrendingDown className="w-3 h-3 mr-1" />
                              支出
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{transaction.category}</TableCell>
                        <TableCell className={cn(
                          "text-right font-medium whitespace-nowrap",
                          transaction.type === 'income' ? "text-emerald-600" : "text-rose-600"
                        )}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                          {transaction.note}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => deleteTransaction(transaction.id)}
                          >
                            <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </ScrollArea>
          </Card>
        </TabsContent>

        {/* 运营模板 */}
        <TabsContent value="templates" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-lg font-semibold">运营模板库</h3>
            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索模板..."
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                  className="pl-8 w-full sm:w-[180px]"
                />
              </div>
              <Select
                value={templateFilter}
                onValueChange={setTemplateFilter}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部分类</SelectItem>
                  <SelectItem value="marketing">营销推广</SelectItem>
                  <SelectItem value="finance">财务管理</SelectItem>
                  <SelectItem value="operation">运营管理</SelectItem>
                  <SelectItem value="content">内容创作</SelectItem>
                  <SelectItem value="other">其他</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isAddTemplateOpen} onOpenChange={setIsAddTemplateOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1 shrink-0">
                    <Plus className="w-4 h-4" />
                    新建模板
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>新建运营模板</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>模板名称</Label>
                      <Input
                        value={newTemplate.name}
                        onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                        placeholder="输入模板名称"
                      />
                    </div>
                    <div>
                      <Label>分类</Label>
                      <Select
                        value={newTemplate.category}
                        onValueChange={(value: Template['category']) => setNewTemplate({ ...newTemplate, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="marketing">营销推广</SelectItem>
                          <SelectItem value="finance">财务管理</SelectItem>
                          <SelectItem value="operation">运营管理</SelectItem>
                          <SelectItem value="content">内容创作</SelectItem>
                          <SelectItem value="other">其他</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>模板内容</Label>
                      <Textarea
                        value={newTemplate.content}
                        onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                        placeholder="输入模板内容，支持 Markdown 格式..."
                        rows={10}
                        className="font-mono text-sm"
                      />
                    </div>
                    <div>
                      <Label>标签（逗号分隔）</Label>
                      <Input
                        value={newTemplate.tags}
                        onChange={(e) => setNewTemplate({ ...newTemplate, tags: e.target.value })}
                        placeholder="如：运营, 营销, 日常"
                      />
                    </div>
                    <Button onClick={addTemplate} className="w-full">创建模板</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredTemplates.map((template, index) => {
                const CategoryIcon = categoryIcons[template.category];
                return (
                  <motion.div
                    key={template.id}
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <Card className="hover:shadow-md transition-shadow h-full">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center",
                              categoryColors[template.category]
                            )}>
                              <CategoryIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-medium">{template.name}</h4>
                              <Badge variant="outline" className={cn('text-xs', categoryColors[template.category])}>
                                {categoryLabels[template.category]}
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
                              <DropdownMenuItem onClick={() => {
                                setSelectedTemplate(template);
                                setIsViewTemplateOpen(true);
                              }}>
                                <Edit2 className="w-4 h-4 mr-2" />
                                查看详情
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => copyTemplateContent(template)}>
                                <Copy className="w-4 h-4 mr-2" />
                                复制内容
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => deleteTemplate(template.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                删除模板
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="flex flex-wrap gap-1 mt-3">
                          {template.tags.map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <p className="text-sm text-muted-foreground mt-3 line-clamp-3 font-mono bg-muted/50 p-2 rounded">
                          {template.content.substring(0, 100)}...
                        </p>

                        <Separator className="my-3" />

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>使用 {template.usageCount} 次</span>
                          <span>{formatDate(template.createdAt)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* 模板详情弹窗 */}
          <Dialog open={isViewTemplateOpen} onOpenChange={setIsViewTemplateOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>{selectedTemplate?.name}</DialogTitle>
              </DialogHeader>
              {selectedTemplate && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge className={categoryColors[selectedTemplate.category]}>
                      {categoryLabels[selectedTemplate.category]}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      使用 {selectedTemplate.usageCount} 次
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedTemplate.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <ScrollArea className="max-h-[400px]">
                    <pre className="text-sm whitespace-pre-wrap bg-muted/50 p-4 rounded-lg font-mono">
                      {selectedTemplate.content}
                    </pre>
                  </ScrollArea>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsViewTemplateOpen(false)} className="flex-1">
                      关闭
                    </Button>
                    <Button
                      onClick={() => {
                        copyTemplateContent(selectedTemplate);
                        setIsViewTemplateOpen(false);
                      }}
                      className="flex-1"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      复制内容
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* 数据统计 */}
        <TabsContent value="statistics" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">数据统计分析</h3>
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="w-4 h-4" />
              导出报表
            </Button>
          </div>

          {/* 收支趋势 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                收支趋势（近6个月）
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockStatistics.map((stat, index) => {
                  const maxRevenue = Math.max(...mockStatistics.map(s => s.revenue));
                  const revenuePercent = (stat.revenue / maxRevenue) * 100;
                  const expensePercent = (stat.expense / maxRevenue) * 100;
                  return (
                    <motion.div
                      key={stat.month}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{stat.month}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-emerald-600">+{formatCurrency(stat.revenue)}</span>
                          <span className="text-rose-600">-{formatCurrency(stat.expense)}</span>
                          <span className={cn(
                            "font-bold",
                            stat.profit >= 0 ? "text-emerald-600" : "text-rose-600"
                          )}>
                            净利润 {formatCurrency(stat.profit)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1 h-3">
                        <div
                          className="bg-emerald-500 rounded-l"
                          style={{ width: `${revenuePercent}%` }}
                        />
                        <div
                          className="bg-rose-500 rounded-r"
                          style={{ width: `${expensePercent}%` }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-emerald-500 rounded" />
                  收入
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-rose-500 rounded" />
                  支出
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 项目收入分布 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-blue-500" />
                  项目收入分布
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {projects.slice(0, 5).map((project, index) => {
                    const percent = (project.totalRevenue / totalRevenue) * 100;
                    return (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="space-y-1"
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded"
                              style={{ backgroundColor: project.color }}
                            />
                            {project.name}
                          </span>
                          <span className="font-medium">{formatCurrency(project.totalRevenue)}</span>
                        </div>
                        <Progress value={percent} className="h-2" />
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* 支出类别分析 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-rose-500" />
                  支出类别分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { category: '进货成本', amount: 32800, percent: 52 },
                    { category: '广告投放', amount: 12500, percent: 20 },
                    { category: '平台费用', amount: 8500, percent: 14 },
                    { category: '软件订阅', amount: 5200, percent: 8 },
                    { category: '其他', amount: 3200, percent: 6 },
                  ].map((item, index) => (
                    <motion.div
                      key={item.category}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="space-y-1"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.category}</span>
                        <span className="font-medium">{formatCurrency(item.amount)}</span>
                      </div>
                      <Progress value={item.percent} className="h-2 bg-rose-100 [&>div]:bg-rose-500" />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 收入来源分析 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                收入来源分析
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: '课程收入', amount: 45000, growth: 15, icon: DollarSign },
                  { label: '项目收入', amount: 38000, growth: 8, icon: Briefcase },
                  { label: '销售收入', amount: 65000, growth: -3, icon: Wallet },
                  { label: '广告收入', amount: 12000, growth: 25, icon: Target },
                  { label: '咨询服务', amount: 28000, growth: 12, icon: Sparkles },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="text-center p-3 bg-muted/50 rounded-lg"
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-lg font-bold">{formatCurrency(item.amount)}</p>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className={cn(
                        "text-xs mt-1",
                        item.growth >= 0 ? "text-emerald-600" : "text-rose-600"
                      )}>
                        {item.growth >= 0 ? '+' : ''}{item.growth}%
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 关键指标 */}
          <Card className="bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10">
            <CardHeader>
              <CardTitle className="text-base">关键指标概览</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-600">{profitMargin}%</p>
                  <p className="text-sm text-muted-foreground">利润率</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {formatCurrency(Math.round(totalProfit / activeProjects))}
                  </p>
                  <p className="text-sm text-muted-foreground">平均项目利润</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">
                    {Math.round(mockStatistics.reduce((sum, s) => sum + s.revenue, 0) / 6).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">月均收入</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-amber-600">
                    +{(12.5).toFixed(1)}%
                  </p>
                  <p className="text-sm text-muted-foreground">环比增长</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
