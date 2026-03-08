'use client';

import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  Heart, 
  GraduationCap, 
  Video, 
  Users, 
  TrendingUp, 
  Target, 
  Wrench,
  Bot,
  Trophy,
  BarChart3,
  Settings,
  Menu,
  ChevronRight,
  Sun,
  Moon,
  Zap
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { userStore } from '@/lib/local-db';

// 模块配置
const MODULES = [
  { code: 'image', name: '形象管理', icon: 'Sparkles', color: 'rose' },
  { code: 'health', name: '健康养生', icon: 'Heart', color: 'green' },
  { code: 'teaching', name: '数学教学', icon: 'GraduationCap', color: 'blue' },
  { code: 'media', name: '自媒体IP', icon: 'Video', color: 'purple' },
  { code: 'emotion', name: '情感人际', icon: 'Users', color: 'pink' },
  { code: 'sidejob', name: '副业增收', icon: 'TrendingUp', color: 'amber' },
  { code: 'growth', name: '自我成长', icon: 'Target', color: 'cyan' },
  { code: 'tools', name: '生活工具', icon: 'Wrench', color: 'slate' }
] as const;

type ModuleCode = typeof MODULES[number]['code'];
type ViewType = 'home' | 'dashboard' | ModuleCode;

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-5 h-5" />,
  Heart: <Heart className="w-5 h-5" />,
  GraduationCap: <GraduationCap className="w-5 h-5" />,
  Video: <Video className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  TrendingUp: <TrendingUp className="w-5 h-5" />,
  Target: <Target className="w-5 h-5" />,
  Wrench: <Wrench className="w-5 h-5" />
};

const colorMap: Record<string, string> = {
  rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20',
  green: 'bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20',
  blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20',
  purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20',
  pink: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 hover:bg-pink-500/20',
  amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20',
  cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20',
  slate: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 hover:bg-slate-500/20'
};

interface MainLayoutProps {
  children: React.ReactNode;
  activeView?: ViewType;
  onViewChange?: (view: ViewType) => void;
  onToggleAi?: () => void;
}

export function MainLayout({ children, activeView = 'home', onViewChange, onToggleAi }: MainLayoutProps) {
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<{ name?: string; totalPoints: number; currentLevel: number } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // 加载用户数据
  useEffect(() => {
    userStore.getAll().then(users => {
      if (users.length > 0) {
        setUser(users[0]);
      }
    });
  }, []);

  const handleNavigate = (view: ViewType) => {
    onViewChange?.(view);
    setSidebarOpen(false);
  };

  // 侧边栏JSX - 直接内联，不创建组件
  const sidebarJsx = (
    <div className="flex flex-col h-full">
      {/* Logo区域 */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">个人中枢</h1>
            <p className="text-xs text-muted-foreground">人生操作系统</p>
          </div>
        </div>
      </div>

      {/* 用户信息 */}
      {user && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white font-medium">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user.name || '用户'}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Trophy className="w-3 h-3" />
                <span>{user.totalPoints} 积分</span>
                <Badge variant="secondary" className="text-xs">Lv.{user.currentLevel}</Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 导航菜单 */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          <Button
            variant={activeView === 'home' ? 'secondary' : 'ghost'}
            className={cn(
              "w-full justify-start gap-3",
              activeView === 'home' && "bg-primary/10 text-primary"
            )}
            onClick={() => handleNavigate('home')}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>首页时间轴</span>
          </Button>

          <Button
            variant={activeView === 'dashboard' ? 'secondary' : 'ghost'}
            className={cn(
              "w-full justify-start gap-3",
              activeView === 'dashboard' && "bg-primary/10 text-primary"
            )}
            onClick={() => handleNavigate('dashboard')}
          >
            <BarChart3 className="w-5 h-5" />
            <span>数据仪表盘</span>
          </Button>

          {/* 分隔线 */}
          <div className="h-px bg-border my-3" />

          {/* 模块列表 */}
          <p className="px-3 py-2 text-xs font-medium text-muted-foreground">功能模块</p>
          
          {MODULES.map((mod) => (
            <Button
              key={mod.code}
              variant={activeView === mod.code ? 'secondary' : 'ghost'}
              className={cn(
                "w-full justify-start gap-3",
                activeView === mod.code && colorMap[mod.color]
              )}
              onClick={() => handleNavigate(mod.code)}
            >
              {iconMap[mod.icon]}
              <span className="flex-1 text-left">{mod.name}</span>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </Button>
          ))}
        </div>
      </ScrollArea>

      {/* 底部工具栏 */}
      <div className="p-4 border-t border-border space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start gap-3"
          onClick={() => onToggleAi?.()}
        >
          <Bot className="w-5 h-5" />
          <span>AI助手</span>
          <Badge variant="secondary" className="ml-auto">在线</Badge>
        </Button>
        
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {mounted && (theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />)}
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* 桌面端侧边栏 */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:border-r lg:border-border lg:bg-background">
        {sidebarJsx}
      </aside>

      {/* 移动端侧边栏 */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          {sidebarJsx}
        </SheetContent>
      </Sheet>

      {/* 主内容区 */}
      <div className="lg:pl-64">
        {/* 顶部导航栏 */}
        <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="flex items-center justify-between h-full px-4">
            {/* 移动端菜单按钮 */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            {/* 当前页面标题 */}
            <div className="flex-1 lg:flex-none">
              <h2 className="font-semibold text-center lg:text-left">
                {activeView === 'home' && '首页时间轴'}
                {activeView === 'dashboard' && '数据仪表盘'}
                {MODULES.find(m => m.code === activeView)?.name}
              </h2>
            </div>

            {/* 右侧工具栏 */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleAi?.()}
                className="relative"
              >
                <Bot className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
              </Button>
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
