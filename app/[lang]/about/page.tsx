import type { Metadata } from "next";
import { getDictionary, type Locale } from "@/lib/i18n";
import { getActivityData } from "@/lib/content";
import { SoloCounter } from "@/components/solo-counter";
import { AgeProgress } from "@/components/age-progress";
import { ActivityHeatmap } from "@/components/activity-heatmap";
import { VisitorCounter } from "@/components/visitor-counter";
import { ProjectCard } from "@/components/project-card";
import { RichText } from "@/components/rich-text";
import { projects } from "@/lib/projects";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: langParam } = await params;
  const lang = langParam as Locale;
  const t = getDictionary(lang).about;
  return { title: t.title };
}

const openSourceItems = [
  { name: "macos-calendar-assistant-skill", href: "https://github.com/bryant24hao/macos-calendar-assistant-skill" },
  { name: "oc-doctor", href: "https://github.com/bryant24hao/oc-doctor" },
  { name: "cc-speed", href: "https://github.com/bryant24hao/cc-speed" },
  { name: "skill-publisher", href: "https://github.com/bryant24hao/skill-publisher" },
];

const contacts = [
  { label: "GitHub", href: "https://github.com/bryant24hao", text: "bryant24hao" },
  { label: "X", href: "https://x.com/bryantChenzh", text: "@bryantChenzh" },
  { label: "LinkedIn", href: "https://linkedin.com/in/zhenghao-chen-4ab16a16b/", text: "Zhenghao Chen" },
  { label: "Email", href: "mailto:chenzhenghao94@gmail.com", text: "chenzhenghao94@gmail.com" },
];

export default async function AboutPage({ params }: PageProps) {
  const { lang: langParam } = await params;
  const lang = langParam as Locale;
  const t = getDictionary(lang).about;
  const osDesc = getDictionary(lang).openSourceDescriptions;

  const activityData = getActivityData(lang);

  const buildingProjects = projects.filter((project) =>
    project.categories.some((category) => ["app", "web", "hardware"].includes(category))
  );
  const chromeExtensions = projects.filter((project) =>
    project.categories.includes("extension") && !project.categories.includes("app")
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-4">{t.title}</h1>
      <div className="space-y-1">
        <AgeProgress />
        <SoloCounter lang={lang} />
        <VisitorCounter locale={lang} />
      </div>

      <div className="mt-6 space-y-4 text-neutral-700 dark:text-neutral-300 leading-relaxed">
        <p>{t.intro1}</p>
        <p>
          {t.intro2Pre}
          <a
            href="https://motiff.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:decoration-2"
          >
            {t.intro2Link}
          </a>
          {t.intro2Post}
        </p>
      </div>

      <ActivityHeatmap data={activityData} locale={lang} />

      <section className="mt-10">
        <h2 className="font-semibold mb-4">{t.building}</h2>
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {buildingProjects.map((project) => (
            <ProjectCard key={project.name} lang={lang} {...project} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-semibold mb-4">{t.chromeExtensions}</h2>
        <ul className="space-y-2">
          {chromeExtensions.map((item) => (
            <li key={item.name} className="text-sm">
              <a
                href={item.url || item.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-2 hover:decoration-2"
              >
                {item.name}
              </a>
              <span className="text-neutral-500">
                {" "}
                — <RichText text={item.description[lang]} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-semibold mb-4">{t.openSource}</h2>
        <ul className="space-y-2">
          {openSourceItems.map((item) => (
            <li key={item.name} className="text-sm">
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium underline underline-offset-2 hover:decoration-2"
              >
                {item.name}
              </a>
              <span className="text-neutral-500">
                {" "}
                — {projects.find((project) => project.name === item.name)?.description[lang] ?? osDesc[item.name as keyof typeof osDesc]}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-semibold mb-2">{t.tech}</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {t.techDetail}
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-semibold mb-3">{t.contact}</h2>
        <ul className="space-y-1.5 text-sm">
          {contacts.map((c) => (
            <li key={c.label} className="flex gap-2">
              <span className="text-neutral-400 w-16 shrink-0">{c.label}</span>
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:decoration-2"
              >
                {c.text}
              </a>
            </li>
          ))}
          <li className="flex gap-2">
            <span className="text-neutral-400 w-16 shrink-0">RSS</span>
            <a
              href={`/${lang}/feed.xml`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:decoration-2"
            >
              {lang === "zh" ? "订阅 RSS" : "Subscribe via RSS"}
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
