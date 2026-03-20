import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bryant Chen",
    template: "%s — Bryant Chen",
  },
  description: "Bryant Chen's personal website.",
  metadataBase: new URL("https://bryantchen.cc"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={inter.className}>
      <body className="bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 antialiased">
        {children}
      </body>
    </html>
  );
}
