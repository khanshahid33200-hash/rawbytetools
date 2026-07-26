import { Metadata } from 'next';
import Link from 'next/link';
import SEOHead from '@/components/common/SEOHead';
import { GraduationCap, FileText, Image as ImageIcon, CheckCircle2, Zap, ArrowRight, Info } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Competitive Exam Form Photo & Document Requirements Guide (2026)',
  description: 'Master list of passport photo, signature, and PDF document file size & dimension limits for UPSC, SSC, NEET, JEE, GATE, IBPS, and Railway online application forms.'
};

interface ExamPortalItem {
  id: string;
  category: 'govt' | 'medical-eng' | 'banking' | 'railway';
  examName: string;
  authority: string;
  photoSpec: { size: string; dimensions: string; format: string };
  signatureSpec: { size: string; dimensions: string; format: string };
  documentSpec: { name: string; size: string; format: string }[];
  compressPhotoKb: number;
  resizePhotoW: number;
  resizePhotoH: number;
  resizeSigW: number;
  resizeSigH: number;
}

const EXAM_PORTALS: ExamPortalItem[] = [
  {
    id: 'upsc',
    category: 'govt',
    examName: 'UPSC Civil Services / NDA / CDS',
    authority: 'Union Public Service Commission',
    photoSpec: { size: '20 KB to 300 KB', dimensions: '350 x 350 to 1000 x 1000 px (3.5 x 4.5 cm)', format: 'JPG / JPEG' },
    signatureSpec: { size: '20 KB to 300 KB', dimensions: '350 x 350 px (3.5 x 1.5 cm)', format: 'JPG / JPEG' },
    documentSpec: [
      { name: 'Photo ID Card (Aadhaar/PAN/Voter)', size: '20 KB to 300 KB', format: 'PDF' }
    ],
    compressPhotoKb: 150,
    resizePhotoW: 350,
    resizePhotoH: 450,
    resizeSigW: 350,
    resizeSigH: 150
  },
  {
    id: 'ssc',
    category: 'govt',
    examName: 'SSC CGL / CHSL / MTS / GD / Stenographer',
    authority: 'Staff Selection Commission',
    photoSpec: { size: '20 KB to 50 KB', dimensions: '200 x 230 px (3.5 x 4.5 cm)', format: 'JPG / JPEG' },
    signatureSpec: { size: '10 KB to 20 KB', dimensions: '140 x 60 px (4.0 x 2.0 cm)', format: 'JPG / JPEG' },
    documentSpec: [],
    compressPhotoKb: 40,
    resizePhotoW: 200,
    resizePhotoH: 230,
    resizeSigW: 140,
    resizeSigH: 60
  },
  {
    id: 'neet',
    category: 'medical-eng',
    examName: 'NEET UG / NTA Exams',
    authority: 'National Testing Agency (NTA)',
    photoSpec: { size: '10 KB to 200 KB', dimensions: 'Postcard Size (4x6 inch) or 200x230 px', format: 'JPG' },
    signatureSpec: { size: '4 KB to 30 KB', dimensions: '140 x 60 px', format: 'JPG' },
    documentSpec: [
      { name: 'Left Thumb Impression', size: '10 KB to 200 KB', format: 'JPG' },
      { name: '10th Marksheet / Category Certificate', size: '50 KB to 300 KB', format: 'PDF' }
    ],
    compressPhotoKb: 100,
    resizePhotoW: 300,
    resizePhotoH: 300,
    resizeSigW: 140,
    resizeSigH: 60
  },
  {
    id: 'jee',
    category: 'medical-eng',
    examName: 'JEE Main & JEE Advanced',
    authority: 'NTA & IIT Joint Admission Board',
    photoSpec: { size: '10 KB to 200 KB', dimensions: '200 x 230 px', format: 'JPG' },
    signatureSpec: { size: '4 KB to 30 KB', dimensions: '140 x 60 px', format: 'JPG' },
    documentSpec: [
      { name: 'Category / PwD Certificate', size: '50 KB to 300 KB', format: 'PDF' }
    ],
    compressPhotoKb: 100,
    resizePhotoW: 200,
    resizePhotoH: 230,
    resizeSigW: 140,
    resizeSigH: 60
  },
  {
    id: 'ibps',
    category: 'banking',
    examName: 'IBPS PO / Clerk / SBI PO & Clerk / RBI',
    authority: 'Institute of Banking Personnel Selection',
    photoSpec: { size: '20 KB to 50 KB', dimensions: '200 x 230 px (4.5 x 3.5 cm)', format: 'JPG / JPEG' },
    signatureSpec: { size: '10 KB to 20 KB', dimensions: '140 x 60 px', format: 'JPG' },
    documentSpec: [
      { name: 'Left Thumb Impression', size: '20 KB to 50 KB', format: 'JPG (240x240 px)' },
      { name: 'Hand Written Declaration', size: '50 KB to 100 KB', format: 'JPG (800x400 px)' }
    ],
    compressPhotoKb: 40,
    resizePhotoW: 200,
    resizePhotoH: 230,
    resizeSigW: 140,
    resizeSigH: 60
  },
  {
    id: 'gate',
    category: 'medical-eng',
    examName: 'GATE / JAM (IIT Admissions)',
    authority: 'Indian Institutes of Technology (IITs)',
    photoSpec: { size: '5 KB to 200 KB', dimensions: '240 x 320 to 480 x 640 px', format: 'JPG / JPEG' },
    signatureSpec: { size: '5 KB to 200 KB', dimensions: '160 x 560 px', format: 'JPG / JPEG' },
    documentSpec: [
      { name: 'Category / PwD / Degree Certificate', size: '10 KB to 500 KB', format: 'PDF' }
    ],
    compressPhotoKb: 100,
    resizePhotoW: 360,
    resizePhotoH: 480,
    resizeSigW: 560,
    resizeSigH: 160
  },
  {
    id: 'rrb',
    category: 'railway',
    examName: 'Railway RRB NTPC / Group D / ALP',
    authority: 'Railway Recruitment Board',
    photoSpec: { size: '20 KB to 50 KB', dimensions: '320 x 240 px (35 x 45 mm)', format: 'JPG / JPEG' },
    signatureSpec: { size: '10 KB to 20 KB', dimensions: '140 x 60 px (50 x 20 mm)', format: 'JPG / JPEG' },
    documentSpec: [
      { name: 'SC/ST Certificate (for free travel pass)', size: 'Under 500 KB', format: 'PDF' }
    ],
    compressPhotoKb: 40,
    resizePhotoW: 320,
    resizePhotoH: 240,
    resizeSigW: 140,
    resizeSigH: 60
  }
];

export default function ExamFormGuidePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <SEOHead />
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <GraduationCap className="w-4 h-4 text-amber-700" /> Competitive Exam Portal Document Standard (2026 Edition)
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Photo, Signature & PDF Requirements for Online Application Forms
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Avoid form rejection! Use this master guide for exact file size (KB/MB) & pixel dimensions required by UPSC, SSC, NEET, JEE, IBPS, and Railway online application forms.
          </p>
        </div>

        {/* Quick Tool Launch Banner */}
        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Photo & Sig Compressor</h3>
            <p className="text-xs text-slate-600">Compress photos to 20KB-50KB and signatures to 10KB-20KB instantly.</p>
            <Link
              href="/image-compressor"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 hover:text-cyan-700 pt-1"
            >
              Open Compressor →
            </Link>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-700 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Exact Dimension Resizer</h3>
            <p className="text-xs text-slate-600">Set width & height to 200x230px, 140x60px, or custom centimeters.</p>
            <Link
              href="/image-resizer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 hover:text-cyan-700 pt-1"
            >
              Open Resizer →
            </Link>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Marksheet PDF Compressor</h3>
            <p className="text-xs text-slate-600">Shrink 10th/12th marksheets & certificates under 200 KB cleanly.</p>
            <Link
              href="/pdf-compressor"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700 pt-1"
            >
              Compress PDF →
            </Link>
          </div>
        </div>

        {/* Master List Grid */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3">
            Major Competitive Exams & Document Specifications
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EXAM_PORTALS.map((exam) => (
              <div
                key={exam.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all space-y-4"
              >
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{exam.examName}</h3>
                    <p className="text-xs text-slate-500">{exam.authority}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                    Official Spec
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Photo Spec */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      📸 Passport Photograph:
                    </span>
                    <div className="flex justify-between text-slate-600">
                      <span>Size Limit: <strong className="text-slate-900">{exam.photoSpec.size}</strong></span>
                      <span>Format: <strong className="text-slate-900">{exam.photoSpec.format}</strong></span>
                    </div>
                    <div className="text-slate-600">
                      Dimensions: <span className="font-mono text-cyan-700 font-bold">{exam.photoSpec.dimensions}</span>
                    </div>
                  </div>

                  {/* Signature Spec */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      ✍️ Signature:
                    </span>
                    <div className="flex justify-between text-slate-600">
                      <span>Size Limit: <strong className="text-slate-900">{exam.signatureSpec.size}</strong></span>
                      <span>Format: <strong className="text-slate-900">{exam.signatureSpec.format}</strong></span>
                    </div>
                    <div className="text-slate-600">
                      Dimensions: <span className="font-mono text-cyan-700 font-bold">{exam.signatureSpec.dimensions}</span>
                    </div>
                  </div>

                  {/* Documents Spec */}
                  {exam.documentSpec.length > 0 && (
                    <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-200 space-y-1">
                      <span className="font-bold text-purple-900 flex items-center gap-1.5">
                        📄 Marksheet & Certificates:
                      </span>
                      {exam.documentSpec.map((doc, idx) => (
                        <div key={idx} className="flex justify-between text-slate-700 text-[11px]">
                          <span>{doc.name}</span>
                          <span className="font-bold text-purple-800">{doc.size} ({doc.format})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Direct Action Links */}
                <div className="pt-2 flex flex-wrap gap-2">
                  <Link
                    href={`/image-compressor?targetSize=${exam.compressPhotoKb}&unit=KB`}
                    className="flex-1 px-3 py-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-center text-xs font-bold text-cyan-700 transition-all"
                  >
                    Compress Photo
                  </Link>
                  <Link
                    href={`/image-resizer?w=${exam.resizeSigW}&h=${exam.resizeSigH}`}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-center text-xs font-bold text-slate-800 transition-all"
                  >
                    Resize Signature
                  </Link>
                  <Link
                    href="/pdf-compressor?targetSize=200&unit=KB"
                    className="flex-1 px-3 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-center text-xs font-bold text-purple-700 transition-all"
                  >
                    Compress PDF
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Box */}
        <div className="p-6 rounded-3xl bg-amber-50/80 border border-amber-200 space-y-3">
          <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
            <Info className="w-5 h-5 text-amber-700" /> Pro-Tips for Successful Online Form Submission:
          </h3>
          <ul className="text-xs text-amber-900 space-y-2 list-disc pl-5 leading-relaxed">
            <li><strong>White Background:</strong> Ensure passport photo has a clean white or plain light background.</li>
            <li><strong>Black Pen Signature:</strong> Sign on plain white paper using a black gel/ballpoint pen for high digital clarity.</li>
            <li><strong>Aspect Ratio Lock:</strong> When resizing photos, uncheck "Lock Aspect Ratio" if the form enforces exact width x height pixels (e.g. 200x230 px).</li>
            <li><strong>100% Client-Side Security:</strong> RawByte Tools processes your photos locally in your browser so your Aadhaar, PAN, and certificate PDFs are never uploaded to remote servers.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
