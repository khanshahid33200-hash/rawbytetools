'use client';

import { useState } from 'react';
import Link from 'next/link';
import ToolCard from '@/components/common/ToolCard';
import SEOHead from '@/components/common/SEOHead';
import { ALL_TOOLS, GENERAL_FAQS } from '@/lib/utils/constants';
import { Search, Sparkles, ShieldCheck, Zap, Lock, Image as ImageIcon, FileText, ChevronDown } from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const filteredTools = ALL_TOOLS.filter((t) => {
    const q = searchQuery.toLowerCase();
    return t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.keywords.some((k) => k.includes(q));
  });

  const popularTools = ALL_TOOLS.filter((t) => t.popular);
  const imageTools = ALL_TOOLS.filter((t) => t.category === 'image');
  const pdfTools = ALL_TOOLS.filter((t) => t.category === 'pdf');

  return (
    <div className="min-h-screen bg-white text-slate-900 py-12 px-4 sm:px-6 lg:px-8 space-y-20">
      <SEOHead faqs={GENERAL_FAQS} />

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center space-y-8 pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200 shadow-xs">
          <Sparkles className="w-4 h-4 text-cyan-600 animate-pulse" /> Next-Gen Private Image & PDF Suite
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Supercharge Your Files with{' '}
          <span className="bg-gradient-to-r from-cyan-600 via-sky-600 to-purple-600 bg-clip-text text-transparent">
            100% In-Browser Tools
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Compress, edit, convert, merge, split, watermark images and PDF documents instantly. Zero uploads to servers. 100% private and free forever.
        </p>

        {/* Large Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search tools (e.g. compress pdf, resize image, convert webp...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 shadow-md transition-all"
          />
        </div>
      </section>

      {/* Search Filtered Results (If Searching) */}
      {searchQuery.trim() !== '' && (
        <section className="max-w-7xl mx-auto space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Search className="w-5 h-5 text-cyan-600" /> Search Results ({filteredTools.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Popular Tools Section */}
      {searchQuery.trim() === '' && (
        <>
          <section className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Popular Tools</h2>
                <p className="text-xs text-slate-500 mt-1">Our most used utilities for high-speed file workflows</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>

          {/* Image Tools Grid */}
          <section className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 border border-cyan-200 flex items-center justify-center">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Image Tools</h2>
                <p className="text-xs text-slate-500 mt-0.5">Compress, resize, crop, rotate, convert & watermark photos</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {imageTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>

          {/* PDF Tools Grid */}
          <section className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">PDF Tools</h2>
                <p className="text-xs text-slate-500 mt-0.5">Compress, edit pages, extract images, merge & split PDFs</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pdfTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="max-w-7xl mx-auto p-10 rounded-3xl bg-slate-50 border border-slate-200 space-y-8">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-900">Why Professionals Choose RauByte Tools</h2>
              <p className="text-xs text-slate-500">Built for maximum performance, uncompromising privacy, and pure simplicity</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3 text-center p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 border border-cyan-200 flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">100% Client-Side Privacy</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your files are never uploaded to any remote server. Everything is calculated right inside your browser using HTML5 Canvas & WebAssembly APIs.
                </p>
              </div>

              <div className="space-y-3 text-center p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center mx-auto">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Lightning Fast Processing</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  No queue waiting times or slow network uploads. Process hundreds of photos and large PDF documents instantly on your hardware.
                </p>
              </div>

              <div className="space-y-3 text-center p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Free Forever & No Watermarks</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enjoy unrestricted access to all image and PDF tools with no hidden subscription paywalls or compulsory file watermarks.
                </p>
              </div>
            </div>
          </section>

          {/* FAQ Accordion Section */}
          <section className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 text-center">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {GENERAL_FAQS.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer transition-all hover:bg-slate-100/80"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-800">{faq.question}</h3>
                      <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                    {isOpen && <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-200 leading-relaxed">{faq.answer}</p>}
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
