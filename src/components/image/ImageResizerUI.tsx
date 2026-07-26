'use client';

import { useState } from 'react';
import FileUploader from '@/components/common/FileUploader';
import DownloadBar from '@/components/common/DownloadBar';
import ProcessingProgress from '@/components/common/ProcessingProgress';
import { ProcessedFileItem, ResizeOptions } from '@/types/file';
import { resizeImage } from '@/lib/image/resizer';
import { Settings, Lock, Unlock, Zap, GraduationCap } from 'lucide-react';

export default function ImageResizerUI() {
  const [files, setFiles] = useState<ProcessedFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProcessingIndex, setCurrentProcessingIndex] = useState(0);

  const [options, setOptions] = useState<ResizeOptions>({
    mode: 'pixels',
    width: 1920,
    height: 1080,
    percentage: 50,
    maintainAspectRatio: true
  });

  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);

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

    if (selectedFiles.length > 0) {
      const img = new Image();
      const url = URL.createObjectURL(selectedFiles[0]);
      img.onload = () => {
        URL.revokeObjectURL(url);
        setOriginalDimensions({ width: img.width, height: img.height });
        setOptions((prev) => ({
          ...prev,
          width: img.width,
          height: img.height
        }));
      };
      img.src = url;
    }
  };

  const handleWidthChange = (val: number) => {
    if (options.maintainAspectRatio && originalDimensions) {
      const ratio = originalDimensions.height / originalDimensions.width;
      setOptions({
        ...options,
        width: val,
        height: Math.round(val * ratio)
      });
    } else {
      setOptions({ ...options, width: val });
    }
  };

  const handleHeightChange = (val: number) => {
    if (options.maintainAspectRatio && originalDimensions) {
      const ratio = originalDimensions.width / originalDimensions.height;
      setOptions({
        ...options,
        height: val,
        width: Math.round(val * ratio)
      });
    } else {
      setOptions({ ...options, height: val });
    }
  };

  const applyExamPreset = (w: number, h: number) => {
    setOptions({
      mode: 'pixels',
      width: w,
      height: h,
      percentage: 50,
      maintainAspectRatio: false
    });
  };

  const startResizing = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);

    const updatedFiles = [...files];

    for (let i = 0; i < updatedFiles.length; i++) {
      setCurrentProcessingIndex(i);
      updatedFiles[i].status = 'processing';
      setFiles([...updatedFiles]);

      try {
        let targetW = options.width;
        let targetH = options.height;

        if (options.mode === 'percentage') {
          const img = await loadImageDimensions(updatedFiles[i].file);
          targetW = Math.round((img.width * options.percentage) / 100);
          targetH = Math.round((img.height * options.percentage) / 100);
        }

        const result = await resizeImage({
          file: updatedFiles[i].file,
          targetWidth: targetW,
          targetHeight: targetH
        });

        updatedFiles[i].status = 'success';
        updatedFiles[i].resultBlob = result.blob;
        updatedFiles[i].resultUrl = result.url;
        updatedFiles[i].resultSize = result.size;
        updatedFiles[i].resultName = `resized_${updatedFiles[i].name}`;
        updatedFiles[i].dimensions = { width: targetW, height: targetH };
      } catch (err: any) {
        updatedFiles[i].status = 'error';
        updatedFiles[i].error = err.message || 'Resizing failed';
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
    setOriginalDimensions(null);
    setIsProcessing(false);
  };

  const isCompleted = files.length > 0 && files.every((f) => f.status === 'success');

  const examPresets = [
    { name: 'Govt Exam Passport Photo', w: 200, h: 230, tag: 'UPSC / SSC / IBPS' },
    { name: 'Govt Exam Signature', w: 140, h: 60, tag: 'Standard Signature' },
    { name: 'NTA / NEET Passport Photo', w: 300, h: 300, tag: 'NEET / JEE' },
    { name: 'High-Res Passport Photo', w: 413, h: 531, tag: '3.5 x 4.5 cm' }
  ];

  return (
    <div className="w-full space-y-8">
      {files.length === 0 ? (
        <FileUploader
          onFilesSelected={handleFilesSelected}
          acceptTypes={['image/*']}
          acceptExtensions={['.jpg', '.jpeg', '.png', '.webp']}
          multiple={true}
          title="Upload Photo or Signature to Resize for Exam Forms"
          subtitle="Resize passport photos & signatures to exact competitive exam dimensions (UPSC, SSC, NEET, JEE, GATE, Banking)."
        />
      ) : (
        <div className="space-y-6">
          {/* Student Exam Presets Banner */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-amber-700" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Student & Competitive Exam Form Presets
              </h4>
            </div>
            <p className="text-xs text-amber-800">
              One-click standard photo & signature dimensions for UPSC, SSC, NEET, JEE, Railway, and IBPS online application forms:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {examPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyExamPreset(preset.w, preset.h)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    options.width === preset.w && options.height === preset.h
                      ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                      : 'bg-white text-slate-800 border-amber-300 hover:bg-amber-100'
                  }`}
                >
                  {preset.name} ({preset.w} × {preset.h} px)
                </button>
              ))}
            </div>
          </div>

          {/* Controls Panel */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyan-600" />
                <h3 className="text-base font-semibold text-slate-900">Custom Dimensions</h3>
              </div>

              {/* Mode Toggle */}
              <div className="flex p-1 rounded-xl bg-slate-200/80 border border-slate-300">
                <button
                  onClick={() => setOptions({ ...options, mode: 'pixels' })}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    options.mode === 'pixels' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Pixels (px)
                </button>
                <button
                  onClick={() => setOptions({ ...options, mode: 'percentage' })}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    options.mode === 'percentage' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Percentage (%)
                </button>
              </div>
            </div>

            {options.mode === 'pixels' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">Width (px)</label>
                  <input
                    type="number"
                    value={options.width || ''}
                    onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-700">Height (px)</label>
                  <input
                    type="number"
                    value={options.height || ''}
                    onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOptions({ ...options, maintainAspectRatio: !options.maintainAspectRatio })}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all w-full justify-center ${
                      options.maintainAspectRatio
                        ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    {options.maintainAspectRatio ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    Lock Aspect Ratio
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-medium">Resize Percentage</span>
                  <span className="text-cyan-600 font-bold">{options.percentage}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="5"
                  value={options.percentage}
                  onChange={(e) => setOptions({ ...options, percentage: parseInt(e.target.value) })}
                  className="w-full h-2 rounded-lg bg-slate-200 accent-cyan-600 cursor-pointer"
                />
              </div>
            )}

            {!isCompleted && !isProcessing && (
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs text-slate-700 transition-colors"
                >
                  Clear Queue
                </button>
                <button
                  onClick={startResizing}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md transition-all"
                >
                  <Zap className="w-4 h-4" /> Resize Photos Now
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

          {isCompleted && <DownloadBar files={files} onReset={handleReset} zipFilename="resized_exam_photos.zip" />}
        </div>
      )}
    </div>
  );
}

function loadImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };
    img.src = url;
  });
}
