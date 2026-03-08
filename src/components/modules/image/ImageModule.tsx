'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Shirt,
  Palette,
  Camera,
  Heart,
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  Sun,
  Moon,
  Droplets,
  Wind,
  Calendar,
  Eye,
  EyeOff,
  MoreVertical,
  Filter,
  RefreshCw,
  Wand2,
  CheckCircle2,
  Clock,
  TrendingUp,
  TrendingDown,
  Leaf,
  Zap,
  AlertCircle,
  ChevronRight,
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

interface WardrobeItem {
  id: string;
  name: string;
  category: 'tops' | 'bottoms' | 'outerwear' | 'shoes' | 'accessories';
  color: string;
  brand?: string;
  season: 'spring' | 'summer' | 'autumn' | 'winter' | 'all';
  image?: string;
  favorite: boolean;
  wearCount: number;
}

interface OutfitCombination {
  id: string;
  name: string;
  occasion: string;
  items: string[];
  rating: number;
  season: string;
  lastWorn?: Date;
  notes?: string;
}

interface SkinRecord {
  id: string;
  date: Date;
  skinType: 'oily' | 'dry' | 'combination' | 'normal' | 'sensitive';
  conditions: string[];
  hydration: number;
  oilLevel: number;
  notes?: string;
  imageUrl?: string;
}

interface SkincarePlan {
  id: string;
  name: string;
  time: 'morning' | 'evening';
  steps: SkincareStep[];
  isActive: boolean;
}

interface SkincareStep {
  id: string;
  name: string;
  product: string;
  duration: number;
  order: number;
  completed: boolean;
}

// ============== 模拟数据 ==============

const mockWardrobeItems: WardrobeItem[] = [
  {
    id: '1',
    name: '白色衬衫',
    category: 'tops',
    color: '白色',
    brand: 'UNIQLO',
    season: 'all',
    favorite: true,
    wearCount: 28,
  },
  {
    id: '2',
    name: '黑色西装外套',
    category: 'outerwear',
    color: '黑色',
    brand: 'ZARA',
    season: 'autumn',
    favorite: true,
    wearCount: 15,
  },
  {
    id: '3',
    name: '蓝色牛仔裤',
    category: 'bottoms',
    color: '深蓝',
    brand: 'Levi\'s',
    season: 'all',
    favorite: false,
    wearCount: 42,
  },
  {
    id: '4',
    name: '白色运动鞋',
    category: 'shoes',
    color: '白色',
    brand: 'Nike',
    season: 'all',
    favorite: true,
    wearCount: 35,
  },
  {
    id: '5',
    name: '米色风衣',
    category: 'outerwear',
    color: '米色',
    brand: 'H&M',
    season: 'spring',
    favorite: false,
    wearCount: 8,
  },
  {
    id: '6',
    name: '黑色皮带',
    category: 'accessories',
    color: '黑色',
    brand: 'Gentleman',
    season: 'all',
    favorite: false,
    wearCount: 20,
  },
  {
    id: '7',
    name: '灰色卫衣',
    category: 'tops',
    color: '灰色',
    brand: 'Champion',
    season: 'winter',
    favorite: true,
    wearCount: 18,
  },
  {
    id: '8',
    name: '卡其色休闲裤',
    category: 'bottoms',
    color: '卡其色',
    brand: 'GAP',
    season: 'autumn',
    favorite: false,
    wearCount: 12,
  },
  {
    id: '9',
    name: '黑色皮靴',
    category: 'shoes',
    color: '黑色',
    brand: 'Dr. Martens',
    season: 'winter',
    favorite: true,
    wearCount: 22,
  },
  {
    id: '10',
    name: '银色手表',
    category: 'accessories',
    color: '银色',
    brand: 'Daniel Wellington',
    season: 'all',
    favorite: true,
    wearCount: 50,
  },
];

const mockOutfits: OutfitCombination[] = [
  {
    id: '1',
    name: '商务休闲风',
    occasion: '工作',
    items: ['1', '2', '3', '4'],
    rating: 5,
    season: '秋季',
    lastWorn: new Date(Date.now() - 86400000 * 2),
    notes: '适合重要会议',
  },
  {
    id: '2',
    name: '周末休闲',
    occasion: '休闲',
    items: ['7', '8', '4'],
    rating: 4,
    season: '春秋',
    lastWorn: new Date(Date.now() - 86400000 * 5),
  },
  {
    id: '3',
    name: '正式场合',
    occasion: '正式',
    items: ['1', '2', '3', '9', '10'],
    rating: 5,
    season: '全季',
    notes: '重要场合首选',
  },
];

const mockSkinRecords: SkinRecord[] = [
  {
    id: '1',
    date: new Date(Date.now() - 86400000 * 6),
    skinType: 'combination',
    conditions: ['轻微出油', '毛孔粗大'],
    hydration: 65,
    oilLevel: 70,
    notes: 'T区出油明显',
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000 * 5),
    skinType: 'combination',
    conditions: ['轻微干燥'],
    hydration: 70,
    oilLevel: 55,
  },
  {
    id: '3',
    date: new Date(Date.now() - 86400000 * 4),
    skinType: 'combination',
    conditions: ['状态良好'],
    hydration: 78,
    oilLevel: 50,
    notes: '使用新面膜后效果不错',
  },
  {
    id: '4',
    date: new Date(Date.now() - 86400000 * 3),
    skinType: 'combination',
    conditions: ['轻微暗沉'],
    hydration: 72,
    oilLevel: 60,
  },
  {
    id: '5',
    date: new Date(Date.now() - 86400000 * 2),
    skinType: 'combination',
    conditions: ['痘痘'],
    hydration: 68,
    oilLevel: 75,
    notes: '熬夜导致额头长痘',
  },
  {
    id: '6',
    date: new Date(Date.now() - 86400000),
    skinType: 'combination',
    conditions: ['改善中'],
    hydration: 75,
    oilLevel: 55,
    notes: '使用祛痘产品后好转',
  },
];

const mockSkincarePlans: SkincarePlan[] = [
  {
    id: '1',
    name: '日常护肤',
    time: 'morning',
    isActive: true,
    steps: [
      { id: 's1', name: '洁面', product: '氨基酸洁面乳', duration: 60, order: 1, completed: false },
      { id: 's2', name: '爽肤水', product: '保湿爽肤水', duration: 30, order: 2, completed: false },
      { id: 's3', name: '精华', product: '维C精华', duration: 60, order: 3, completed: false },
      { id: 's4', name: '乳液', product: '保湿乳液', duration: 60, order: 4, completed: false },
      { id: 's5', name: '防晒', product: 'SPF50防晒霜', duration: 30, order: 5, completed: false },
    ],
  },
  {
    id: '2',
    name: '晚间修护',
    time: 'evening',
    isActive: true,
    steps: [
      { id: 's1', name: '卸妆', product: '卸妆油', duration: 120, order: 1, completed: false },
      { id: 's2', name: '洁面', product: '氨基酸洁面乳', duration: 60, order: 2, completed: false },
      { id: 's3', name: '爽肤水', product: '保湿爽肤水', duration: 30, order: 3, completed: false },
      { id: 's4', name: '精华', product: 'A醇精华', duration: 60, order: 4, completed: false },
      { id: 's5', name: '眼霜', product: '抗皱眼霜', duration: 60, order: 5, completed: false },
      { id: 's6', name: '面霜', product: '修护面霜', duration: 60, order: 6, completed: false },
    ],
  },
  {
    id: '3',
    name: '周末深层护理',
    time: 'evening',
    isActive: false,
    steps: [
      { id: 's1', name: '洁面', product: '氨基酸洁面乳', duration: 60, order: 1, completed: false },
      { id: 's2', name: '去角质', product: '温和去角质凝胶', duration: 120, order: 2, completed: false },
      { id: 's3', name: '面膜', product: '补水面膜', duration: 900, order: 3, completed: false },
      { id: 's4', name: '精华', product: '玻尿酸精华', duration: 60, order: 4, completed: false },
      { id: 's5', name: '面霜', product: '睡眠面膜', duration: 60, order: 5, completed: false },
    ],
  },
];

// ============== 辅助函数和配置 ==============

const categoryLabels: Record<string, string> = {
  tops: '上装',
  bottoms: '下装',
  outerwear: '外套',
  shoes: '鞋子',
  accessories: '配饰',
};

const categoryColors: Record<string, string> = {
  tops: 'bg-pink-100 text-pink-700 border-pink-200',
  bottoms: 'bg-blue-100 text-blue-700 border-blue-200',
  outerwear: 'bg-amber-100 text-amber-700 border-amber-200',
  shoes: 'bg-purple-100 text-purple-700 border-purple-200',
  accessories: 'bg-teal-100 text-teal-700 border-teal-200',
};

const seasonLabels: Record<string, string> = {
  spring: '春季',
  summer: '夏季',
  autumn: '秋季',
  winter: '冬季',
  all: '四季',
};

const seasonIcons: Record<string, React.ReactNode> = {
  spring: <Leaf className="w-3 h-3" />,
  summer: <Sun className="w-3 h-3" />,
  autumn: <Wind className="w-3 h-3" />,
  winter: <Moon className="w-3 h-3" />,
  all: <Sparkles className="w-3 h-3" />,
};

const skinTypeLabels: Record<string, string> = {
  oily: '油性',
  dry: '干性',
  combination: '混合性',
  normal: '中性',
  sensitive: '敏感性',
};

const conditionColors: Record<string, string> = {
  '状态良好': 'bg-green-100 text-green-700',
  '轻微出油': 'bg-yellow-100 text-yellow-700',
  '毛孔粗大': 'bg-orange-100 text-orange-700',
  '轻微干燥': 'bg-blue-100 text-blue-700',
  '痘痘': 'bg-red-100 text-red-700',
  '暗沉': 'bg-gray-100 text-gray-700',
  '轻微暗沉': 'bg-gray-100 text-gray-700',
  '改善中': 'bg-teal-100 text-teal-700',
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// AI推荐搭配的模拟函数
const generateOutfitRecommendation = () => {
  const occasions = ['工作', '约会', '休闲', '正式场合', '运动'];
  const styles = ['简约通勤', '休闲周末', '商务精英', '时尚街头', '文艺清新'];
  const randomOccasion = occasions[Math.floor(Math.random() * occasions.length)];
  const randomStyle = styles[Math.floor(Math.random() * styles.length)];
  return {
    occasion: randomOccasion,
    style: randomStyle,
    reason: `根据您的衣橱分析和今日天气，推荐${randomStyle}风格，适合${randomOccasion}场合。`,
  };
};

// ============== 主组件 ==============

export function ImageModule() {
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>(mockWardrobeItems);
  const [outfits, setOutfits] = useState<OutfitCombination[]>(mockOutfits);
  const [skinRecords, setSkinRecords] = useState<SkinRecord[]>(mockSkinRecords);
  const [skincarePlans, setSkincarePlans] = useState<SkincarePlan[]>(mockSkincarePlans);
  const [activeTab, setActiveTab] = useState('wardrobe');

  // Dialog states
  const [isAddWardrobeOpen, setIsAddWardrobeOpen] = useState(false);
  const [isAddOutfitOpen, setIsAddOutfitOpen] = useState(false);
  const [isAddSkinRecordOpen, setIsAddSkinRecordOpen] = useState(false);
  const [isAddSkincareOpen, setIsAddSkincareOpen] = useState(false);
  const [isAIRecommendOpen, setIsAIRecommendOpen] = useState(false);

  // Form states
  const [newWardrobeItem, setNewWardrobeItem] = useState({
    name: '',
    category: 'tops' as WardrobeItem['category'],
    color: '',
    brand: '',
    season: 'all' as WardrobeItem['season'],
  });
  const [newOutfit, setNewOutfit] = useState({
    name: '',
    occasion: '',
    season: '',
    notes: '',
    selectedItems: [] as string[],
  });
  const [newSkinRecord, setNewSkinRecord] = useState({
    skinType: 'combination' as SkinRecord['skinType'],
    conditions: [] as string[],
    hydration: 70,
    oilLevel: 50,
    notes: '',
  });
  const [newSkincareStep, setNewSkincareStep] = useState({
    name: '',
    product: '',
    duration: 60,
  });
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  // Search and filter states
  const [wardrobeSearch, setWardrobeSearch] = useState('');
  const [wardrobeFilter, setWardrobeFilter] = useState({
    category: 'all',
    season: 'all',
  });
  const [outfitSearch, setOutfitSearch] = useState('');
  const [skinSearch, setSkinSearch] = useState('');

  // AI recommendation state
  const [aiRecommendation, setAiRecommendation] = useState<{
    occasion: string;
    style: string;
    reason: string;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // 统计数据
  const totalItems = wardrobeItems.length;
  const favoriteItems = wardrobeItems.filter(i => i.favorite).length;
  const totalOutfits = outfits.length;
  const avgSkinHydration = Math.round(
    skinRecords.reduce((sum, r) => sum + r.hydration, 0) / skinRecords.length
  );
  const activePlans = skincarePlans.filter(p => p.isActive).length;

  // 衣橱操作
  const addWardrobeItem = () => {
    if (!newWardrobeItem.name.trim() || !newWardrobeItem.color.trim()) return;
    const item: WardrobeItem = {
      id: Date.now().toString(),
      ...newWardrobeItem,
      favorite: false,
      wearCount: 0,
    };
    setWardrobeItems([item, ...wardrobeItems]);
    setNewWardrobeItem({ name: '', category: 'tops', color: '', brand: '', season: 'all' });
    setIsAddWardrobeOpen(false);
  };

  const toggleFavorite = (id: string) => {
    setWardrobeItems(wardrobeItems.map(item =>
      item.id === id ? { ...item, favorite: !item.favorite } : item
    ));
  };

  const deleteWardrobeItem = (id: string) => {
    setWardrobeItems(wardrobeItems.filter(i => i.id !== id));
  };

  // 穿搭操作
  const addOutfit = () => {
    if (!newOutfit.name.trim() || newOutfit.selectedItems.length === 0) return;
    const outfit: OutfitCombination = {
      id: Date.now().toString(),
      name: newOutfit.name,
      occasion: newOutfit.occasion,
      season: newOutfit.season,
      items: newOutfit.selectedItems,
      rating: 0,
      notes: newOutfit.notes,
    };
    setOutfits([outfit, ...outfits]);
    setNewOutfit({ name: '', occasion: '', season: '', notes: '', selectedItems: [] });
    setIsAddOutfitOpen(false);
  };

  const rateOutfit = (id: string, rating: number) => {
    setOutfits(outfits.map(o => o.id === id ? { ...o, rating } : o));
  };

  const deleteOutfit = (id: string) => {
    setOutfits(outfits.filter(o => o.id !== id));
  };

  // 肤质记录操作
  const addSkinRecord = () => {
    const record: SkinRecord = {
      id: Date.now().toString(),
      date: new Date(),
      ...newSkinRecord,
    };
    setSkinRecords([record, ...skinRecords]);
    setNewSkinRecord({
      skinType: 'combination',
      conditions: [],
      hydration: 70,
      oilLevel: 50,
      notes: '',
    });
    setIsAddSkinRecordOpen(false);
  };

  const deleteSkinRecord = (id: string) => {
    setSkinRecords(skinRecords.filter(r => r.id !== id));
  };

  // 护肤方案操作
  const togglePlanActive = (id: string) => {
    setSkincarePlans(skincarePlans.map(p =>
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const toggleStepComplete = (planId: string, stepId: string) => {
    setSkincarePlans(skincarePlans.map(p => {
      if (p.id === planId) {
        return {
          ...p,
          steps: p.steps.map(s =>
            s.id === stepId ? { ...s, completed: !s.completed } : s
          ),
        };
      }
      return p;
    }));
  };

  const addSkincareStep = () => {
    if (!newSkincareStep.name.trim() || !selectedPlanId) return;
    setSkincarePlans(skincarePlans.map(p => {
      if (p.id === selectedPlanId) {
        const step: SkincareStep = {
          id: Date.now().toString(),
          ...newSkincareStep,
          order: p.steps.length + 1,
          completed: false,
        };
        return { ...p, steps: [...p.steps, step] };
      }
      return p;
    }));
    setNewSkincareStep({ name: '', product: '', duration: 60 });
    setIsAddSkincareOpen(false);
  };

  // AI推荐
  const generateAIRecommendation = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setAiRecommendation(generateOutfitRecommendation());
      setIsGenerating(false);
    }, 1500);
  };

  // 过滤后的数据
  const filteredWardrobeItems = wardrobeItems.filter(item => {
    const matchesSearch = item.name.includes(wardrobeSearch) ||
      item.color.includes(wardrobeSearch) ||
      (item.brand?.includes(wardrobeSearch) ?? false);
    const matchesCategory = wardrobeFilter.category === 'all' || item.category === wardrobeFilter.category;
    const matchesSeason = wardrobeFilter.season === 'all' || item.season === wardrobeFilter.season;
    return matchesSearch && matchesCategory && matchesSeason;
  });

  const filteredOutfits = outfits.filter(o =>
    o.name.includes(outfitSearch) || o.occasion.includes(outfitSearch)
  );

  const filteredSkinRecords = skinRecords.filter(r =>
    r.conditions.some(c => c.includes(skinSearch)) ||
    skinTypeLabels[r.skinType].includes(skinSearch) ||
    (r.notes?.includes(skinSearch) ?? false)
  );

  // 获取穿搭中的单品名称
  const getItemNames = (itemIds: string[]) => {
    return itemIds.map(id => {
      const item = wardrobeItems.find(i => i.id === id);
      return item?.name || '未知';
    });
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* 模块头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Palette className="w-7 h-7 text-pink-500" />
            形象管理
          </h1>
          <p className="text-muted-foreground">衣橱管理、穿搭推荐、肤质记录、护肤方案</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-lg px-3">
            <Sparkles className="w-4 h-4 mr-1 text-pink-500" />
            {totalItems} 件单品
          </Badge>
        </div>
      </div>

      {/* 核心数据卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border-pink-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Shirt className="w-5 h-5 text-pink-500" />
              <span className="text-2xl font-bold text-pink-600">{totalItems}</span>
            </div>
            <p className="text-sm text-muted-foreground">衣橱单品</p>
            <p className="text-xs text-pink-600 mt-1">
              {favoriteItems} 件收藏
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-purple-500" />
              <span className="text-2xl font-bold text-purple-600">{totalOutfits}</span>
            </div>
            <p className="text-sm text-muted-foreground">穿搭组合</p>
            <p className="text-xs text-purple-600 mt-1">
              AI智能推荐
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border-cyan-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-cyan-500" />
              <span className="text-2xl font-bold text-cyan-600">{avgSkinHydration}%</span>
            </div>
            <p className="text-sm text-muted-foreground">平均水润度</p>
            <p className="text-xs text-cyan-600 mt-1">
              {skinRecords.length} 条记录
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-amber-500" />
              <span className="text-2xl font-bold text-amber-600">{activePlans}</span>
            </div>
            <p className="text-sm text-muted-foreground">护肤方案</p>
            <p className="text-xs text-amber-600 mt-1">
              正在使用中
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 主要内容标签页 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="wardrobe" className="gap-1">
            <Shirt className="w-4 h-4" />
            <span className="hidden sm:inline">衣橱管理</span>
          </TabsTrigger>
          <TabsTrigger value="outfits" className="gap-1">
            <Wand2 className="w-4 h-4" />
            <span className="hidden sm:inline">穿搭推荐</span>
          </TabsTrigger>
          <TabsTrigger value="skin" className="gap-1">
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">肤质记录</span>
          </TabsTrigger>
          <TabsTrigger value="skincare" className="gap-1">
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">护肤方案</span>
          </TabsTrigger>
        </TabsList>

        {/* 衣橱管理 */}
        <TabsContent value="wardrobe" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-lg font-semibold">我的衣橱</h3>
            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索单品..."
                  value={wardrobeSearch}
                  onChange={(e) => setWardrobeSearch(e.target.value)}
                  className="pl-8 w-full sm:w-[150px]"
                />
              </div>
              <Select
                value={wardrobeFilter.category}
                onValueChange={(value) => setWardrobeFilter({ ...wardrobeFilter, category: value })}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部分类</SelectItem>
                  <SelectItem value="tops">上装</SelectItem>
                  <SelectItem value="bottoms">下装</SelectItem>
                  <SelectItem value="outerwear">外套</SelectItem>
                  <SelectItem value="shoes">鞋子</SelectItem>
                  <SelectItem value="accessories">配饰</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isAddWardrobeOpen} onOpenChange={setIsAddWardrobeOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1 shrink-0">
                    <Plus className="w-4 h-4" />
                    添加
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>添加新单品</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>名称</Label>
                      <Input
                        value={newWardrobeItem.name}
                        onChange={(e) => setNewWardrobeItem({ ...newWardrobeItem, name: e.target.value })}
                        placeholder="如：白色衬衫"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>分类</Label>
                        <Select
                          value={newWardrobeItem.category}
                          onValueChange={(value: WardrobeItem['category']) =>
                            setNewWardrobeItem({ ...newWardrobeItem, category: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tops">上装</SelectItem>
                            <SelectItem value="bottoms">下装</SelectItem>
                            <SelectItem value="outerwear">外套</SelectItem>
                            <SelectItem value="shoes">鞋子</SelectItem>
                            <SelectItem value="accessories">配饰</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>颜色</Label>
                        <Input
                          value={newWardrobeItem.color}
                          onChange={(e) => setNewWardrobeItem({ ...newWardrobeItem, color: e.target.value })}
                          placeholder="如：白色"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>品牌</Label>
                        <Input
                          value={newWardrobeItem.brand}
                          onChange={(e) => setNewWardrobeItem({ ...newWardrobeItem, brand: e.target.value })}
                          placeholder="可选"
                        />
                      </div>
                      <div>
                        <Label>适用季节</Label>
                        <Select
                          value={newWardrobeItem.season}
                          onValueChange={(value: WardrobeItem['season']) =>
                            setNewWardrobeItem({ ...newWardrobeItem, season: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">四季</SelectItem>
                            <SelectItem value="spring">春季</SelectItem>
                            <SelectItem value="summer">夏季</SelectItem>
                            <SelectItem value="autumn">秋季</SelectItem>
                            <SelectItem value="winter">冬季</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button onClick={addWardrobeItem} className="w-full">添加单品</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <ScrollArea className="max-h-[500px] pr-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredWardrobeItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ delay: index * 0.03 }}
                    layout
                  >
                    <Card className="hover:shadow-md transition-all cursor-pointer group">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "w-12 h-12 rounded-lg flex items-center justify-center text-white font-medium",
                              item.category === 'tops' && "bg-gradient-to-br from-pink-400 to-pink-600",
                              item.category === 'bottoms' && "bg-gradient-to-br from-blue-400 to-blue-600",
                              item.category === 'outerwear' && "bg-gradient-to-br from-amber-400 to-amber-600",
                              item.category === 'shoes' && "bg-gradient-to-br from-purple-400 to-purple-600",
                              item.category === 'accessories' && "bg-gradient-to-br from-teal-400 to-teal-600"
                            )}>
                              <Shirt className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-xs text-muted-foreground">{item.brand || '无品牌'}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleFavorite(item.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Star className={cn(
                              "w-5 h-5 transition-colors",
                              item.favorite ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            )} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className={cn('text-xs', categoryColors[item.category])}>
                            {categoryLabels[item.category]}
                          </Badge>
                          <Badge variant="outline" className="text-xs bg-gray-50">
                            {item.color}
                          </Badge>
                          <Badge variant="outline" className="text-xs flex items-center gap-1">
                            {seasonIcons[item.season]}
                            {seasonLabels[item.season]}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>穿着 {item.wearCount} 次</span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => toggleFavorite(item.id)}>
                                <Star className={cn("w-4 h-4 mr-2", item.favorite && "fill-yellow-400 text-yellow-400")} />
                                {item.favorite ? '取消收藏' : '收藏'}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit2 className="w-4 h-4 mr-2" />
                                编辑
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => deleteWardrobeItem(item.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                删除
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* 穿搭推荐 */}
        <TabsContent value="outfits" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-lg font-semibold">穿搭组合</h3>
            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索穿搭..."
                  value={outfitSearch}
                  onChange={(e) => setOutfitSearch(e.target.value)}
                  className="pl-8 w-full sm:w-[150px]"
                />
              </div>
              <Dialog open={isAIRecommendOpen} onOpenChange={setIsAIRecommendOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 shrink-0 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200"
                    onClick={generateAIRecommendation}
                  >
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    AI推荐
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      AI穿搭推荐
                    </DialogTitle>
                  </DialogHeader>
                  {isGenerating ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <RefreshCw className="w-8 h-8 text-purple-500 animate-spin mb-4" />
                      <p className="text-muted-foreground">正在分析您的衣橱...</p>
                    </div>
                  ) : aiRecommendation ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-purple-500">{aiRecommendation.style}</Badge>
                          <Badge variant="outline">{aiRecommendation.occasion}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          {aiRecommendation.reason}
                        </p>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">推荐单品：</p>
                          <div className="flex flex-wrap gap-2">
                            {filteredWardrobeItems.slice(0, 3).map(item => (
                              <Badge key={item.id} variant="secondary" className="gap-1">
                                <Shirt className="w-3 h-3" />
                                {item.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={generateAIRecommendation}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          换一个
                        </Button>
                        <Button className="flex-1">
                          <Plus className="w-4 h-4 mr-2" />
                          保存穿搭
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </DialogContent>
              </Dialog>
              <Dialog open={isAddOutfitOpen} onOpenChange={setIsAddOutfitOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1 shrink-0">
                    <Plus className="w-4 h-4" />
                    创建
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>创建穿搭组合</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>穿搭名称</Label>
                      <Input
                        value={newOutfit.name}
                        onChange={(e) => setNewOutfit({ ...newOutfit, name: e.target.value })}
                        placeholder="如：商务休闲风"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>场合</Label>
                        <Input
                          value={newOutfit.occasion}
                          onChange={(e) => setNewOutfit({ ...newOutfit, occasion: e.target.value })}
                          placeholder="如：工作、约会"
                        />
                      </div>
                      <div>
                        <Label>季节</Label>
                        <Input
                          value={newOutfit.season}
                          onChange={(e) => setNewOutfit({ ...newOutfit, season: e.target.value })}
                          placeholder="如：秋季"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>选择单品</Label>
                      <ScrollArea className="h-40 border rounded-lg p-2">
                        <div className="space-y-2">
                          {wardrobeItems.map(item => (
                            <div
                              key={item.id}
                              className={cn(
                                "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors",
                                newOutfit.selectedItems.includes(item.id)
                                  ? "bg-primary/10 border border-primary"
                                  : "hover:bg-muted"
                              )}
                              onClick={() => {
                                setNewOutfit({
                                  ...newOutfit,
                                  selectedItems: newOutfit.selectedItems.includes(item.id)
                                    ? newOutfit.selectedItems.filter(id => id !== item.id)
                                    : [...newOutfit.selectedItems, item.id]
                                });
                              }}
                            >
                              <div className={cn(
                                "w-8 h-8 rounded flex items-center justify-center text-white text-xs",
                                item.category === 'tops' && "bg-pink-500",
                                item.category === 'bottoms' && "bg-blue-500",
                                item.category === 'outerwear' && "bg-amber-500",
                                item.category === 'shoes' && "bg-purple-500",
                                item.category === 'accessories' && "bg-teal-500"
                              )}>
                                {item.name[0]}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{item.name}</p>
                                <p className="text-xs text-muted-foreground">{item.color}</p>
                              </div>
                              {newOutfit.selectedItems.includes(item.id) && (
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                              )}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                    <div>
                      <Label>备注</Label>
                      <Textarea
                        value={newOutfit.notes}
                        onChange={(e) => setNewOutfit({ ...newOutfit, notes: e.target.value })}
                        placeholder="穿搭说明..."
                        rows={2}
                      />
                    </div>
                    <Button onClick={addOutfit} className="w-full">创建穿搭</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <ScrollArea className="max-h-[500px] pr-4">
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredOutfits.map((outfit, index) => (
                  <motion.div
                    key={outfit.id}
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{outfit.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {outfit.occasion}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {outfit.season}
                              </Badge>
                            </div>
                            {outfit.notes && (
                              <p className="text-sm text-muted-foreground">{outfit.notes}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <button
                                key={star}
                                onClick={() => rateOutfit(outfit.id, star)}
                                className="focus:outline-none"
                              >
                                <Star className={cn(
                                  "w-4 h-4 transition-colors",
                                  star <= outfit.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                )} />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {getItemNames(outfit.items).map((name, i) => (
                            <Badge key={i} variant="outline" className="gap-1">
                              <Shirt className="w-3 h-3" />
                              {name}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            上次穿着：{outfit.lastWorn?.toLocaleDateString('zh-CN') || '未穿着'}
                          </span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
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
                                onClick={() => deleteOutfit(outfit.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                删除
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* 肤质记录 */}
        <TabsContent value="skin" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-lg font-semibold">肤质记录</h3>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索记录..."
                  value={skinSearch}
                  onChange={(e) => setSkinSearch(e.target.value)}
                  className="pl-8 w-full sm:w-[150px]"
                />
              </div>
              <Dialog open={isAddSkinRecordOpen} onOpenChange={setIsAddSkinRecordOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-1 shrink-0">
                    <Plus className="w-4 h-4" />
                    记录
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>记录今日肤质</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>肤质类型</Label>
                      <Select
                        value={newSkinRecord.skinType}
                        onValueChange={(value: SkinRecord['skinType']) =>
                          setNewSkinRecord({ ...newSkinRecord, skinType: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="oily">油性</SelectItem>
                          <SelectItem value="dry">干性</SelectItem>
                          <SelectItem value="combination">混合性</SelectItem>
                          <SelectItem value="normal">中性</SelectItem>
                          <SelectItem value="sensitive">敏感性</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>肌肤状况</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {['状态良好', '轻微出油', '毛孔粗大', '轻微干燥', '痘痘', '暗沉'].map(condition => (
                          <Badge
                            key={condition}
                            variant={newSkinRecord.conditions.includes(condition) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => {
                              setNewSkinRecord({
                                ...newSkinRecord,
                                conditions: newSkinRecord.conditions.includes(condition)
                                  ? newSkinRecord.conditions.filter(c => c !== condition)
                                  : [...newSkinRecord.conditions, condition]
                              });
                            }}
                          >
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>水润度：{newSkinRecord.hydration}%</Label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={newSkinRecord.hydration}
                          onChange={(e) => setNewSkinRecord({ ...newSkinRecord, hydration: Number(e.target.value) })}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      <div>
                        <Label>油脂分泌：{newSkinRecord.oilLevel}%</Label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={newSkinRecord.oilLevel}
                          onChange={(e) => setNewSkinRecord({ ...newSkinRecord, oilLevel: Number(e.target.value) })}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>备注</Label>
                      <Textarea
                        value={newSkinRecord.notes}
                        onChange={(e) => setNewSkinRecord({ ...newSkinRecord, notes: e.target.value })}
                        placeholder="记录今日肌肤状态..."
                        rows={2}
                      />
                    </div>
                    <Button onClick={addSkinRecord} className="w-full">保存记录</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* 趋势图 */}
          <Card className="bg-gradient-to-br from-cyan-50/50 to-teal-50/50 border-cyan-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-500" />
                肌肤状态趋势
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 h-32">
                {skinRecords.slice(-7).map((record, i) => (
                  <div key={record.id} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col gap-1">
                      <div
                        className="w-full bg-cyan-400 rounded-t"
                        style={{ height: `${record.hydration * 0.8}px` }}
                      />
                      <div
                        className="w-full bg-amber-400 rounded-b"
                        style={{ height: `${record.oilLevel * 0.5}px` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {record.date.getDate()}日
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-cyan-400 rounded" />
                  <span>水润度</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-amber-400 rounded" />
                  <span>油脂分泌</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <ScrollArea className="max-h-[400px] pr-4">
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredSkinRecords.map((record, index) => (
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
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {record.date.toLocaleDateString('zh-CN', {
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </Badge>
                              <Badge className="text-xs bg-gradient-to-r from-cyan-500 to-teal-500 text-white">
                                {skinTypeLabels[record.skinType]}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {record.conditions.map((condition, i) => (
                                <Badge key={i} variant="outline" className={cn('text-xs', conditionColors[condition] || '')}>
                                  {condition}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => deleteSkinRecord(record.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                删除
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-2">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-muted-foreground">水润度</span>
                              <span className="text-xs font-medium">{record.hydration}%</span>
                            </div>
                            <Progress value={record.hydration} className="h-2 bg-cyan-100 [&>div]:bg-cyan-500" />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-muted-foreground">油脂分泌</span>
                              <span className="text-xs font-medium">{record.oilLevel}%</span>
                            </div>
                            <Progress value={record.oilLevel} className="h-2 bg-amber-100 [&>div]:bg-amber-500" />
                          </div>
                        </div>
                        {record.notes && (
                          <p className="text-sm text-muted-foreground">{record.notes}</p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* 护肤方案 */}
        <TabsContent value="skincare" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="text-lg font-semibold">护肤方案</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Sun className="w-3 h-3 text-amber-500" />
                晨间 {skincarePlans.filter(p => p.time === 'morning' && p.isActive).length} 个
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Moon className="w-3 h-3 text-indigo-500" />
                晚间 {skincarePlans.filter(p => p.time === 'evening' && p.isActive).length} 个
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {skincarePlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.1 }}
              >
                <Card className={cn(
                  "hover:shadow-md transition-all",
                  !plan.isActive && "opacity-60"
                )}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        {plan.time === 'morning' ? (
                          <Sun className="w-5 h-5 text-amber-500" />
                        ) : (
                          <Moon className="w-5 h-5 text-indigo-500" />
                        )}
                        {plan.name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={plan.isActive ? "default" : "secondary"} className="text-xs">
                          {plan.isActive ? '使用中' : '未启用'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePlanActive(plan.id)}
                        >
                          {plan.isActive ? '停用' : '启用'}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {plan.steps.map((step, stepIndex) => (
                      <div
                        key={step.id}
                        className={cn(
                          "flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer",
                          step.completed ? "bg-green-50" : "hover:bg-muted"
                        )}
                        onClick={() => toggleStepComplete(plan.id, step.id)}
                      >
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                          step.completed
                            ? "bg-green-500 text-white"
                            : "bg-muted text-muted-foreground"
                        )}>
                          {step.completed ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            step.order
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={cn(
                            "text-sm font-medium",
                            step.completed && "line-through text-muted-foreground"
                          )}>
                            {step.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{step.product}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {Math.floor(step.duration / 60)}分钟
                        </Badge>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          setSelectedPlanId(plan.id);
                          setIsAddSkincareOpen(true);
                        }}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        添加步骤
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        {plan.steps.filter(s => s.completed).length}/{plan.steps.length} 完成
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* 添加步骤对话框 */}
          <Dialog open={isAddSkincareOpen} onOpenChange={setIsAddSkincareOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>添加护肤步骤</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>步骤名称</Label>
                  <Input
                    value={newSkincareStep.name}
                    onChange={(e) => setNewSkincareStep({ ...newSkincareStep, name: e.target.value })}
                    placeholder="如：精华、面霜"
                  />
                </div>
                <div>
                  <Label>使用产品</Label>
                  <Input
                    value={newSkincareStep.product}
                    onChange={(e) => setNewSkincareStep({ ...newSkincareStep, product: e.target.value })}
                    placeholder="产品名称"
                  />
                </div>
                <div>
                  <Label>时长（秒）</Label>
                  <Input
                    type="number"
                    value={newSkincareStep.duration}
                    onChange={(e) => setNewSkincareStep({ ...newSkincareStep, duration: Number(e.target.value) })}
                  />
                </div>
                <Button onClick={addSkincareStep} className="w-full">添加步骤</Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
}
