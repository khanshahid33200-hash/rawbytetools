'use client';

import { useState } from 'react';
import FileUploader from '@/components/common/FileUploader';
import DownloadBar from '@/components/common/DownloadBar';
import ProcessingProgress from '@/components/common/ProcessingProgress';
import { ProcessedFileItem, CompressionOptions } from '@/types/file';
import { compressImage } from '@/lib/image/compressor';
import { formatBytes, calculateSavings } from '@/lib/utils/formatters';
import Quick50KBCompressorModal from './Quick50KBCompressorModal';
import { Settings, Zap, Plus, Trash2 } from 'lucide-react';

export default function ImageCompressorUI() {
  const [files, setFiles] = useState<ProcessedFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProcessingIndex, setCurrentProcessingIndex] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0);

  // Quick 50KB Modal State
  const [quickModalOpen, setQuickModalOpen] = useState(false);

  const [options, setOptions] = useState<CompressionOptions>({
    targetUnit: 'KB',
    targetSize: undefined,
    quality: 0.8,
    format: 'original'
  });

  const handleFilesSelected = (selectedFiles: File[]) => {
    const items: ProcessedFileItem[] = selectedFiles.map((file, idx) => ({
      id: `${Date.now()}_${Math.random()}_${idx}`,
      file,
      name: file.name,
      originalSize: file.size,
      type: file.type,
      previewUrl: URL.createObjectURL(file),
      status: 'idle',
      progress: 0
    }));
    setFiles((prev) => [...prev, ...items]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
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
      setCurrentProgress(20);
      updatedFiles[i].status = 'processing';
      setFiles([...updatedFiles]);

      try {
        const result = await compressImage({
          file: updatedFiles[i].file,
          targetUnit: options.targetUnit,
          targetSize: options.targetSize,
          quality: options.quality,
          format: options.format,
          onProgress: (p) => setCurrentProgress(Math.round(p * 100))
        });

        updatedFiles[i].status = 'success';
        updatedFiles[i].resultBlob = result.blob;
        updatedFiles[i].resultUrl = result.url;
        updatedFiles[i].resultSize = result.size;
        updatedFiles[i].resultName = `compressed_${updatedFiles[i].name}`;
      } catch (err: any) {
        updatedFiles[i].status = 'error';
        updatedFiles[i].error = err.message || 'Compression failed';
      }

      setFiles([...updatedFiles]);
    }

    setIsProcessing(false);
  };

  const handleReset = () => {
    files.forEach((f) => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      if (f.resultUrl) URL.revokeObjectURL(f.resultUrl);
    });
    setFiles([]);
    setIsProcessing(false);
  };

  const isCompleted = files.length > 0 && files.every((f) => f.status === 'success');

  const presetTargetSizes = [
    { size: 50, unit: 'KB' },
    { size: 100, unit: 'KB' },
    { size: 200, unit: 'KB' },
    { size: 500, unit: 'KB' },
    { size: 1, unit: 'MB' },
    { size: 2, unit: 'MB' },
    { size: 5, unit: 'MB' }
  ] as const;

  return (
    <div className="w-full space-y-8">
      {/* Quick 50KB Pop-up Modal Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-extrabold text-lg">
            ⚡
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base">Need a Photo Compressed under 50 KB Fast?</h4>
            <p className="text-xs text-amber-100">Quick 1-Click Pop-up tool for UPSC, SSC, NEET, JEE & Govt Exam Forms!</p>
          </div>
        </div>
        <button
          onClick={() => setQuickModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-amber-50 text-slate-900 font-extrabold text-xs shadow-sm transition-all shrink-0"
        >
          🚀 Open 50 KB Pop-Up Compressor
        </button>
      </div>

      <Quick50KBCompressorModal
        isOpen={quickModalOpen}
        onClose={() => setQuickModalOpen(false)}
        defaultTargetKB={50}
      />

      {files.length === 0 ? (
        <FileUploader
          onFilesSelected={handleFilesSelected}
          acceptTypes={['image/*']}
          acceptExtensions={['.jpg', '.jpeg', '.png', '.webp']}
          multiple={true}
          title="Upload Images to Compress (Batch Mode Supported)"
          subtitle="Select or drop multiple JPG, PNG, WEBP images. Type target size in KB or MB."
        />
      ) : (
        <div className="space-y-6">
          {/* Options Control Panel */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyan-600" />
                <h3 className="text-base font-semibold text-slate-900">
                  Batch Compression Settings ({files.length} {files.length === 1 ? 'image' : 'images'})
                </h3>
              </div>

              {/* Add More Images Button */}
              <div>
                <button
                  onClick={() => document.getElementById('add-more-images-input')?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 text-xs font-semibold text-cyan-700 transition-all"
                >
                  <Plus className="w-4 h-4" /> Add More Images
                </button>
                <input
                  id="add-more-images-input"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files && handleFilesSelected(Array.from(e.target.files))}
                />
              </div>
            </div>

            {/* Student Exam Presets Banner */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-amber-800">🎓 Competitive Exam Form Photo & Signature Limits:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setOptions({ ...options, targetSize: 40, targetUnit: 'KB' })}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-800 border border-amber-300 hover:bg-amber-100 transition-all"
                >
                  📸 Passport Photo (20-50 KB)
                </button>
                <button
                  onClick={() => setOptions({ ...options, targetSize: 15, targetUnit: 'KB' })}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-800 border border-amber-300 hover:bg-amber-100 transition-all"
                >
                  ✍️ Signature (10-20 KB)
                </button>
                <button
                  onClick={() => setOptions({ ...options, targetSize: 100, targetUnit: 'KB' })}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-800 border border-amber-300 hover:bg-amber-100 transition-all"
                >
                  📄 NEET / JEE Photo (Under 100 KB)
                </button>
                <button
                  onClick={() => setOptions({ ...options, targetSize: 180, targetUnit: 'KB' })}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-800 border border-amber-300 hover:bg-amber-100 transition-all"
                >
                  📜 Marksheet / ID Photo (Under 200 KB)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Target File Size in KB or MB */}
              <div className="space-y-2 lg:col-span-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-medium text-slate-700">
                    Type Target Size in KB or MB (Optional)
                  </label>
                  {options.targetSize && (
                    <button
                      onClick={() => setOptions({ ...options, targetSize: undefined })}
                      className="text-[11px] text-cyan-600 hover:underline"
                    >
                      Clear Target Size
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Type size, e.g. 50, 100, 200, 500"
                    value={options.targetSize !== undefined ? options.targetSize : ''}
                    onChange={(e) =>
                      setOptions({
                        ...options,
                        targetSize: e.target.value !== '' ? parseFloat(e.target.value) : undefined
                      })
                    }
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  />
                  <select
                    value={options.targetUnit}
                    onChange={(e) => setOptions({ ...options, targetUnit: e.target.value as 'KB' | 'MB' })}
                    className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-bold focus:outline-none"
                  >
                    <option value="KB">KB</option>
                    <option value="MB">MB</option>
                  </select>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-500 self-center mr-1">Presets:</span>
                  {presetTargetSizes.map((p) => (
                    <button
                      key={`${p.size}_${p.unit}`}
                      onClick={() => setOptions({ ...options, targetSize: p.size, targetUnit: p.unit })}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                        options.targetSize === p.size && options.targetUnit === p.unit
                          ? 'bg-cyan-600 text-white border-cyan-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {p.size} {p.unit}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality Slider & Format */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-700 font-medium">Visual Quality Scale</span>
                    <span className="text-cyan-600 font-bold">{Math.round(options.quality * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={options.quality}
                    onChange={(e) => setOptions({ ...options, quality: parseFloat(e.target.value) })}
                    className="w-full h-2 rounded-lg bg-slate-200 accent-cyan-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">Output Format</label>
                  <select
                    value={options.format}
                    onChange={(e) => setOptions({ ...options, format: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="original">Keep Original Format</option>
                    <option value="jpeg">Convert to JPG</option>
                    <option value="png">Convert to PNG</option>
                    <option value="webp">Convert to WEBP</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Trigger */}
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
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md transition-all"
                >
                  <Zap className="w-4 h-4" /> Compress {files.length} {files.length === 1 ? 'Image' : 'Images'} Now
                </button>
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          {isProcessing && (
            <ProcessingProgress
              currentFileIndex={currentProcessingIndex}
              totalFiles={files.length}
              currentFileName={files[currentProcessingIndex]?.name}
              progressPercent={currentProgress}
            />
          )}

          {/* Download Bar */}
          {isCompleted && <DownloadBar files={files} onReset={handleReset} zipFilename="compressed_images.zip" />}

          {/* Image Queue & Preview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((item) => {
              const savings = calculateSavings(item.originalSize, item.resultSize || 0);
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3 relative overflow-hidden group"
                >
                  <div className="aspect-video rounded-xl bg-slate-100 overflow-hidden relative border border-slate-200 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.resultUrl || item.previewUrl}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                    />

                    {!isProcessing && !isCompleted && (
                      <button
                        onClick={() => removeFile(item.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all opacity-80 group-hover:opacity-100"
                        title="Remove Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-800 truncate">{item.name}</h4>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                      <span>Original: {formatBytes(item.originalSize)}</span>
                      {item.resultSize && (
                        <span className="font-bold text-emerald-700">
                          {formatBytes(item.resultSize)} ({savings.text})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
