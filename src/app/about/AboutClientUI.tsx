'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock, Zap, ShieldCheck, Share2, ExternalLink, Heart, UserCheck, Check } from 'lucide-react';

export default function AboutClientUI() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: 'RawByte Tools - 100% Free Image & PDF Tools for Students',
      text: 'Compress photos & marksheets, resize signatures for competitive exam forms (UPSC, SSC, NEET, JEE). 100% private and free!',
      url: 'https://tools.rawbyteproduction.online/'
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Fallback to clipboard if user cancels or share fails
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('https://tools.rawbyteproduction.online/');
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">About RawByte Tools</h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          RawByte Tools was built with a single primary core mission: providing high-performance, professional-grade image and PDF tools that protect user privacy by design.
        </p>
      </div>

      {/* Founder Profile & Message Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-cyan-50 via-sky-50 to-indigo-50 border border-cyan-200 shadow-sm space-y-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 p-[3px] shadow-md shrink-0">
            <div className="w-full h-full bg-white rounded-[13px] flex items-center justify-center">
              <UserCheck className="w-10 h-10 text-cyan-600" />
            </div>
          </div>

          <div className="space-y-3 text-center sm:text-left flex-1">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-100 text-cyan-800 border border-cyan-300">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Founder & Developer
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Shahid Khan</h2>
              <p className="text-xs font-semibold text-cyan-700">Web Developer & Creator of RawByte Tools</p>
            </div>

            <blockquote className="p-4 rounded-2xl bg-white/90 border border-cyan-200 text-slate-700 text-xs sm:text-sm italic leading-relaxed shadow-2xs">
              &quot;These tools are free for everyone, mostly for students. Hope you will support us and share these tools with everyone.&quot;
            </blockquote>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2">
              {/* Share Button */}
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all"
              >
                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                {copied ? 'Link Copied to Clipboard!' : 'Share Tools with Friends'}
              </button>

              {/* Main Website Link */}
              <a
                href="https://rawbyteproduction.online"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs shadow-2xs transition-all"
              >
                Main Website: rawbyteproduction.online <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Architecture */}
      <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-6">
        <h2 className="text-xl font-bold text-slate-900">Our Privacy-First Architecture</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Traditional web converters upload your sensitive personal photos, financial PDFs, or documents onto remote servers for processing. At RawByte Tools, all file operations occur 100% locally on your own computer or phone using modern browser capabilities like WebAssembly, Web Workers, and HTML5 Canvas APIs.
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
  );
}
