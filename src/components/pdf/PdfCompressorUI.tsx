'use client';

import { useState } from 'react';
import FileUploader from '@/components/common/FileUploader';
import DownloadBar from '@/components/common/DownloadBar';
import ProcessingProgress from '@/components/common/ProcessingProgress';
import { ProcessedFileItem } from '@/types/file';
import { compressPdfFile } from '@/lib/pdf/pdfCompressor';
import { formatBytes, calculateSavings } from '@/lib/utils/formatters';
import { Settings, FileText, Zap, Plus, Trash2 } from 'lucide-react';

export default function PdfCompressorUI() {
  const [files, setFiles] = useState<ProcessedFileItem[]>([]);
  const [level, setLevel] = useState<'low' | 'medium' | 'high' | 'custom'>('medium');
  const [targetSize, setTargetSize] = useState<number | undefined>(undefined);
  const [targetUnit, setTargetUnit] = useState<'KB' | 'MB'>('KB');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProcessingIndex, setCurrentProcessingIndex] = useState(0);

  const handleFilesSelected = (selectedFiles: File[]) => {
    const items: ProcessedFileItem[] = selectedFiles.map((file, idx) => ({
      id: `${Date.now()}_${Math.random()}_${idx}`,
      file,
      name: file.name,
      originalSize: file.size,
      type: file.type,
      previewUrl: '',
      status: 'idle',
      progress: 0
    }));
    setFiles((prev) => [...prev, ...items]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.resultUrl) URL.revokeObjectURL(target.resultUrl);
      return prev.filter((f) => f.id !== id);
    });
  };

  const startCompression = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);

    const updatedFiles = [...files];

    for (let i = 0; i < updatedFiles.length; i++) {
      setCurrentProcessingIndex(i);
      updatedFiles[i].status = 'processing';
      setFiles([...updatedFiles]);

      try {
        const result = await compressPdfFile({
          file: updatedFiles[i].file,
          level,
          targetSize,
          targetUnit
        });

        updatedFiles[i].status = 'success';
        updatedFiles[i].resultBlob = result.blob;
        updatedFiles[i].resultUrl = result.url;
        updatedFiles[i].resultSize = result.size;
        updatedFiles[i].resultName = `compressed_${updatedFiles[i].name}`;
      } catch (err: any) {
        updatedFiles[i].status = 'error';
        updatedFiles[i].error = err.message || 'PDF compression failed';
      }

      setFiles([...updatedFiles]);
    }

    setIsProcessing(false);
  };

  const handleReset = () => {
    files.forEach((f) => {
      if (f.resultUrl) URL.revokeObjectURL(f.resultUrl);
    });
    setFiles([]);
    setIsProcessing(false);
  };

  const isCompleted = files.length > 0 && files.every((f) => f.status === 'success');

  const presetTargetSizes = [
    { size: 100, unit: 'KB' },
    { size: 200, unit: 'KB' },
    { size: 500, unit: 'KB' },
    { size: 1, unit: 'MB' },
    { size: 2, unit: 'MB' },
    { size: 5, unit: 'MB' }
  ] as const;

  return (
    <div className="w-full space-y-8">
      {files.length === 0 ? (
        <FileUploader
          onFilesSelected={handleFilesSelected}
          acceptTypes={['application/pdf']}
          acceptExtensions={['.pdf']}
          multiple={true}
          title="Upload PDF Files to Compress (Batch Mode Supported)"
          subtitle="Select or drop multiple PDF documents. Type target size in KB or MB or choose compression level."
        />
      ) : (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-semibold text-slate-900">
                  Batch PDF Compression Settings ({files.length} {files.length === 1 ? 'file' : 'files'})
                </h3>
              </div>

              {/* Add More PDFs Button */}
              <div>
                <button
                  onClick={() => document.getElementById('add-more-pdfs-input')?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-xs font-semibold text-purple-700 transition-all"
                >
                  <Plus className="w-4 h-4" /> Add More PDFs
                </button>
                <input
                  id="add-more-pdfs-input"
                  type="file"
                  multiple
                  accept="application/pdf,.pdf"
                  className="hidden"
                  onChange={(e) => e.target.files && handleFilesSelected(Array.from(e.target.files))}
                />
              </div>
            </div>

            {/* Student Exam PDF Presets Banner */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-amber-800">🎓 Student & Competitive Exam PDF Limits:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setTargetSize(180);
                    setTargetUnit('KB');
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-800 border border-amber-300 hover:bg-amber-100 transition-all"
                >
                  📜 10th/12th Marksheet PDF (Under 200 KB)
                </button>
                <button
                  onClick={() => {
                    setTargetSize(280);
                    setTargetUnit('KB');
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-800 border border-amber-300 hover:bg-amber-100 transition-all"
                >
                  📑 Caste / Domicile Certificate (Under 300 KB)
                </button>
                <button
                  onClick={() => {
                    setTargetSize(90);
                    setTargetUnit('KB');
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-800 border border-amber-300 hover:bg-amber-100 transition-all"
                >
                  🆔 Aadhaar / ID Card PDF (Under 100 KB)
                </button>
                <button
                  onClick={() => {
                    setTargetSize(450);
                    setTargetUnit('KB');
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-800 border border-amber-300 hover:bg-amber-100 transition-all"
                >
                  🎓 Degree / Resume PDF (Under 500 KB)
                </button>
              </div>
            </div>

            {/* Target KB / MB Input Section */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-slate-900">
                  Type Target File Size in KB or MB (Optional)
                </label>
                {targetSize && (
                  <button
                    onClick={() => setTargetSize(undefined)}
                    className="text-[11px] text-purple-600 hover:underline font-medium"
                  >
                    Clear Target Size
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Type target size, e.g. 100, 200, 500, 1"
                  value={targetSize !== undefined ? targetSize : ''}
                  onChange={(e) => setTargetSize(e.target.value !== '' ? parseFloat(e.target.value) : undefined)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                />
                <select
                  value={targetUnit}
                  onChange={(e) => setTargetUnit(e.target.value as 'KB' | 'MB')}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 font-bold focus:outline-none"
                >
                  <option value="KB">KB</option>
                  <option value="MB">MB</option>
                </select>
              </div>

              {/* Presets */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[11px] text-slate-500 self-center mr-1">Target Presets:</span>
                {presetTargetSizes.map((p) => (
                  <button
                    key={`${p.size}_${p.unit}`}
                    onClick={() => {
                      setTargetSize(p.size);
                      setTargetUnit(p.unit);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                      targetSize === p.size && targetUnit === p.unit
                        ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {p.size} {p.unit}
                  </button>
                ))}
              </div>
            </div>

            {/* Presets Mode Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-700">Or Select Compression Mode</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: 'low', label: 'Low Compression', desc: 'Maximum visual quality, subtle reduction' },
                  { id: 'medium', label: 'Medium Compression', desc: 'Optimal balance of size & sharpness' },
                  { id: 'high', label: 'High Compression', desc: 'Maximum size reduction for fast sharing' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setLevel(item.id as any)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      level === item.id && !targetSize
                        ? 'bg-purple-50 border-purple-300 text-slate-900 shadow-2xs ring-2 ring-purple-500/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <h4 className="text-xs font-bold text-slate-900">{item.label}</h4>
                    <p className="text-[11px] text-slate-600 mt-1">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {!isCompleted && !isProcessing && (
              <div className="flex justify-end gap-3 pt-2 border-t border-slate-200">
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs text-slate-700 transition-colors"
                >
                  Clear Queue
                </button>
                <button
                  onClick={startCompression}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md transition-all"
                >
                  <Zap className="w-4 h-4" /> Compress {files.length} {files.length === 1 ? 'PDF' : 'PDFs'} Now
                </button>
              </div>
            )}
          </div>

          {isProcessing && (
            <ProcessingProgress
              currentFileIndex={currentProcessingIndex}
              totalFiles={files.length}
              currentFileName={files[currentProcessingIndex]?.name}
              progressPercent={100}
            />
          )}

          {isCompleted && <DownloadBar files={files} onReset={handleReset} zipFilename="compressed_pdfs.zip" />}

          {/* PDF Files Queue List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((item) => {
              const savings = calculateSavings(item.originalSize, item.resultSize || 0);
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3 relative overflow-hidden group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-slate-900 truncate">{item.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Size: {formatBytes(item.originalSize)}</p>
                    </div>

                    {!isProcessing && !isCompleted && (
                      <button
                        onClick={() => removeFile(item.id)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all opacity-80 group-hover:opacity-100"
                        title="Remove PDF"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {item.resultSize && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                      <span>Compressed Size:</span>
                      <span>
                        {formatBytes(item.resultSize)} ({savings.text})
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
