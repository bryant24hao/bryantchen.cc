const LINK_RE = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;

export function RichText({ text }: { text: string }) {
  const parts: (string | { text: string; href: string })[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(LINK_RE)) {
    if (match.index! > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push({ text: match[1], href: match[2] });
    lastIndex = match.index! + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  if (parts.length === 1 && typeof parts[0] === "string") {
    return <>{text}</>;
  }

  return (
    <>
      {parts.map((part, i) =>
        typeof part === "string" ? (
          part
        ) : (
          <a
            key={i}
            href={part.href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:decoration-2"
          >
            {part.text}
          </a>
        )
      )}
    </>
  );
}
