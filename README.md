# 🌟 个人中枢App (Personal Life OS)

> 专属个人人生操作系统 - 基于AI全栈开发、模块化插件架构设计

## ✨ 核心特性

### 🏗️ 插件化微内核架构
- **轻量主壳** - 承载全周期时间轴、全局AI大脑、积分勋章系统
- **八大独立模块** - 物理隔离、互不依赖、可独立增删改
- **只读数据总线** - 模块间安全通信，数据绝对隔离

### 📊 全周期时间轴
- 今日 → 本周 → 本月 → 季度 → 年度 五维度视图
- 智能卡片推荐、任务管理、快速复盘
- 周目标进度、月度统计、年度里程碑

### 🤖 AI智能助手
- 情绪识别与陪伴
- 智能建议与成长激励
- 多场景AI对话支持

### 🎮 游戏化系统
- 积分获取与消耗
- 18+ 枚勋章成就
- 等级系统与奖励机制

## 📦 八大功能模块

| 模块 | 功能 |
|------|------|
| 🎨 **形象管理** | 衣橱管理、AI穿搭推荐、肤质记录、护肤方案 |
| 💚 **健康养生** | 中医体质分析、舌象记录、养生茶饮、调理计划 |
| 📐 **数学教学** | 学生管理、AI教案生成、题库管理、考试分析 |
| 📱 **自媒体IP** | 文案脚本库、选题策划、发布日历、数据分析 |
| 💕 **情感人际** | 关系记录、沟通策略、相亲管理、情感复盘 |
| 💰 **副业增收** | 项目管理、收支记录、运营模板、收益统计 |
| 🎯 **自我成长** | 五年计划、习惯打卡、认知复盘、目标追踪 |
| 🔧 **生活工具** | 财务记账、事务提醒、地址管理、证件卡片 |

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| **框架** | Next.js 16 + TypeScript 5 |
| **UI** | Tailwind CSS + shadcn/ui + Framer Motion |
| **数据库** | Prisma + SQLite |
| **状态管理** | Zustand |
| **AI** | z-ai-web-dev-sdk |

## 🚀 快速开始

```bash
# 安装依赖
bun install

# 同步数据库
bun run db:push

# 启动开发服务器
bun run dev
```

## 📁 项目结构

```
src/
├── app/                 # 页面与API路由
│   ├── api/            # 后端API
│   │   ├── ai/        # AI对话API
│   │   ├── tasks/     # 任务API
│   │   ├── habits/    # 习惯API
│   │   ├── points/    # 积分API
│   │   └── data-bus/  # 数据总线API
│   ├── layout.tsx     # 根布局
│   └── page.tsx       # 主页面
├── components/
│   ├── layout/        # 主布局组件
│   ├── home/          # 首页时间轴组件
│   ├── common/        # 通用组件
│   ├── modules/       # 八大功能模块
│   │   ├── image/    # 形象管理
│   │   ├── health/   # 健康养生
│   │   ├── teaching/ # 数学教学
│   │   ├── media/    # 自媒体IP
│   │   ├── emotion/  # 情感人际
│   │   ├── sidejob/  # 副业增收
│   │   ├── growth/   # 自我成长
│   │   └── tools/    # 生活工具
│   └── ui/            # shadcn/ui组件库
├── lib/
│   ├── db.ts          # 数据库客户端
│   ├── data-bus.ts    # 只读数据总线
│   └── utils.ts       # 工具函数
├── stores/
│   └── app-store.ts   # Zustand状态管理
├── types/
│   └── index.ts       # 类型定义
└── prisma/
    └── schema.prisma  # 数据库模型
```

## 🔒 数据安全

- ✅ 模块数据绝对隔离
- ✅ 只读数据总线通信
- ✅ 本地优先存储
- ✅ 模块增删改互不影响

## 📝 开发日志

查看 [worklog.md](./worklog.md) 了解完整的开发过程。

---

## 📱 打包 APK

### 方法一：GitHub Actions 自动构建（推荐）

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "feat: your changes"
   git push
   ```

2. **触发构建**
   - 进入 GitHub 仓库 → Actions → "Build APK" → Run workflow
   - 或直接 push 到 main 分支自动触发

3. **下载 APK**
   - 构建完成后，在 Actions 页面下载 `app-debug-apk` artifact
   - 或在 Releases 页面下载自动发布的 APK

### 方法二：本地构建

```bash
# 1. 安装依赖
bun install

# 2. 构建 Next.js
bun run build

# 3. 同步到 Android
npx cap add android
npx cap sync

# 4. 打开 Android Studio 构建 APK
npx cap open android
```

### 方法三：PWA 安装（最简单）

1. 访问部署后的网站
2. 浏览器会提示"添加到主屏幕"
3. 点击安装即可像 APP 一样使用

> 💡 **提示**: PWA 版本支持离线使用，体验接近原生 APP

---

**Built with ❤️ for personal growth and life management.**
