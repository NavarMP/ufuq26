import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interactive Guide & Experience Manual | UFUQ ’26 — أُفُق',
  description:
    'Comprehensive interactive guide for SUFFA Dars delegates, mudarris coordinators, and organizers attending UFUQ ’26 at Alathurpadi Dars Campus, Malappuram (December 24–30, 2026).',
  openGraph: {
    title: 'UFUQ ’26 Interactive Guide & Experience Manual',
    description:
      'Rooted in Ilm. Ready for the World. Explore the 7-day schedule, student registration, campus transit routes, and delegate readiness checklist.',
    images: [
      {
        url: '/images/UFUQ-Logo.svg',
        width: 1200,
        height: 630,
        alt: 'UFUQ ’26 Guide',
      },
    ],
  },
};

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
