import type { Metadata } from "next";
import { getDictionary, type Locale } from "@/lib/i18n";
import { projects } from "@/lib/projects";
import { ProjectList } from "@/components/project-list";

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
      <ProjectList projects={projects} lang={lang} />
    </div>
  );
}
