'use client';

import { useState } from 'react';
import FileUploader from '@/components/common/FileUploader';
import DownloadBar from '@/components/common/DownloadBar';
import ProcessingProgress from '@/components/common/ProcessingProgress';
import { ProcessedFileItem } from '@/types/file';
import { convertImageFormat, TargetFormat } from '@/lib/image/converter';
import { Settings, RefreshCw, Zap } from 'lucide-react';

export default function ImageConverterUI() {
  const [files, setFiles] = useState<ProcessedFileItem[]>([]);
  const [targetFormat, setTargetFormat] = useState<TargetFormat>('image/webp');
  const [quality, setQuality] = useState(0.9);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProcessingIndex, setCurrentProcessingIndex] = useState(0);

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

  const startConversion = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);

    const updatedFiles = [...files];
    const extMap: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/avif': 'avif'
    };

    for (let i = 0; i < updatedFiles.length; i++) {
      setCurrentProcessingIndex(i);
      updatedFiles[i].status = 'processing';
      setFiles([...updatedFiles]);

      try {
        const result = await convertImageFormat(updatedFiles[i].file, targetFormat, quality);
        const baseName = updatedFiles[i].name.substring(0, updatedFiles[i].name.lastIndexOf('.'));
        const newExt = extMap[targetFormat] || 'jpg';

        updatedFiles[i].status = 'success';
        updatedFiles[i].resultBlob = result.blob;
        updatedFiles[i].resultUrl = result.url;
        updatedFiles[i].resultSize = result.size;
        updatedFiles[i].resultName = `${baseName}.${newExt}`;
      } catch (err: any) {
        updatedFiles[i].status = 'error';
        updatedFiles[i].error = err.message || 'Conversion failed';
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
          acceptExtensions={['.jpg', '.jpeg', '.png', '.webp', '.avif']}
          title="Upload Images to Convert Format"
          subtitle="Batch convert between JPG, PNG, WEBP, and AVIF formats with quality control."
        />
      ) : (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
              <Settings className="w-5 h-5 text-cyan-600" />
              <h3 className="text-base font-semibold text-slate-900">Select Target Format</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-700">Convert To</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'WEBP', val: 'image/webp' },
                    { label: 'JPG', val: 'image/jpeg' },
                    { label: 'PNG', val: 'image/png' },
                    { label: 'AVIF', val: 'image/avif' }
                  ].map((fmt) => (
                    <button
                      key={fmt.val}
                      onClick={() => setTargetFormat(fmt.val as TargetFormat)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        targetFormat === fmt.val
                          ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-medium">Output Quality</span>
                  <span className="text-cyan-600 font-bold">{Math.round(quality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full h-2 rounded-lg bg-slate-200 accent-cyan-600 cursor-pointer"
                />
              </div>
            </div>

            {!isCompleted && !isProcessing && (
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs text-slate-700 transition-colors"
                >
                  Clear Files
                </button>
                <button
                  onClick={startConversion}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md transition-all"
                >
                  <Zap className="w-4 h-4" /> Convert Images Now
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

          {isCompleted && <DownloadBar files={files} onReset={handleReset} zipFilename="converted_images.zip" />}
        </div>
      )}
    </div>
  );
}
