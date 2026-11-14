import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About UFUQ ’26 | Alathurpadi Dars, Ustads, ADSA, SUFFA & SUHBA",
  description:
    "Discover the venerable legacy of Alathurpadi Dars, the guidance of our respected Ustads, the fraternities of ADSA and SUFFA, the sacred philosophy of Suhbah, and the transformative 7-day curriculum of Camp UFUQ ’26.",
  openGraph: {
    title: "About UFUQ ’26 — Rooted in Ilm. Ready for the World.",
    description:
      "A transition and leadership camp organized by Alathurpadi Dars Students Association (ADSA) for SUFFA scholars.",
    url: "https://alathurpadidars.in/about",
    siteName: "UFUQ ’26",
    images: [
      {
        url: "/images/UFUQ-Logo.svg",
        width: 1200,
        height: 630,
        alt: "UFUQ ’26 About Page",
      },
    ],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
