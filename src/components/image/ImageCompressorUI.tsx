'use client';

import { useState } from 'react';
import FileUploader from '@/components/common/FileUploader';
import DownloadBar from '@/components/common/DownloadBar';
import ProcessingProgress from '@/components/common/ProcessingProgress';
import { ProcessedFileItem, CompressionOptions } from '@/types/file';
import { compressImage } from '@/lib/image/compressor';
import { formatBytes, calculateSavings } from '@/lib/utils/formatters';
import { Settings, Sliders, Zap } from 'lucide-react';

export default function ImageCompressorUI() {
  const [files, setFiles] = useState<ProcessedFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProcessingIndex, setCurrentProcessingIndex] = useState(0);
  const [currentProgress, setCurrentProgress] = useState(0);

  const [options, setOptions] = useState<CompressionOptions>({
    targetUnit: 'KB',
    targetSize: undefined,
    quality: 0.8,
    format: 'original'
  });

  const handleFilesSelected = (selectedFiles: File[]) => {
    const items: ProcessedFileItem[] = selectedFiles.map((file, idx) => ({
      id: `${Date.now()}_${idx}`,
      file,
      name: file.name,
      originalSize: file.size,
      type: file.type,
      previewUrl: URL.createObjectURL(file),
      status: 'idle',
      progress: 0
    }));
    setFiles(items);
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

  return (
    <div className="w-full space-y-8">
      {files.length === 0 ? (
        <FileUploader
          onFilesSelected={handleFilesSelected}
          acceptTypes={['image/*']}
          acceptExtensions={['.jpg', '.jpeg', '.png', '.webp']}
          title="Upload Images to Compress"
          subtitle="Compress JPG, PNG, WEBP images to specific file sizes (KB/MB) in browser."
        />
      ) : (
        <div className="space-y-6">
          {/* Options Control Panel */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
              <Settings className="w-5 h-5 text-cyan-600" />
              <h3 className="text-base font-semibold text-slate-900">Compression Settings</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Quality Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-medium">Image Quality</span>
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

              {/* Target File Size */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-700">Target File Size (Optional)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="e.g. 200"
                    value={options.targetSize || ''}
                    onChange={(e) =>
                      setOptions({
                        ...options,
                        targetSize: e.target.value ? parseFloat(e.target.value) : undefined
                      })
                    }
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  />
                  <select
                    value={options.targetUnit}
                    onChange={(e) => setOptions({ ...options, targetUnit: e.target.value as 'KB' | 'MB' })}
                    className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none"
                  >
                    <option value="KB">KB</option>
                    <option value="MB">MB</option>
                  </select>
                </div>
              </div>

              {/* Format Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-700">Output Format</label>
                <select
                  value={options.format}
                  onChange={(e) => setOptions({ ...options, format: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                >
                  <option value="original">Keep Original Format</option>
                  <option value="jpeg">Convert to JPG</option>
                  <option value="png">Convert to PNG</option>
                  <option value="webp">Convert to WEBP</option>
                </select>
              </div>
            </div>

            {/* Action Trigger */}
            {!isCompleted && !isProcessing && (
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs text-slate-700 transition-colors"
                >
                  Clear Files
                </button>
                <button
                  onClick={startCompression}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md transition-all"
                >
                  <Zap className="w-4 h-4" /> Compress Images Now
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

          {/* Preview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((item) => {
              const savings = calculateSavings(item.originalSize, item.resultSize || 0);
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3 relative overflow-hidden"
                >
                  <div className="aspect-video rounded-xl bg-slate-100 overflow-hidden relative border border-slate-200 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.resultUrl || item.previewUrl}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                    />
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
