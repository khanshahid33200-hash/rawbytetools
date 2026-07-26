import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ScrollToTop from '@/components/common/ScrollToTop';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import './globals.css';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/utils/constants';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - 100% Free & Private Browser Image & PDF Toolkit`,
    template: `%s | ${SITE_NAME}`
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'image compressor',
    'pdf compressor',
    'resize image',
    'crop photo',
    'pdf to image',
    'merge pdf',
    'split pdf',
    'watermark image',
    'browser side image tools'
  ],
  authors: [{ name: 'RawByte Tools' }],
  creator: 'RawByte Tools',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light scroll-smooth">
      <body className={`${inter.className} bg-white text-slate-900 min-h-screen flex flex-col antialiased selection:bg-cyan-500 selection:text-white`}>
        <ScrollToTop />
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
