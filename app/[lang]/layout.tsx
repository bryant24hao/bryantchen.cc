import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { locales, defaultLocale, isValidLocale, type Locale } from "@/lib/i18n";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    alternates: {
      types: {
        "application/rss+xml": `https://bryantchen.cc/${lang}/feed.xml`,
      },
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  if (!isValidLocale(langParam)) notFound();
  const lang = langParam as Locale;

  return (
    <div lang={lang} className="max-w-2xl mx-auto px-6">
      <Nav lang={lang} />
      <main className="min-h-[60vh] py-8">{children}</main>
      <Footer lang={lang} />
    </div>
  );
}
