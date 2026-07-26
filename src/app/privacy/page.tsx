import { Metadata } from 'next';
import Link from 'next/link';
import SEOHead from '@/components/common/SEOHead';
import { ShieldCheck, Lock, CheckCircle2, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy - RawByte Tools',
  description: 'RawByte Tools Privacy Policy. 100% in-browser processing, zero server uploads, complete file security.'
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 py-16 px-4 sm:px-6 lg:px-8">
      <SEOHead />
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Title Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">
            <ShieldCheck className="w-4 h-4 text-cyan-600" /> Privacy First Architecture
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-slate-500 font-medium">Last Updated: July 27, 2026</p>
        </div>

        {/* Content Container */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 border border-slate-200 shadow-xs space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {/* Plain English Summary Box */}
          <section className="p-6 rounded-2xl bg-cyan-50/80 border border-cyan-200 space-y-3">
            <h2 className="text-base font-bold text-cyan-950 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-cyan-600" /> Plain English Summary
            </h2>
            <p className="text-xs text-cyan-900">If you only read one section, read this one:</p>
            <ul className="text-xs text-cyan-900 space-y-1.5 list-disc pl-5">
              <li>Your images stay on your device.</li>
              <li>Your PDF files stay on your device.</li>
              <li>We do not upload your files during normal use.</li>
              <li>We do not store your files.</li>
              <li>We do not keep copies.</li>
              <li>We do not sell your data.</li>
              <li>We do not look at your documents.</li>
              <li>Most processing happens entirely inside your browser.</li>
              <li>What happens on your device stays on your device.</li>
            </ul>
          </section>

          {/* Main Sections */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">Your Privacy Matters</h2>
            <p>Your files belong to you. We built this website with privacy as a core principle.</p>
            <p>
              Unlike many online tools, we do not upload, store, analyse, sell, or share your images or PDF files. Almost every operation is performed directly inside your web browser on your own device.
            </p>
            <p>We do not keep copies of your files because there is no need to. Our goal is to provide fast tools while respecting your privacy.</p>
            <p>
              Yes, keeping millions of uploaded files would also require a huge amount of storage, and we would rather use those resources to improve the website than store your photos, documents, or memes forever.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900">How Our Tools Work</h2>
            <p>When you use an image or PDF tool:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your file stays on your device.</li>
              <li>Processing happens inside your browser.</li>
              <li>No image or PDF is uploaded to our servers during normal use.</li>
              <li>After processing, you download the result directly to your device.</li>
              <li>We do not receive a copy of your files.</li>
            </ul>
            <p className="font-semibold text-slate-800">This approach provides faster processing and better privacy.</p>
          </section>

          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900">Files We Do Not Store</h2>
            <p>We do not store:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-semibold text-slate-800 text-xs">
              <span className="p-2 rounded-xl bg-white border border-slate-200">• Images</span>
              <span className="p-2 rounded-xl bg-white border border-slate-200">• PDFs</span>
              <span className="p-2 rounded-xl bg-white border border-slate-200">• Screenshots</span>
              <span className="p-2 rounded-xl bg-white border border-slate-200">• Personal photos</span>
              <span className="p-2 rounded-xl bg-white border border-slate-200">• Signatures</span>
              <span className="p-2 rounded-xl bg-white border border-slate-200">• Identity documents</span>
              <span className="p-2 rounded-xl bg-white border border-slate-200">• Passport photos</span>
              <span className="p-2 rounded-xl bg-white border border-slate-200">• Edited files</span>
              <span className="p-2 rounded-xl bg-white border border-slate-200">• Converted files</span>
              <span className="p-2 rounded-xl bg-white border border-slate-200">• Compressed files</span>
              <span className="p-2 rounded-xl bg-white border border-slate-200">• Temporary files</span>
            </div>
            <p className="pt-2">Once you close the page, your files are gone from the browser unless you save them yourself.</p>
          </section>

          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
            <p>You do not need an account to use most of our tools.</p>
            <p>We do not ask for personal information unless you voluntarily submit it through features such as:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Contact forms</li>
              <li>Feedback forms</li>
              <li>Support requests</li>
            </ul>
            <p>Any information you provide through these forms is used only to respond to your request.</p>
          </section>

          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900">Cookies & Analytics</h2>
            <p>We use only essential cookies where needed to keep the website working properly.</p>
            <p>If analytics are enabled, they collect anonymous usage information such as:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Pages visited</li>
              <li>Device type</li>
              <li>Browser type</li>
              <li>General country or region</li>
              <li>Performance information</li>
            </ul>
            <p className="font-bold text-slate-900">Analytics never include your uploaded images or PDF files.</p>
          </section>

          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900">File Security</h2>
            <p>
              Since files are processed on your device, they are not transmitted to our servers during normal operation. This greatly reduces the risk associated with uploading sensitive documents over the internet.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900">Third Party Services</h2>
            <p>
              Some parts of the website may use trusted third-party services for features such as website analytics, error monitoring, advertising, or performance monitoring. These services operate under their own privacy policies.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900">Data Sharing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-semibold text-slate-800">
              <p>✓ We do not sell your personal information.</p>
              <p>✓ We do not sell your images.</p>
              <p>✓ We do not sell your PDF files.</p>
              <p>✓ We do not rent your data.</p>
            </div>
            <p className="pt-1 font-bold text-cyan-800">We do not share your uploaded files because we do not have them.</p>
          </section>

          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900">Children&apos;s Privacy</h2>
            <p>This website is intended for general audiences. We do not knowingly collect personal information from children.</p>
            <p>If you believe a child has submitted personal information through a contact form, please contact us so we can remove it.</p>
          </section>

          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900">Data Retention & Security</h2>
            <p>
              Since files are processed locally inside your browser, we do not retain uploaded images or PDF documents. Information submitted through contact or feedback forms is kept only for as long as necessary to respond to your request or maintain our services.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900">Changes & Contact Us</h2>
            <p>We may update this Privacy Policy from time to time. Any updates will appear on this page with a revised &quot;Last Updated&quot; date.</p>
            <p>
              If you have questions about this Privacy Policy or how your information is handled, please contact us through our{' '}
              <Link href="/contact" className="text-cyan-600 font-bold hover:underline">
                Contact Page
              </Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
