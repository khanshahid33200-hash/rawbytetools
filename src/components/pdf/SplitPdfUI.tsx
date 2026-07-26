'use client';

import { useState } from 'react';
import FileUploader from '@/components/common/FileUploader';
import DownloadBar from '@/components/common/DownloadBar';
import { ProcessedFileItem } from '@/types/file';
import { splitPdf } from '@/lib/pdf/pdfManipulator';
import { Scissors, Zap, RefreshCw } from 'lucide-react';

export default function SplitPdfUI() {
  const [fileItem, setFileItem] = useState<ProcessedFileItem | null>(null);
  const [mode, setMode] = useState<'all' | 'custom' | 'odd' | 'even'>('all');
  const [rangeStr, setRangeStr] = useState('1-3, 5');
  const [isProcessing, setIsProcessing] = useState(false);
  const [splitResults, setSplitResults] = useState<ProcessedFileItem[]>([]);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      const f = files[0];
      setFileItem({
        id: `${Date.now()}`,
        file: f,
        name: f.name,
        originalSize: f.size,
        type: f.type,
        previewUrl: '',
        status: 'idle',
        progress: 0
      });
    }
  };

  const startSplit = async () => {
    if (!fileItem) return;
    setIsProcessing(true);

    try {
      const parts = await splitPdf(fileItem.file, mode, rangeStr);

      const items: ProcessedFileItem[] = parts.map((p, idx) => ({
        id: `split_${idx}`,
        file: fileItem.file,
        name: p.filename,
        originalSize: fileItem.originalSize,
        type: 'application/pdf',
        previewUrl: '',
        status: 'success',
        progress: 100,
        resultBlob: p.blob,
        resultUrl: URL.createObjectURL(p.blob),
        resultSize: p.blob.size,
        resultName: p.filename
      }));

      setSplitResults(items);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    splitResults.forEach((r) => {
      if (r.resultUrl) URL.revokeObjectURL(r.resultUrl);
    });
    setFileItem(null);
    setSplitResults([]);
  };

  return (
    <div className="w-full space-y-8">
      {!fileItem ? (
        <FileUploader
          onFilesSelected={handleFilesSelected}
          acceptTypes={['application/pdf']}
          acceptExtensions={['.pdf']}
          multiple={false}
          title="Upload PDF to Split"
          subtitle="Split PDF into individual pages, custom page ranges (e.g. 1-3, 5), odd, or even pages."
        />
      ) : (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Scissors className="w-4 h-4 text-purple-600" /> Select Split Method
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {[
                { id: 'all', label: 'Extract Every Page', desc: 'Each page as separate PDF' },
                { id: 'custom', label: 'Custom Range', desc: 'e.g. 1-5, 8, 11-14' },
                { id: 'odd', label: 'Odd Pages Only', desc: 'Pages 1, 3, 5, 7...' },
                { id: 'even', label: 'Even Pages Only', desc: 'Pages 2, 4, 6, 8...' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as any)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    mode === m.id
                      ? 'bg-purple-50 border-purple-300 text-slate-900 shadow-2xs ring-2 ring-purple-500/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <h4 className="text-xs font-bold text-slate-900">{m.label}</h4>
                  <p className="text-[11px] text-slate-600 mt-1">{m.desc}</p>
                </button>
              ))}
            </div>

            {mode === 'custom' && (
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-700">Enter Page Ranges</label>
                <input
                  type="text"
                  placeholder="e.g. 1-3, 5, 7-10"
                  value={rangeStr}
                  onChange={(e) => setRangeStr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
            )}

            {splitResults.length === 0 && (
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs text-slate-700 transition-colors"
                >
                  Clear File
                </button>
                <button
                  onClick={startSplit}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md transition-all"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  Split PDF Now
                </button>
              </div>
            )}
          </div>

          {splitResults.length > 0 && <DownloadBar files={splitResults} onReset={handleReset} zipFilename="split_pdf_pages.zip" />}
        </div>
      )}
    </div>
  );
}
