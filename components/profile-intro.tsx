import { getDictionary, type Locale } from "@/lib/i18n";

export function ProfileIntro({ lang }: { lang: Locale }) {
  const t = getDictionary(lang).about;

  return (
    <>
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
    </>
  );
}
