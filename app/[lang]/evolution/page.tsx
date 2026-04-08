import type { Metadata } from "next";
import { getDictionary, type Locale } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(lang as Locale).evolution;
  return { title: t.title };
}

interface TimelineEntry {
  date: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
}

const timeline: TimelineEntry[] = [
  {
    date: "2026-04-08",
    title: {
      zh: "图床 + Markdown 渲染",
      en: "Image Hosting + Markdown Rendering",
    },
    description: {
      zh: "碎碎念支持完整 Markdown 渲染——粗体、列表、图片、链接。搭建独立图床 img.bryantchen.cc，图片不再进主仓库。分享卡片自动清理 Markdown 语法。",
      en: "Thoughts now fully render Markdown — bold, lists, images, links. Set up dedicated image hosting at img.bryantchen.cc to keep the main repo lean. Share cards auto-strip Markdown syntax.",
    },
  },
  {
    date: "2026-04-07",
    title: {
      zh: "RSS 订阅 + 写作热力图",
      en: "RSS Feed + Writing Heatmap",
    },
    description: {
      zh: "中英文独立 RSS feed，全文输出。关于页新增 GitHub 风格写作热力图，颜色深度按字数分级。新增 Chrome 插件板块。所有内容时间精确到分钟。",
      en: "Bilingual RSS feeds with full content. Added GitHub-style writing activity heatmap on the about page, color-coded by word count. New Chrome Extensions section. All content timestamps now precise to the minute.",
    },
  },
  {
    date: "2026-03-25",
    title: {
      zh: "分享卡片 + 迁移到 Cloudflare",
      en: "Share Cards + Cloudflare Migration",
    },
    description: {
      zh: "文章和碎碎念支持生成带二维码的分享卡片。从 Vercel 迁移到 Cloudflare Pages，静态导出部署。",
      en: "Posts and thoughts can now generate share cards with QR codes. Migrated from Vercel to Cloudflare Pages with static export.",
    },
  },
  {
    date: "2026-03-24",
    title: {
      zh: "阅读体验优化",
      en: "Reading Experience Polish",
    },
    description: {
      zh: "碎碎念中的 URL 自动变成可点击链接。保留换行格式。支持精确时间排序，同一天的内容按发布时间先后排列。",
      en: "URLs in thoughts auto-linkified. Line breaks preserved. Precise timestamp sorting so same-day content appears in publish order.",
    },
  },
  {
    date: "2026-03-23",
    title: {
      zh: "移动端适配 + 年龄进度条",
      en: "Mobile Polish + Age Progress Bar",
    },
    description: {
      zh: "修复移动端长链接溢出。新增年龄进度条，点击可切换为预期剩余时间。一人公司天数计时器上线。",
      en: "Fixed long URL overflow on mobile. Added age progress bar — click to toggle life expectancy countdown. Solo company day counter launched.",
    },
  },
  {
    date: "2026-03-22",
    title: {
      zh: "第一篇完整文章",
      en: "First Full Article",
    },
    description: {
      zh: "「搭建这个网站」从简短介绍扩展为完整的技术选型 + 部署全记录。支持 Markdown 表格渲染。",
      en: '"Building This Site" expanded from a brief intro into a full walkthrough of tech decisions and deployment. Markdown table rendering enabled.',
    },
  },
  {
    date: "2026-03-21",
    title: {
      zh: "上线",
      en: "Launch",
    },
    description: {
      zh: "一个晚上，一个命令行窗口，和 AI 聊了几句，个人网站就上线了。Next.js + MDX + Tailwind CSS，中英双语，极简黑白设计。",
      en: "One evening, one terminal window, a few words with AI, and the site was live. Next.js + MDX + Tailwind CSS, bilingual, minimal black-and-white design.",
    },
  },
];

export default async function EvolutionPage({ params }: PageProps) {
  const { lang: langParam } = await params;
  const lang = langParam as Locale;
  const t = getDictionary(lang).evolution;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-2">{t.title}</h1>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-10">
        {t.subtitle}
      </p>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[5px] top-2 bottom-2 w-px bg-neutral-200 dark:bg-neutral-800" />

        <div className="space-y-8">
          {timeline.map((entry, i) => (
            <div key={i} className="relative pl-8">
              {/* Dot */}
              <div
                className={`absolute left-0 top-[6px] w-[11px] h-[11px] rounded-full border-2 ${
                  i === 0
                    ? "border-neutral-900 bg-neutral-900 dark:border-neutral-100 dark:bg-neutral-100"
                    : "border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-950"
                }`}
              />

              <time className="text-xs font-mono text-neutral-400 dark:text-neutral-500">
                {entry.date}
              </time>
              <h2 className="font-medium mt-0.5">{entry.title[lang]}</h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                {entry.description[lang]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
