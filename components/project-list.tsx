"use client";

import { useState } from "react";
import { getDictionary, type Locale } from "@/lib/i18n";
import { projectCategories, type Project, type ProjectCategory } from "@/lib/projects";
import { ProjectCard } from "./project-card";

export function ProjectList({ projects, lang }: { projects: Project[]; lang: Locale }) {
  const [category, setCategory] = useState<ProjectCategory | "all">("all");
  const t = getDictionary(lang).projects;
  const visibleProjects = category === "all"
    ? projects
    : projects.filter((project) => project.categories.includes(category));

  return (
    <>
      <div role="group" aria-label={t.filterLabel} className="flex flex-wrap gap-2 mb-5">
        {(["all", ...projectCategories] as const).map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={category === value}
            aria-controls="project-results"
            onClick={() => setCategory(value)}
            className={`min-h-11 rounded-full border px-4 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-500 ${
              category === value
                ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-950"
                : "border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-900"
            }`}
          >
            {value === "all" ? t.all : t.categories[value]}
          </button>
        ))}
      </div>
      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {visibleProjects.length} {visibleProjects.length === 1 ? t.singleResult : t.resultCount}
      </p>
      <div id="project-results" className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {visibleProjects.map((project) => (
          <ProjectCard key={project.name} lang={lang} {...project} />
        ))}
      </div>
    </>
  );
}
