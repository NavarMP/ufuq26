import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Schedule & Timetable | UFUQ ’26 — Seven Days of Transformation",
  description:
    "Explore the complete 7-day chronological timetable for UFUQ ’26 (Dec 24–30, 2026). Features integrated prayer rhythms, academic masterclasses, research workshops, mentorship circles, 7-day matrix, dual Hijri calendar, and personal calendar sync.",
  keywords: [
    "UFUQ 26 Schedule",
    "Alathurpadi Dars Timetable",
    "SUFFA Camp Schedule",
    "Islamic Leadership Camp",
    "Academic Transition Program",
    "Dec 24-30 2026",
    "Kerala Dars Event",
    "ADSA",
  ],
  openGraph: {
    title: "UFUQ ’26 Schedule & Horizon Timetable — Dec 24–30, 2026",
    description:
      "Seven days of transformation: 24+ masterclasses, 15+ scholar faculty, integrated prayer pauses, and universal calendar export.",
    url: "https://alathurpadidars.in/schedule",
    siteName: "UFUQ ’26",
    images: [
      {
        url: "/images/UFUQ-Logo-app.svg",
        width: 1080,
        height: 1080,
        alt: "UFUQ ’26 Schedule & Timetable",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UFUQ ’26 Schedule & Timetable (Dec 24–30, 2026)",
    description: "Seven days of transformation bridging classical Ilm with university excellence.",
  },
};

export default function ScheduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: "UFUQ ’26 — A Transition & Leadership Camp",
    description:
      "A week-long residential leadership and transition camp for SUFFA Dars scholars moving on to higher studies.",
    startDate: '2026-12-24T09:00:00+05:30',
    endDate: '2026-12-30T19:00:00+05:30',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Alathurpadi Dars Campus & Conference Hall',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Alathurpadi',
        addressRegion: 'Kerala',
        postalCode: '676503',
        addressCountry: 'IN',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'Alathurpadi Dars Students Association (ADSA)',
      url: 'https://alathurpadidars.in',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
