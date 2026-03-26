import type { Metadata } from "next";
import { getDictionary, type Locale } from "@/lib/i18n";
import { SoloCounter } from "@/components/solo-counter";

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
  { name: "拾刻 (Shike)", href: "https://github.com/bryant24hao/shike" },
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
  const projDesc = getDictionary(lang).projectDescriptions;
  const osDesc = getDictionary(lang).openSourceDescriptions;

  const buildingProjects = [
    { name: "MemoryX", desc: projDesc.MemoryX },
    {
      name: "ClawPuter",
      desc: projDesc.ClawPuter,
      extra: `68 ${t.stars}`,
      href: "https://github.com/bryant24hao/ClawPuter",
    },
    { name: "Curioso", desc: projDesc.Curioso },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-4">{t.title}</h1>
      <SoloCounter lang={lang} />

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

      <section className="mt-10">
        <h2 className="font-semibold mb-4">{t.building}</h2>
        <div className="space-y-4">
          {buildingProjects.map((project) => (
            <div key={project.name}>
              <h3 className="font-medium">
                {project.href ? (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:decoration-2"
                  >
                    {project.name}
                  </a>
                ) : (
                  project.name
                )}
                {project.extra && (
                  <span className="text-sm font-normal text-neutral-400 ml-2">
                    {project.extra}
                  </span>
                )}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                {project.desc}
              </p>
            </div>
          ))}
        </div>
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
                — {osDesc[item.name as keyof typeof osDesc]}
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
        </ul>
      </section>
    </div>
  );
}
