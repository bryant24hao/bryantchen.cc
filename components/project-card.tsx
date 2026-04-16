import type { Project } from "@/lib/projects";
import type { Locale } from "@/lib/i18n";
import { ProjectStatusBadge } from "./project-status";
import { RichText } from "./rich-text";

interface ProjectCardProps extends Project {
  lang: Locale;
}

export function ProjectCard({ name, description, url, repo, stars, tags, status, lang }: ProjectCardProps) {
  const link = url || repo;

  const content = (
    <div className="py-4">
      <h3 className="font-medium">
        {name}
        {link && (
          <span className="text-xs text-neutral-400 dark:text-neutral-500 ml-2 align-middle">
            &rarr;
          </span>
        )}
      </h3>
      {(status || (stars != null && stars > 0)) && (
        <div className="flex items-center gap-3 mt-1">
          {status && <ProjectStatusBadge status={status} lang={lang} />}
          {stars != null && stars > 0 && (
            <span className="text-xs text-neutral-400 dark:text-neutral-500">
              {stars} stars
            </span>
          )}
        </div>
      )}
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
        <RichText text={description[lang]} />
      </p>
      <div className="flex gap-2 mt-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs text-neutral-400 dark:text-neutral-500"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );

  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:bg-neutral-50 dark:hover:bg-neutral-900 -mx-3 px-3 rounded-lg transition-colors"
      >
        {content}
      </a>
    );
  }

  return content;
}
