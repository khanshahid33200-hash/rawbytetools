import { Metadata } from 'next';
import SEOHead from '@/components/common/SEOHead';

export const metadata: Metadata = {
  title: 'Privacy Policy - RawByte Tools',
  description: 'RawByte Tools Privacy Policy. 100% client-side file processing guaranteed.'
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 py-16 px-4 sm:px-6 lg:px-8">
      <SEOHead />
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 text-xs text-slate-700 leading-relaxed">
          <p>
            At RawByte Tools, accessible from rawbytetools.com, your privacy is our top priority.
          </p>

          <h3 className="text-sm font-bold text-slate-900">1. Client-Side Processing</h3>
          <p>
            All image and PDF file modifications (compression, resizing, cropping, converting, merging, splitting, watermarking) occur entirely within your web browser. No files are uploaded to our web servers.
          </p>

          <h3 className="text-sm font-bold text-slate-900">2. No File Storage</h3>
          <p>
            Because file processing takes place in your local memory, we do not store, view, or retain any of your uploaded files or processed outputs.
          </p>

          <h3 className="text-sm font-bold text-slate-900">3. Analytics & Cookies</h3>
          <p>
            We may use anonymous standard Web Analytics to understand website traffic patterns and improve utility functionality. No personal data or file information is collected.
          </p>
        </div>
      </div>
    </div>
  );
}
