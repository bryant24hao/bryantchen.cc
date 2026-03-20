import type { Metadata } from "next";
import { getDictionary, type Locale } from "@/lib/i18n";
import { projects } from "@/lib/projects";
import { ProjectCard } from "@/components/project-card";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: l } = await params;
  const t = getDictionary(l as Locale).projects;
  return { title: t.title };
}

export default async function ProjectsPage({ params }: PageProps) {
  const { lang: langParam } = await params;
  const lang = langParam as Locale;
  const t = getDictionary(lang).projects;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">{t.title}</h1>
      <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {projects.map((project) => (
          <ProjectCard key={project.name} {...project} />
        ))}
      </div>
    </div>
  );
}
