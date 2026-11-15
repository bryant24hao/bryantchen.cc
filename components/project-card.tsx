import type { Project } from "@/lib/projects";
import { getDictionary, type Locale } from "@/lib/i18n";
import { ProjectStatusBadge } from "./project-status";
import { RichText } from "./rich-text";

interface ProjectCardProps extends Project {
  lang: Locale;
}

export function ProjectCard({ name, description, url, repo, stars, tags, status, period, lang }: ProjectCardProps) {
  const link = url || repo;
  const t = getDictionary(lang).projects;

  const content = (
    <div className="py-4">
      <h3 className="font-medium break-words">
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="after:absolute after:inset-0 after:rounded-lg"
          >
            {name}
          </a>
        ) : name}
        {link && (
          <span className="text-xs text-neutral-400 dark:text-neutral-500 ml-2 align-middle">
            &rarr;
          </span>
        )}
      </h3>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
        {status && <ProjectStatusBadge status={status} lang={lang} />}
        <span className="text-xs text-neutral-400 dark:text-neutral-500">
          <time dateTime={period.start}>{period.start.replace("-", ".")}</time>
          {period.end && (
            <>
              {"—"}
              {period.end === "present" ? t.present : (
                <time dateTime={period.end}>{period.end.replace("-", ".")}</time>
              )}
            </>
          )}
          {period.note && ` · ${period.note[lang]}`}
        </span>
        {stars != null && stars > 0 && (
          <span className="text-xs text-neutral-400 dark:text-neutral-500">
            {stars} stars
          </span>
        )}
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 [&_a]:relative [&_a]:z-10">
        <RichText text={description[lang]} />
      </p>
      <div className="flex flex-wrap gap-2 mt-2">
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
      <div
        className="relative block hover:bg-neutral-50 dark:hover:bg-neutral-900 -mx-3 px-3 rounded-lg transition-colors"
      >
        {content}
      </div>
    );
  }

  return content;
}
