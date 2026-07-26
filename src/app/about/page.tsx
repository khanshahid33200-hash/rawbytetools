import { Metadata } from 'next';
import SEOHead from '@/components/common/SEOHead';
import AboutClientUI from './AboutClientUI';

export const metadata: Metadata = {
  title: 'About Us - Founder Shahid Khan & RawByte Tools Mission',
  description: 'Learn about Founder Shahid Khan (Web Developer) and RawByte Tools mission to provide 100% free, private browser utilities for students and applicants.'
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 py-16 px-4 sm:px-6 lg:px-8">
      <SEOHead />
      <AboutClientUI />
    </div>
  );
}
