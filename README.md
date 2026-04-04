# 数字·白日梦 - 个人主页

这是一个基于自然光影主题的个人主页，使用 [Next.js 16](https://nextjs.org) + [shadcn/ui](https://ui.shadcn.com) 构建，支持从 Markdown 文件读取内容，具有优雅的阳光/月光主题切换效果。

**灵感来源**：
- [sunlit.place](https://www.sunlit.place) - 光影诗意设计
- [nicoletang.design](https://www.nicoletang.design) - 「Let the sun in」交互

## 核心特性

- 🌞 **阳光模式**：暖色调 + 斑驳树影 + SVG 风吹效果 + 百叶窗
- 🌙 **月光模式**：冷色调 + 星空背景 + 萤火虫闪烁 + 虫鸣夜声
- ⏰ **6 个时段自动切换**：黎明/上午/中午/下午/傍晚/深夜
- 📝 **Markdown 内容管理**：从 MD 文件读取页面内容
- 🎵 **环境音效**：鸟鸣、风声、虫鸣，根据时段自动切换
- 🎨 **响应式设计**：完美适配移动端和桌面端

## 快速开始

### 启动开发服务器

```bash
pnpm dev
```

启动后，在浏览器中打开 [http://localhost:5000](http://localhost:5000) 查看应用。

开发服务器支持热更新，修改代码后页面会自动刷新。

### 构建生产版本

```bash
pnpm build
```

### 启动生产服务器

```bash
pnpm start
```

## 项目结构

```
├── public/
│   ├── content/
│   │   └── home.md                    # 首页内容
│   └── assets/                        # 静态资源
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # 根布局
│   │   ├── page.tsx                   # 首页
│   │   └── globals.css                # 全局样式（光影效果）
│   ├── components/
│   │   ├── ui/                        # Shadcn UI 组件库
│   │   ├── effects/
│   │   │   └── VisualEffects.tsx      # DappledLight、Starfield、Fireflies、AmbientSound
│   │   ├── theme/
│   │   │   └── ThemeToggle.tsx        # 控制面板
│   │   └── MarkdownContent.tsx        # Markdown 渲染组件
│   ├── contexts/
│   │   └── ThemeContext.tsx           # 主题状态管理
│   └── lib/
│       └── utils.ts                   # 工具函数
├── content/                           # Markdown 源文件
│   └── home.md
└── package.json
```

## 核心开发规范

### 1. 页面开发

所有页面都必须：
1. 使用 `'use client'` 指令
2. 使用 `ThemeProvider` 包裹内容
3. 加载光影效果组件

```tsx
'use client';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { DappledLight, Starfield, Fireflies, AmbientSound } from '@/components/effects/VisualEffects';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export default function MyPage() {
  return (
    <ThemeProvider>
      <DappledLight />
      <Starfield />
      <Fireflies />
      <AmbientSound />
      <ThemeToggle />
      <main>页面内容</main>
    </ThemeProvider>
  );
}
```

### 2. Markdown 内容

所有 Markdown 文件放在 `content/` 目录，支持完整的 Markdown 语法和自定义标签：

```markdown
---
title: "页面标题"
---

# 页面内容

## 子标题

- 列表项 1
- 列表项 2

项目名称<span class="tip1">新</span>
项目名称<span class="tip2">全职</span>

[链接](url)
```

### 3. 优先使用 shadcn/ui 组件

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function MyComponent() {
  return (
    <Card>
      <CardContent>
        <Button>点击</Button>
      </CardContent>
    </Card>
  );
}
```

### 4. 依赖管理

**必须使用 pnpm 管理依赖**

```bash
# ✅ 安装依赖
pnpm install

# ✅ 添加新依赖
pnpm add package-name

# ❌ 禁止使用 npm 或 yarn
# npm install  # 错误！
# yarn add     # 错误！
```

### 5. 主题配置

编辑 `src/contexts/ThemeContext.tsx` 调整时段配置：

```tsx
const TIME_CONFIGS: Record<TimeOfDay, TimeConfig> = {
  morning: {
    name: '上午',
    bg: '#fff8f0',      // 背景色
    fg: '#2d2418',      // 文字色
    glow: '#ffcc80',    // 光晕色
    glowIntensity: 0.7, // 光晕强度
    leavesOpacity: 0.55, // 光斑透明度
    hasStars: false,    // 是否显示星星
    hasFireflies: false, // 是否显示萤火虫
  },
  // ...
};
```

## 技术栈

- **框架**: Next.js 16.1.1 (App Router)
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **样式**: Tailwind CSS v4
- **Markdown**: react-markdown, remark-gfm, rehype-raw
- **图标**: Lucide React
- **字体**: Geist Sans & Geist Mono
- **包管理器**: pnpm 9+
- **TypeScript**: 5.x

## 参考文档

- [Next.js 官方文档](https://nextjs.org/docs)
- [shadcn/ui 组件文档](https://ui.shadcn.com)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [PERSONAL_SITE_GUIDE.md](./PERSONAL_SITE_GUIDE.md) - 详细使用指南

## 重要提示

1. **必须使用 pnpm** 作为包管理器
2. **优先使用 shadcn/ui 组件** 而不是从零开发基础组件
3. **遵循 Next.js App Router 规范**，正确区分服务端/客户端组件
4. **使用 TypeScript** 进行类型安全开发
5. **所有页面都需要使用 ThemeProvider** 和光影效果组件
