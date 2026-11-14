import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Gallery & Horizons — Visual Sanctuary | UFUQ '26",
  description:
    "Explore the visual archive of Alathurpadi Dars, the revered Ustads, ADSA, SUFFA 39+ confederation, the sacred philosophy of Suhbah, and Camp UFUQ ’26.",
  openGraph: {
    title: "Gallery & Horizons — UFUQ '26",
    description: "Visual sanctuary of classical Islamic scholarship and future leadership horizons.",
    images: ['/images/og/default.png'],
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
