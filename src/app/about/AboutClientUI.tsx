'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock, Zap, ShieldCheck, Share2, ExternalLink, Heart, Check, Quote, GraduationCap } from 'lucide-react';

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
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">About RawByte Tools</h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          High-performance, professional-grade image and PDF tools engineered for absolute privacy, instant speed, and zero cost.
        </p>
      </div>

      {/* Founder Profile Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-cyan-50/80 via-sky-50 to-indigo-50/80 border border-cyan-200 shadow-sm space-y-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-cyan-200/80 pb-6">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 p-[3px] shadow-lg shrink-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/founder.jpg"
              alt="Shahid Khan - Founder & Web Developer of RawByte Tools"
              className="w-full h-full object-cover rounded-[21px]"
            />
          </div>

          <div className="space-y-3 text-center sm:text-left flex-1">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-100 text-cyan-800 border border-cyan-300">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Founder & Developer
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Shahid Khan</h2>
              <p className="text-xs font-bold text-cyan-700 uppercase tracking-wider">Web Developer & Creator of RawByte Tools</p>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all"
              >
                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                {copied ? 'Link Copied!' : 'Share Tools with Friends'}
              </button>

              <a
                href="https://rawbyteproduction.online"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs shadow-2xs transition-all"
              >
                Main Portal: rawbyteproduction.online <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>
            </div>
          </div>
        </div>

        {/* Extended Founder's Message */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-cyan-800 font-bold text-sm">
            <Quote className="w-5 h-5 text-cyan-600" />
            <span>A Message from the Founder:</span>
          </div>

          <div className="p-6 rounded-2xl bg-white/95 border border-cyan-200 text-slate-700 text-xs sm:text-sm leading-relaxed space-y-4 shadow-2xs">
            <p>
              &quot;Welcome to RawByte Tools! I created this platform with a single passionate vision: high-quality web utilities should be <strong>100% free, blazingly fast, and completely private for everyone</strong> — especially for students and competitive exam candidates who spend countless hours preparing for life-changing opportunities.&quot;
            </p>

            <p>
              &quot;Every year, millions of students fill out online application forms for competitive exams like UPSC, SSC, NEET, JEE, GATE, IBPS, and Railway recruitments. During this process, applicants often struggle with rigid file size limits (e.g. 20-50 KB photos, 10-20 KB signatures), strict pixel dimensions, or paid paywalls. Even worse, many online tools upload your sensitive photos, Aadhaar details, and academic marksheets to remote servers. I strongly believe no student should have to compromise their digital privacy or pay money just to format a document.&quot;
            </p>

            <p>
              &quot;That is why RawByte Tools was engineered to run <strong>100% client-side inside your web browser</strong> using modern WebAssembly, Web Workers, and HTML5 Canvas APIs. Your sensitive documents, photos, and marksheets never touch any external server — everything is processed directly on your phone or computer in total privacy.&quot;
            </p>

            <p className="font-semibold text-slate-900 pt-2 border-t border-slate-100">
              &quot;This platform is my dedicated contribution to students and users worldwide. All tools will remain 100% free forever with no watermarks, subscription gates, or file limits. If RawByte Tools saves you time or helps you submit your forms stress-free, please share it with your classmates, friends, and study groups. Your support and encouragement inspire us every day!&quot;
            </p>

            <div className="pt-2 flex items-center justify-between text-xs font-bold text-cyan-700">
              <span>— Shahid Khan</span>
              <span className="flex items-center gap-1 text-slate-500 font-medium">
                <GraduationCap className="w-4 h-4 text-amber-600" /> Dedicated to Student Community
              </span>
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
