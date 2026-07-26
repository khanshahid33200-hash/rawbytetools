import { ReactNode } from 'react';
import Link from 'next/link';
import SEOHead from '@/components/common/SEOHead';
import { ALL_TOOLS, GENERAL_FAQS } from '@/lib/utils/constants';
import ToolCard from '@/components/common/ToolCard';
import { ChevronRight, ShieldCheck, Zap, Lock, HelpCircle } from 'lucide-react';

interface ToolPageLayoutProps {
  slug: string;
  children: ReactNode;
}

export default function ToolPageLayout({ slug, children }: ToolPageLayoutProps) {
  const tool = ALL_TOOLS.find((t) => t.slug === slug);
  if (!tool) return null;

  const relatedTools = ALL_TOOLS.filter((t) => t.category === tool.category && t.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-white text-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <SEOHead tool={tool} faqs={GENERAL_FAQS} />

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-cyan-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="capitalize">{tool.category} Tools</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 font-semibold">{tool.title}</span>
        </nav>

        {/* Hero Banner Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200">
            <Lock className="w-3.5 h-3.5" /> 100% Free & Private Browser Processing
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            {tool.title}
          </h1>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">{tool.description}</p>
        </div>

        {/* Interactive Tool Component Slot */}
        <main className="w-full">{children}</main>

        {/* Features Bullet Section */}
        {tool.features && tool.features.length > 0 && (
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-600" /> Key Features of {tool.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
              {tool.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-cyan-500 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Frequently Asked Questions */}
        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-600" /> Frequently Asked Questions
          </h3>

          <div className="space-y-4">
            {GENERAL_FAQS.map((faq, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-2xs">
                <h4 className="text-xs font-bold text-slate-800">{faq.question}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Tools Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Related {tool.category === 'image' ? 'Image' : 'PDF'} Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTools.map((relTool) => (
              <ToolCard key={relTool.id} tool={relTool} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
