import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const display = localFont({ src: [
  { path: '../../public/fonts/instrument-serif-latin-400-normal.woff2', weight: '400', style: 'normal' },
  { path: '../../public/fonts/instrument-serif-latin-400-italic.woff2', weight: '400', style: 'italic' },
], variable: '--font-display', display: 'swap' });
const sans = localFont({ src: [
  { path: '../../public/fonts/plus-jakarta-sans-latin-400-normal.woff2', weight: '400' },
  { path: '../../public/fonts/plus-jakarta-sans-latin-500-normal.woff2', weight: '500' },
  { path: '../../public/fonts/plus-jakarta-sans-latin-600-normal.woff2', weight: '600' },
], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  title: 'CITRUS 01 — A little liquid sunshine.',
  description: 'For unhurried afternoons and all the bright moments in between. Discover CITRUS 01, an independent sparkling citrus beverage concept.',
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { themeColor: '#F6F0DF' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${display.variable} ${sans.variable}`}><a className="skip-link" href="#main">Skip to content</a>{children}</body></html>;
}
