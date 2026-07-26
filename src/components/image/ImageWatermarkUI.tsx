'use client';

import { useState } from 'react';
import FileUploader from '@/components/common/FileUploader';
import DownloadBar from '@/components/common/DownloadBar';
import { ProcessedFileItem, WatermarkOptions } from '@/types/file';
import { applyWatermark } from '@/lib/image/watermark';
import { Stamp, Zap, RefreshCw } from 'lucide-react';

export default function ImageWatermarkUI() {
  const [fileItem, setFileItem] = useState<ProcessedFileItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [options, setOptions] = useState<WatermarkOptions>({
    type: 'text',
    text: 'RauByte Tools',
    opacity: 0.8,
    position: 'center',
    scale: 0.3,
    rotation: 0,
    fontColor: '#ffffff'
  });

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      const f = files[0];
      setFileItem({
        id: `${Date.now()}`,
        file: f,
        name: f.name,
        originalSize: f.size,
        type: f.type,
        previewUrl: URL.createObjectURL(f),
        status: 'idle',
        progress: 0
      });
    }
  };

  const startWatermark = async () => {
    if (!fileItem) return;
    setIsProcessing(true);

    try {
      const result = await applyWatermark(fileItem.file, options);
      setFileItem({
        ...fileItem,
        status: 'success',
        resultBlob: result.blob,
        resultUrl: result.url,
        resultSize: result.size,
        resultName: `watermarked_${fileItem.name}`
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (fileItem?.previewUrl) URL.revokeObjectURL(fileItem.previewUrl);
    if (fileItem?.resultUrl) URL.revokeObjectURL(fileItem.resultUrl);
    setFileItem(null);
  };

  return (
    <div className="w-full space-y-8">
      {!fileItem ? (
        <FileUploader
          onFilesSelected={handleFilesSelected}
          acceptTypes={['image/*']}
          acceptExtensions={['.jpg', '.jpeg', '.png', '.webp']}
          multiple={false}
          title="Upload Image for Watermarking"
          subtitle="Add text or logo image watermarks with custom position, opacity, scale & rotation."
        />
      ) : (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Stamp className="w-4 h-4 text-cyan-600" /> Watermark Configuration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Type Switcher */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-700">Watermark Type</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOptions({ ...options, type: 'text' })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      options.type === 'text'
                        ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Text Watermark
                  </button>
                  <button
                    onClick={() => setOptions({ ...options, type: 'image' })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      options.type === 'image'
                        ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Logo Image
                  </button>
                </div>
              </div>

              {options.type === 'text' ? (
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-700">Watermark Text</label>
                  <input
                    type="text"
                    value={options.text}
                    onChange={(e) => setOptions({ ...options, text: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-700">Upload Logo Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setOptions({ ...options, watermarkImage: e.target.files[0] });
                      }
                    }}
                    className="w-full text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300"
                  />
                </div>
              )}

              {/* Position */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-700">Position Preset</label>
                <select
                  value={options.position}
                  onChange={(e) => setOptions({ ...options, position: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none"
                >
                  <option value="center">Center</option>
                  <option value="top-left">Top Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-right">Bottom Right</option>
                </select>
              </div>

              {/* Opacity Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-medium">Opacity</span>
                  <span className="text-cyan-600 font-bold">{Math.round(options.opacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={options.opacity}
                  onChange={(e) => setOptions({ ...options, opacity: parseFloat(e.target.value) })}
                  className="w-full h-2 rounded-lg bg-slate-200 accent-cyan-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs text-slate-700 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={startWatermark}
                disabled={isProcessing}
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md transition-all"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                Apply Watermark
              </button>
            </div>
          </div>

          {fileItem.status === 'success' && (
            <DownloadBar files={[fileItem]} onReset={handleReset} zipFilename="watermarked_photo.zip" />
          )}

          <div className="p-4 rounded-3xl bg-white border border-slate-200 flex justify-center items-center shadow-2xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fileItem.resultUrl || fileItem.previewUrl}
              alt={fileItem.name}
              className="max-h-[440px] object-contain rounded-2xl border border-slate-200"
            />
          </div>
        </div>
      )}
    </div>
  );
}
