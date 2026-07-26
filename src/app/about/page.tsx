import { Metadata } from 'next';
import SEOHead from '@/components/common/SEOHead';
import { Lock, Zap, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us - RauByte Tools Private Browser Utilities',
  description: 'Learn about RauByte Tools mission to provide fast, 100% private, client-side browser image and PDF processing.'
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 py-16 px-4 sm:px-6 lg:px-8">
      <SEOHead />
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-900">About RauByte Tools</h1>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            RauByte Tools was built with a single primary core mission: providing high-performance, professional-grade image and PDF tools that protect user privacy by design.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Our Privacy-First Architecture</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Traditional web converters upload your sensitive personal photos, financial PDFs, or documents onto remote servers for processing. At RauByte Tools, all file operations occur 100% locally on your own computer or phone using modern browser capabilities like WebAssembly, Web Workers, and HTML5 Canvas APIs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
              <Lock className="w-5 h-5 text-cyan-600" />
              <h3 className="text-xs font-bold text-slate-900">Zero Server Uploads</h3>
              <p className="text-[11px] text-slate-600">Files never leave your local machine runtime.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
              <Zap className="w-5 h-5 text-purple-600" />
              <h3 className="text-xs font-bold text-slate-900">Instant Performance</h3>
              <p className="text-[11px] text-slate-600">Zero network queue delay or file download waiting.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-900">Unlimited & Free</h3>
              <p className="text-[11px] text-slate-600">No subscriptions, limits, or hidden fees.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
