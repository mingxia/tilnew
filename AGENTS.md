# 项目上下文

### 项目简介

这是一个**基于自然光影主题的个人主页**，支持从 Markdown 文件读取内容，具有优雅的阳光/月光主题切换效果。

**灵感来源**：
- [sunlit.place](https://www.sunlit.place) - 光影诗意设计
- [nicoletang.design](https://www.nicoletang.design) - 「Let the sun in」交互
- [jackyzha0/sunlit](https://github.com/jackyzha0/sunlit) - 核心技术实现

**核心特性**：
- 🌞 **阳光模式**：暖色调 + 斑驳树影 + SVG 风吹效果 + 百叶窗
- 🌙 **月光模式**：冷色调 + 星空背景 + 萤火虫闪烁 + 虫鸣夜声
- ⏰ **6 个时段自动切换**：黎明/上午/中午/下午/傍晚/深夜
- 📝 **Markdown 内容管理**：从 MD 文件读取页面内容
- 🎵 **环境音效**：鸟鸣、风声、虫鸣，根据时段自动切换
- 🎨 **响应式设计**：完美适配移动端和桌面端

### 版本技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4
- **Markdown**: react-markdown, remark-gfm, rehype-raw

## 目录结构

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
├── package.json
└── tsconfig.json
```

### 关键技术实现

**1. 斑驳光影 (DappledLight)**
- 光晕层：使用 `linear-gradient` 创建渐变光晕
- 树叶层：SVG `feTurbulence` + `feDisplacementMap` 实现风吹效果
- 百叶窗：CSS `flex` + `gap` 实现条纹效果
- 渐进式模糊：4 层 `backdrop-filter` 叠加（6px/12px/48px/96px）

**2. SVG 风吹滤镜**
- `feTurbulence` 生成噪声纹理
- `feDisplacementMap` 应用位移变形
- `<animate>` 动态改变参数，实现持续飘动

**3. 星空效果 (Starfield)**
- 200 个随机分布的星星
- 闪烁动画（opacity + scale）
- 仅在夜间时段显示

**4. 萤火虫效果 (Fireflies)**
- 30 个萤火虫
- 飞行动画 + 闪烁
- 在傍晚和深夜时段显示

**5. Markdown 内容渲染**
- 使用 `react-markdown` 渲染 Markdown
- 支持 GitHub Flavored Markdown (`remark-gfm`)
- 支持内联 HTML (`rehype-raw`)
- 自定义组件映射（tip1, tip2 标签等）

**6. 6 个时段自动切换**
- 黎明（05:00-07:00）：紫色背景 + 星星
- 上午（07:00-11:00）：暖白背景 + 阳光
- 中午（11:00-14:00）：纯白背景 + 最亮
- 下午（14:00-17:00）：暖黄背景 + 斜阳
- 傍晚（17:00-20:00）：橙红背景 + 萤火虫
- 深夜（20:00-05:00）：深蓝背景 + 星星 + 萤火虫

### 页面路由结构

```
/                          # 首页（从 content/home.md 加载）
/about                     # 关于页（从 content/about.md 加载）
/projects                  # 项目页（从 content/projects.md 加载）
/[slug]                    # 动态页面（从 content/[slug].md 加载）
```

每个页面都需要：
1. 在 `content/` 目录创建对应的 MD 文件
2. 在 `src/app/` 创建对应的路由目录和 `page.tsx`
3. 使用 `ThemeProvider` 包裹内容
4. 加载光影效果组件（DappledLight, Starfield, Fireflies, AmbientSound）

## 包管理规范

**仅允许使用 pnpm** 作为包管理器，**严禁使用 npm 或 yarn**。
**常用命令**：
- 安装依赖：`pnpm add <package>`
- 安装开发依赖：`pnpm add -D <package>`
- 安装所有依赖：`pnpm install`
- 移除依赖：`pnpm remove <package>`

## 开发规范

- **项目理解加速**：初始可以依赖项目下`package.json`文件理解项目类型，如果没有或无法理解退化成阅读其他文件。
- **Hydration 错误预防**：严禁在 JSX 渲染逻辑中直接使用 typeof window、Date.now()、Math.random() 等动态数据。必须使用 'use client' 并配合 useEffect + useState 确保动态内容仅在客户端挂载后渲染；同时严禁非法 HTML 嵌套（如 <p> 嵌套 <div>）。
- **页面组件结构**：所有页面必须使用 `'use client'` 指令，并使用 `ThemeProvider` 包裹内容。

## UI 设计与组件规范 (UI & Styling Standards)

- 模板默认预装核心组件库 `shadcn/ui`，位于`src/components/ui/`目录下
- Next.js 项目**必须默认**采用 shadcn/ui 组件、风格和规范，**除非用户指定用其他的组件和规范。**

## Markdown 内容规范

### 文件位置

所有 Markdown 内容文件放在 `content/` 目录，构建时复制到 `public/content/` 目录。

### 文件格式

```markdown
---
title: "页面标题"
---

# 页面内容

## 子标题

- 列表项 1
- 列表项 2

[链接](url)
```

### 自定义标签

- `tip1` - 绿色标签（用于"新"、"推荐"等）
- `tip2` - 蓝色标签（用于"全职"、"捐赠"等）

示例：
```markdown
项目名称<span class="tip1">新</span>
项目名称<span class="tip2">全职</span>
```

### 主题配置编辑

所有时段配置在 `src/contexts/ThemeContext.tsx` 中定义：

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

## 常见任务

### 添加新页面

1. 在 `content/` 创建 MD 文件
2. 在 `src/app/` 创建路由目录和 `page.tsx`
3. 参考 `src/app/page.tsx` 的结构

### 调整光影效果

编辑 `src/contexts/ThemeContext.tsx` 调整时段配置
编辑 `src/components/effects/VisualEffects.tsx` 调整效果参数

### 调整 Markdown 样式

编辑 `src/components/MarkdownContent.tsx` 修改组件映射
