# 分享卡片设计文档

## 背景

碎碎念和文章详情页需要一个分享功能，方便在手机端以便签/卡片的形式保存图片，分享到微信、社交媒体等平台。

## 设计目标

- 零额外 npm 依赖
- 便签风格，黑白极简，和网站整体视觉一致
- 手机端长按图片即可保存到相册
- 碎碎念和文章都支持
- 包含 QR 码（内联实现，不装包）

## 交互流程

```
用户在内容页 → 点击「分享」按钮
                  ↓
         弹出全屏半透明遮罩 + 提示"长按图片保存"
                  ↓
     居中显示一张 Canvas 渲染的卡片图片（<img> 标签）
                  ↓
     用户长按图片保存到相册 / 点击遮罩关闭
```

### 分享按钮位置

- **碎碎念列表页**：每条碎碎念右下角，一个小的分享图标
- **文章详情页**：文章末尾，一个「分享这篇文章」按钮

### 关闭方式

- 点击图片外的遮罩区域
- 点击遮罩上方的 × 按钮（带 `aria-label="Close"`）
- 按 Escape 键关闭

## 卡片视觉设计

### 碎碎念卡片

```
┌─────────────────────────────┐
│                             │
│  正文内容显示在这里，最多    │  ← 正文，最多 200 字
│  显示 200 字，超出部分用     │     超出截断加 ...
│  省略号表示...               │     保留原文换行
│                             │
│                             │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │  ← 虚线分隔
│                             │
│  ┌─────┐  bryantchen.cc    │  ← QR 码 + 域名
│  │ QR  │                    │
│  │Code │  2026.03.24        │  ← 日期（简洁格式）
│  └─────┘                    │
│                             │
└─────────────────────────────┘
```

### 文章卡片

```
┌─────────────────────────────┐
│                             │
│  写在一人公司第 60 天        │  ← 标题（大号加粗）
│                             │
│  写在一人公司第 60 天的      │  ← 摘要（description）
│  一些想法和感悟              │
│                             │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│                             │
│  ┌─────┐  bryantchen.cc    │
│  │ QR  │                    │
│  │Code │  2026.03.23        │
│  └─────┘                    │
│                             │
└─────────────────────────────┘
```

### 视觉规范

- **卡片尺寸**：宽度 340 × dpr px（dpr 取 `window.devicePixelRatio`，上限 3），CSS 显示宽度 340px
- **背景色**：白色 `#ffffff`（暗色模式下也用白色，保证分享图片一致）
- **圆角**：12 × dpr px
- **内边距**：32 × dpr px
- **正文字体**：`-apple-system, "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif`（系统字体栈，确保中文覆盖）
- **正文字号**：15 × dpr px，行高 1.7
- **底部域名/日期字号**：12 × dpr px，颜色 `#999`
- **分隔线**：1 × dpr px 虚线，颜色 `#e5e5e5`
- **QR 码尺寸**：64 × dpr px
- **遮罩**：黑色 60% 透明度

### 页脚布局

QR 码左侧，右侧两行文字垂直居中对齐 QR 码：
- 第一行：`bryantchen.cc`（域名）
- 第二行：`2026.03.24`（日期，点分隔格式）

不显示作者名、不显示完整 URL 路径。

## 技术方案

### 核心思路

**整张卡片用 Canvas 绘制，最终输出为 `<img>` 标签。** 手机浏览器原生支持长按 `<img>` 保存到相册，无需任何额外库。

流程：
1. 点击分享按钮 → 创建隐藏的 Canvas
2. Canvas 上绘制：背景 → 圆角矩形 → 文字（自动换行）→ 虚线 → QR 码 → 页脚文字
3. `canvas.toDataURL("image/png")` 导出为 base64 图片
4. 将 base64 赋值给 `<img src>` 显示在弹窗中
5. 用户长按图片 → 手机原生"保存图片"菜单

### 新增文件

```
lib/
  qr.ts              # 内联 QR 码生成器（vendor 成熟开源实现）
  share-canvas.ts     # Canvas 绘制逻辑（绘制卡片 + 文字排版 + QR 码）
components/
  share-card.tsx      # 分享弹窗组件（client component，展示 <img>）
  thought-share-button.tsx  # 碎碎念分享按钮（client component）
  post-share-button.tsx     # 文章分享按钮（client component）
```

### 各文件职责

**`lib/qr.ts`**
- 输入：URL 字符串
- 输出：`boolean[][]` 二维矩阵（QR 码点阵）
- 纯计算，不涉及 DOM
- **内联一个成熟的开源 QR 编码器**（如 nayuki/QR-Code-generator 的 TypeScript 版，约 500 行），不自己从头写
- 完整支持 Reed-Solomon 纠错、掩码选择，确保 WeChat 扫码兼容
- 文件顶部注明来源和开源许可

**`lib/share-canvas.ts`**
- 输入：`ShareCardData`（type, content/title/description, date, url）
- 输出：base64 PNG 字符串
- 职责：
  - 读取 `window.devicePixelRatio`（上限 3）作为缩放倍率
  - 创建 Canvas（340 × dpr 宽，高度根据内容自适应）
  - 绘制白色圆角矩形背景
  - 绘制正文（碎碎念：正文截取 200 字；文章：标题 + 摘要）
  - 自动换行排版（`ctx.measureText` 计算文字宽度，先按 `\n` 分段再逐段排版）
  - 绘制虚线分隔
  - 绘制 QR 码（读取 `qr.ts` 的矩阵，逐像素填充）
  - 绘制页脚文字（域名 + 日期）
  - `canvas.toDataURL()` 导出

**`components/share-card.tsx`**
- Client component（`"use client"`）
- 接收 base64 图片数据，显示弹窗
- 弹窗内是一个 `<img>` 标签，支持长按保存
- 遮罩点击关闭
- 弹窗顶部显示提示文字："长按图片保存"
- 支持 `navigator.share()` 渐进增强（可用时显示"分享到..."按钮）

**`components/thought-share-button.tsx`**
- Client component，只包含分享图标按钮 + ShareCard 弹窗触发
- 在 `thought-card.tsx`（保持为 server component）中引入

**`components/post-share-button.tsx`**
- Client component，包含"分享这篇文章"按钮 + ShareCard 弹窗触发
- 在文章详情页底部引入

### 组件接口

```tsx
// share-card.tsx
interface ShareCardProps {
  type: "thought" | "post";
  content?: string;       // 碎碎念正文
  title?: string;         // 文章标题
  description?: string;   // 文章摘要
  date: string;           // 日期
  url: string;            // 完整页面 URL（用于 QR 码）
  onClose: () => void;
}
```

### 架构决策：保持 thought-card.tsx 为 server component

**不把 `thought-card.tsx` 改成 client component。** 原因：
- ThoughtCard 在首页和碎碎念列表页都有使用，转为 client component 会破坏 SSG
- 所有内容（文字、标签、日期）需要序列化为 JS props 发送到客户端，增加 bundle 大小
- Linkify 等纯展示逻辑没必要跑在客户端

正确做法：和文章页一样，抽出独立的 `ThoughtShareButton` client component，只包裹分享交互逻辑。ThoughtCard 本身保持为零 JS 的 server component。

```tsx
// thought-card.tsx（保持 server component）
import { ThoughtShareButton } from "./thought-share-button";

export function ThoughtCard({ ... }) {
  return (
    <div>
      {/* 静态内容渲染 */}
      <p>{content}</p>
      {/* 只有分享按钮是 client component */}
      <ThoughtShareButton content={content} date={date} url={url} />
    </div>
  );
}
```

### Canvas 文字自动换行

Canvas 原生不支持文字换行，需要手动实现。**先按 `\n` 分段，再逐段排版**（碎碎念内容保留原文换行）：

```tsx
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const paragraphs = text.split("\n");
  const lines: string[] = [];
  for (const para of paragraphs) {
    if (para === "") {
      lines.push("");
      continue;
    }
    let current = "";
    for (const char of para) {
      if (ctx.measureText(current + char).width > maxWidth) {
        lines.push(current);
        current = char;
      } else {
        current += char;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}
```

对碎碎念截取前 200 字，文章只显示标题 + description。

### 弹窗滚动锁定

弹窗打开时禁止背景滚动，使用 CSS 方案避免 iOS Safari 抖动：

```tsx
// 打开弹窗时
const scrollY = window.scrollY;
document.body.style.position = "fixed";
document.body.style.top = `-${scrollY}px`;
document.body.style.width = "100%";

// 关闭弹窗时
document.body.style.position = "";
document.body.style.top = "";
window.scrollTo(0, scrollY);
```

遮罩层使用 `overscroll-behavior: contain` 防止滚动穿透。

### 无障碍 (Accessibility)

- 弹窗添加 `role="dialog"` 和 `aria-modal="true"`
- 关闭按钮添加 `aria-label="Close"`
- 监听 Escape 键关闭弹窗
- 弹窗打开时 focus 到弹窗内部

### WeChat 兼容性注意

WeChat 内置浏览器对 base64 `<img>` 长按保存的支持**因版本而异**：
- 多数新版本支持正常保存
- 部分旧版本可能显示空白预览

应对策略：
- 弹窗顶部始终显示"长按图片保存"文字提示
- 如果后续 WeChat 兼容性确认有问题，可改为服务端生成图片（API route 返回真实 PNG URL），WeChat 对真实 URL 图片保存完全兼容
- 当前先用 base64 方案，实测后再决定是否需要回退

### 顺手修复：Linkify 正则 bug

`thought-card.tsx` 中的 `URL_RE` 使用了 `g` flag，导致 `test()` 方法有状态（`lastIndex` 被修改）。在 `Linkify` 组件中，`split` 和 `test` 交替使用同一个全局正则会导致间歇性匹配失败。

修复：`test` 时使用独立的非全局正则：

```tsx
const URL_RE = /(https?:\/\/[^\s]+)/g;        // 用于 split
const URL_TEST = /^https?:\/\/[^\s]+$/;        // 用于 test（无 g flag）

function Linkify({ text }: { text: string }) {
  const parts = text.split(URL_RE);
  return (
    <>
      {parts.map((part, i) =>
        URL_TEST.test(part) ? (
          <a key={i} href={part} ...>{part}</a>
        ) : (
          part
        )
      )}
    </>
  );
}
```

## 渐进增强：Web Share API

在支持 `navigator.share` 的浏览器中（iOS Safari、Android Chrome），弹窗内额外显示一个"分享到..."按钮：

```tsx
if (navigator.canShare && navigator.canShare({ files: [file] })) {
  await navigator.share({
    files: [new File([blob], "share.png", { type: "image/png" })],
  });
}
```

这可以直接调起系统分享面板（AirDrop、微信、Telegram 等）。WeChat 内置浏览器不支持此 API，会自动隐藏按钮，回退到长按保存。

## 未来扩展

- **自定义背景色/样式**：Canvas 方案天然支持，改绘制参数即可
- **加 Logo/水印**：在 Canvas 上额外绘制
- **多种卡片样式**：增加不同模板（明信片风格、极简风格等）
- **服务端生成**：如 WeChat 兼容性有问题，改用 API route + `next/og`（Satori）生成真实图片 URL

## 实施步骤

1. 修复 `thought-card.tsx` 中的 Linkify 正则 bug
2. 创建 `lib/qr.ts` — 内联成熟开源 QR 编码器
3. 创建 `lib/share-canvas.ts` — Canvas 卡片绘制逻辑（含 dpr 适配、文字换行、QR 绘制）
4. 创建 `components/share-card.tsx` — 弹窗组件（含滚动锁定、无障碍、Web Share API）
5. 创建 `components/thought-share-button.tsx` — 碎碎念分享按钮（client component）
6. 创建 `components/post-share-button.tsx` — 文章分享按钮（client component）
7. 在 `thought-card.tsx`（保持 server component）中引入 ThoughtShareButton
8. 在文章详情页底部引入 PostShareButton
9. 测试：Canvas 渲染效果、QR 码可扫描（微信 + iOS 相机）、长按保存、移动端兼容性、暗色模式
10. 部署验证
