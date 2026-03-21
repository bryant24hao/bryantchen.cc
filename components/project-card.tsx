import type { Project } from "@/lib/projects";
import type { Locale } from "@/lib/i18n";

interface ProjectCardProps extends Project {
  lang: Locale;
}

export function ProjectCard({ name, description, url, repo, stars, tags, lang }: ProjectCardProps) {
  const link = url || repo;

  const content = (
    <div className="py-4">
      <div className="flex items-baseline gap-2">
        <h3 className="font-medium">{name}</h3>
        {stars != null && stars > 0 && (
          <span className="text-xs text-neutral-400 dark:text-neutral-500">
            {stars} stars
          </span>
        )}
        {link && (
          <span className="text-xs text-neutral-400 dark:text-neutral-500">
            &rarr;
          </span>
        )}
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
        {description[lang]}
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
