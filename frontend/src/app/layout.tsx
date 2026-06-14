import type { Metadata, Viewport } from 'next';
import { Spectral, Inter_Tight, Red_Hat_Mono } from 'next/font/google';
import './globals.css';

const display = Spectral({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const body = Inter_Tight({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

const mono = Red_Hat_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

const TITLE = 'Constellation, a collaborative relay chain of stars';
const DESCRIPTION =
  'Co-author one shared, growing constellation a single star at a time. An AI Stargazer judges each new link under consensus on GenLayer Bradbury Testnet.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  applicationName: 'Constellation',
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    siteName: 'Constellation',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
  icons: { icon: '/constellation/favicon.svg' },
};

export const viewport: Viewport = {
  themeColor: '#07060f',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
