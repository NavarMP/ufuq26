import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';
import { AudioProvider } from '@/context/AudioContext';
import { EventProvider } from '@/context/EventContext';
import { DarsAuthProvider } from '@/context/DarsAuthContext';
import { PreferencesProvider } from '@/context/PreferencesContext';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import CustomScrollbar from '@/components/CustomScrollbar';
import CustomCursor from '@/components/CustomCursor';
import OfflineBanner from '@/components/OfflineBanner';
import SettingsModal from '@/components/settings/SettingsModal';
import { ReminderProvider } from '@/context/ReminderContext';
import ReminderModal from '@/components/reminders/ReminderModal';
import ReminderCenterDrawer from '@/components/reminders/ReminderCenterDrawer';
import { NotificationProvider } from '@/context/NotificationContext';
import NotificationCenterDrawer from '@/components/notifications/NotificationCenterDrawer';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  metadataBase: new URL('https://alathurpadidars.in'),
  title: 'UFUQ ’26 | أُفُق — A Transition & Leadership Camp',
  description:
    'Rooted in Ilm. Ready for the World. A week-long transition and leadership camp organized by Alathurpadi Dars Students Association (ADSA) for students from SUFFA Dars moving on to higher studies. December 24–30, 2026.',
  keywords: [
    'UFUQ 26',
    'UFUQ',
    'أفق',
    'Alathurpadi Dars',
    'ADSA',
    'SUFFA Dars',
    'Transition Camp',
    'Leadership Camp',
    'Islamic Higher Education',
    'Kerala',
  ],
  authors: [{ name: 'Alathurpadi Dars Students Association (ADSA)' }],
  manifest: '/manifest.json',
  openGraph: {
    title: 'UFUQ ’26 | أُفُق — A Transition & Leadership Camp',
    description: 'Rooted in Ilm. Ready for the World. December 24–30, 2026 at Alathurpadi Dars Campus.',
    url: 'https://alathurpadidars.in',
    siteName: 'UFUQ ’26',
    images: [
      {
        url: '/images/og/og-default.png',
        width: 1200,
        height: 630,
        alt: "UFUQ ’26 — Rooted in Ilm. Ready for the World.",
        type: 'image/png',
      },
      {
        url: '/images/UFUQ-Logo-app.svg',
        width: 1080,
        height: 1080,
        alt: 'UFUQ ’26 Emblem',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UFUQ ’26 | أُفُق — A Transition & Leadership Camp',
    description: 'Rooted in Ilm. Ready for the World. December 24–30, 2026 at Alathurpadi Dars Campus.',
    images: ['/images/og/og-default.png'],
    creator: '@alathoorpadidars',
    site: '@alathoorpadidars',
  },
  icons: {
    icon: '/images/UFUQ-Logo-app.svg',
    apple: '/images/UFUQ-Logo-app.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#101d32',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data for Event & Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Event',
              name: 'UFUQ ’26 — A Transition & Leadership Camp',
              alternateName: 'أُفُق',
              description:
                'A week-long transition and leadership camp organized by Alathurpadi Dars Students Association (ADSA) for students from SUFFA Dars moving on to higher studies. Rooted in Ilm. Ready for the World.',
              startDate: '2026-12-24T09:00:00+05:30',
              endDate: '2026-12-30T17:00:00+05:30',
              eventStatus: 'https://schema.org/EventScheduled',
              eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
              location: {
                '@type': 'Place',
                name: 'Alathurpadi Dars Campus',
                address: {
                  '@type': 'PostalAddress',
                  streetAddress: 'Alathurpadi, Melmuri PO',
                  addressLocality: 'Malappuram',
                  addressRegion: 'Kerala',
                  postalCode: '676517',
                  addressCountry: 'IN',
                },
              },
              image: ['https://alathurpadidars.in/images/og/og-default.png'],
              organizer: {
                '@type': 'Organization',
                name: 'Alathurpadi Dars Students Association (ADSA)',
                url: 'https://alathurpadidars.in',
                logo: 'https://alathurpadidars.in/images/UFUQ-Logo-app.svg',
              },
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'INR',
                availability: 'https://schema.org/InStock',
                url: 'https://alathurpadidars.in#register',
              },
            }),
          }}
        />
        {/* Load Arima font from Google Fonts for Malayalam display with fallback */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Arima:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col font-clash bg-[var(--bg-primary)] text-[var(--text-primary)] antialiased selection:bg-brand-gold selection:text-brand-navy">
        <AppProvider>
          <AuthProvider>
            <EventProvider>
              <DarsAuthProvider>
                <AudioProvider>
                  <ReminderProvider>
                    <PreferencesProvider>
                      <NotificationProvider>
                        <SmoothScrollProvider>
                          <CustomCursor />
                          <CustomScrollbar />
                          <OfflineBanner />
                          <SettingsModal />
                          <ReminderModal />
                          <ReminderCenterDrawer />
                          <NotificationCenterDrawer />
                          <Toaster
                          position="bottom-center"
                          toastOptions={{
                            style: {
                              background: '#101d32',
                              color: '#ffffff',
                              border: '1px solid rgba(201, 164, 92, 0.35)',
                              borderRadius: '16px',
                              fontSize: '13px',
                            },
                          }}
                        />
                        {children}
                      </SmoothScrollProvider>
                    </NotificationProvider>
                  </PreferencesProvider>
                  </ReminderProvider>
                </AudioProvider>
              </DarsAuthProvider>
            </EventProvider>
          </AuthProvider>
        </AppProvider>
      </body>
    </html>
  );
}
