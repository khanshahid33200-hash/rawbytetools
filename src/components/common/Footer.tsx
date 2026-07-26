import Link from 'next/link';
import { ALL_TOOLS } from '@/lib/utils/constants';
import { ShieldCheck, Zap, Lock } from 'lucide-react';

export default function Footer() {
  const imageTools = ALL_TOOLS.filter((t) => t.category === 'image');
  const pdfTools = ALL_TOOLS.filter((t) => t.category === 'pdf');

  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50 text-slate-600">
      {/* Privacy Guarantee Banner */}
      <div className="border-b border-slate-200 bg-slate-100/80">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="p-3 rounded-2xl bg-cyan-100 text-cyan-700 border border-cyan-200">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">100% Client-Side Privacy</h4>
              <p className="text-xs text-slate-600">Files process in browser; 0 uploads to server.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="p-3 rounded-2xl bg-purple-100 text-purple-700 border border-purple-200">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Instant Execution</h4>
              <p className="text-xs text-slate-600">Powered by WebAssembly & Canvas APIs.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Free & Unlimited</h4>
              <p className="text-xs text-slate-600">No registration, no limits, no watermarks.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent">
              RawByte Tools
            </span>
          </div>
          <p className="text-xs leading-relaxed text-slate-600">
            A premium, high-speed online Image and PDF toolkit designed for instant browser-side processing. Privacy guaranteed by default.
          </p>
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} RawByte Tools. All rights reserved.</p>
        </div>

        {/* Image Tools */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan-600 mb-4">Image Tools</h4>
          <ul className="space-y-2 text-xs">
            {imageTools.map((tool) => (
              <li key={tool.id}>
                <Link href={`/${tool.slug}`} className="hover:text-cyan-600 transition-colors">
                  {tool.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* PDF Tools */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-purple-600 mb-4">PDF Tools</h4>
          <ul className="space-y-2 text-xs">
            {pdfTools.map((tool) => (
              <li key={tool.id}>
                <Link href={`/${tool.slug}`} className="hover:text-purple-600 transition-colors">
                  {tool.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company & Legal */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-800 mb-4">Company & Legal</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/about" className="hover:text-slate-900 transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-slate-900 transition-colors">
                Contact & Support
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-slate-900 transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-slate-900 transition-colors">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
