import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';
import { AudioProvider } from '@/context/AudioContext';
import { EventProvider } from '@/context/EventContext';
import CustomCursor from '@/components/CustomCursor';
import OfflineBanner from '@/components/OfflineBanner';

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
        url: '/images/UFUQ-Logo.svg',
        width: 1200,
        height: 630,
        alt: 'UFUQ ’26 Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/images/UFUQ-Logo.svg',
    apple: '/images/UFUQ-Logo.svg',
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
              <AudioProvider>
                <CustomCursor />
                <OfflineBanner />
                {children}
              </AudioProvider>
            </EventProvider>
          </AuthProvider>
        </AppProvider>
      </body>
    </html>
  );
}
