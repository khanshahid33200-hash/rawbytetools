import { Metadata } from 'next';
import SEOHead from '@/components/common/SEOHead';

export const metadata: Metadata = {
  title: 'Terms of Service - RauByte Tools',
  description: 'Terms of Service for RauByte Tools Image and PDF Toolkit.'
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 py-16 px-4 sm:px-6 lg:px-8">
      <SEOHead />
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Terms of Service</h1>
        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 text-xs text-slate-700 leading-relaxed">
          <p>
            By accessing and using RauByte Tools, you agree to comply with the following terms and conditions.
          </p>

          <h3 className="text-sm font-bold text-slate-900">1. Acceptable Use</h3>
          <p>
            RauByte Tools is provided for lawful personal and commercial image and PDF editing. You are responsible for ensuring that you have legal rights to process any files you upload into the application.
          </p>

          <h3 className="text-sm font-bold text-slate-900">2. Disclaimer of Warranty</h3>
          <p>
            The software is provided &quot;as is&quot;, without warranty of any kind, express or implied. In no event shall RauByte Tools be liable for any data loss resulting from local file processing.
          </p>
        </div>
      </div>
    </div>
  );
}
