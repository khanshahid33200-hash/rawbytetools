'use client';

import { useState } from 'react';
import { compressImage } from '@/lib/image/compressor';
import { formatBytes, calculateSavings } from '@/lib/utils/formatters';
import { X, Upload, Download, CheckCircle2, Zap, ShieldCheck } from 'lucide-react';

interface Quick50KBCompressorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTargetKB?: number;
}

export default function Quick50KBCompressorModal({
  isOpen,
  onClose,
  defaultTargetKB = 50
}: Quick50KBCompressorModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [targetKB, setTargetKB] = useState<number>(defaultTargetKB);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setResultBlob(null);
      setResultUrl(null);
      setError(null);
    }
  };

  const processQuickCompress = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const result = await compressImage({
        file,
        targetSize: targetKB,
        targetUnit: 'KB',
        quality: 0.8,
        format: 'original'
      });

      setResultBlob(result.blob);
      setResultUrl(URL.createObjectURL(result.blob));
    } catch (err) {
      console.error(err);
      setError('Failed to compress image to target size. Please try another image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    const ext = file.name.substring(file.name.lastIndexOf('.'));
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'));
    a.download = `${nameWithoutExt}_under_${targetKB}KB${ext || '.jpg'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const resetAll = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setPreviewUrl(null);
    setResultBlob(null);
    setResultUrl(null);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-cyan-50 to-indigo-50">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Quick Photo Compressor</h3>
              <p className="text-[11px] text-cyan-800 font-medium">Target Size: Under {targetKB} KB for Exam Forms</p>
            </div>
          </div>
          <button
            onClick={() => {
              resetAll();
              onClose();
            }}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Target KB Preset Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Select Max File Size Limit:</label>
            <div className="grid grid-cols-4 gap-2">
              {[20, 50, 100, 200].map((kb) => (
                <button
                  key={kb}
                  onClick={() => setTargetKB(kb)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    targetKB === kb
                      ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {kb} KB
                </button>
              ))}
            </div>
          </div>

          {!file ? (
            /* Upload Box */
            <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-cyan-300 rounded-2xl bg-cyan-50/50 hover:bg-cyan-50 cursor-pointer transition-all text-center space-y-3">
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Click or Drag Photo Here</p>
                <p className="text-xs text-slate-500 mt-0.5">Passport photo, signature, or exam image</p>
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                UPSC, SSC, NEET, JEE Ready
              </span>
            </label>
          ) : (
            /* Preview & Actions */
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                {previewUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewUrl} alt="Preview" className="w-16 h-16 object-cover rounded-xl border border-slate-200" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{file.name}</p>
                  <p className="text-[11px] text-slate-500">Original Size: {formatBytes(file.size)}</p>
                  <button onClick={resetAll} className="text-[11px] font-semibold text-rose-600 hover:underline mt-1">
                    Change Photo
                  </button>
                </div>
              </div>

              {!resultBlob ? (
                <button
                  onClick={processQuickCompress}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md disabled:opacity-50 transition-all"
                >
                  {isProcessing ? `Compressing to under ${targetKB} KB...` : `⚡ Compress Photo to < ${targetKB} KB`}
                </button>
              ) : (
                /* Compressed Success Results */
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3 animate-in fade-in">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Successfully Compressed under {targetKB} KB!</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-white border border-emerald-100">
                      <span className="text-[10px] text-slate-500 block">Original</span>
                      <span className="font-bold text-slate-700 line-through">{formatBytes(file.size)}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-emerald-200">
                      <span className="text-[10px] text-slate-500 block">Compressed</span>
                      <span className="font-extrabold text-emerald-700">{formatBytes(resultBlob.size)}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-emerald-700 font-semibold text-center">
                    Saved {calculateSavings(file.size, resultBlob.size).percent}% file size!
                  </p>

                  <button
                    onClick={handleDownload}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <Download className="w-4 h-4" /> Download {targetKB}KB Photo
                  </button>
                </div>
              )}

              {error && <p className="text-xs font-semibold text-rose-600 text-center">{error}</p>}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-cyan-600" /> 100% In-Browser Privacy
          </span>
          <button
            onClick={() => {
              resetAll();
              onClose();
            }}
            className="font-bold text-slate-700 hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
