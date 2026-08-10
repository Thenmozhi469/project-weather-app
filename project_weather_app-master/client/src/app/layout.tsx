import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import QueryProvider from '@/providers/QueryProvider';

export const metadata: Metadata = {
  title: 'WeatherOS — Premium Weather Dashboard',
  description: 'A premium, real-time weather dashboard with live forecasts, air quality data, animated themes and interactive maps.',
  keywords: ['weather', 'forecast', 'dashboard', 'air quality', 'weather map', 'real-time'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f172a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
