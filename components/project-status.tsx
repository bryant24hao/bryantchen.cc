import type { ProjectStatus } from "@/lib/projects";
import { getDictionary, type Locale } from "@/lib/i18n";

const DOT_COLORS: Record<ProjectStatus, string> = {
  earning: "bg-emerald-500",
  live: "bg-sky-500",
  building: "bg-amber-500",
  paused: "bg-neutral-400",
  archived: "bg-neutral-300 dark:bg-neutral-600",
};

interface Props {
  status: ProjectStatus;
  lang: Locale;
}

export function ProjectStatusBadge({ status, lang }: Props) {
  const label = getDictionary(lang).about.projectStatus[status];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-normal text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
      <span
        className={`inline-block w-1.5 h-1.5 rounded-full ${DOT_COLORS[status]}`}
      />
      {label}
    </span>
  );
}
