'use client';

import { useState } from 'react';
import FileUploader from '@/components/common/FileUploader';
import DownloadBar from '@/components/common/DownloadBar';
import { ProcessedFileItem, TextEditorOptions } from '@/types/file';
import { addStyledTextToImage } from '@/lib/image/watermark';
import { Type, Zap, RefreshCw } from 'lucide-react';

export default function ImageTextEditorUI() {
  const [fileItem, setFileItem] = useState<ProcessedFileItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [options, setOptions] = useState<TextEditorOptions>({
    text: 'Your Custom Text',
    fontFamily: 'sans-serif',
    fontSize: 48,
    color: '#ffffff',
    strokeColor: '#000000',
    strokeWidth: 2,
    posX: 50, // center %
    posY: 50, // center %
    rotation: 0
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

  const startTextRender = async () => {
    if (!fileItem) return;
    setIsProcessing(true);

    try {
      const result = await addStyledTextToImage(fileItem.file, options);
      setFileItem({
        ...fileItem,
        status: 'success',
        resultBlob: result.blob,
        resultUrl: result.url,
        resultSize: result.size,
        resultName: `edited_${fileItem.name}`
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
          title="Upload Image for Text Overlay"
          subtitle="Add styled text, captions, fonts, strokes, and positioning overlays to photos."
        />
      ) : (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <Type className="w-4 h-4 text-cyan-600" /> Typography & Text Styling Controls
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="block text-xs font-medium text-slate-700">Text Content</label>
                <input
                  type="text"
                  value={options.text}
                  onChange={(e) => setOptions({ ...options, text: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-700">Font Color</label>
                <input
                  type="color"
                  value={options.color}
                  onChange={(e) => setOptions({ ...options, color: e.target.value })}
                  className="w-full h-9 p-1 rounded-xl bg-white border border-slate-300 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-medium">Position X (%)</span>
                  <span className="text-cyan-600 font-bold">{options.posX}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="95"
                  value={options.posX}
                  onChange={(e) => setOptions({ ...options, posX: parseInt(e.target.value) })}
                  className="w-full h-2 rounded-lg bg-slate-200 accent-cyan-600 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-medium">Position Y (%)</span>
                  <span className="text-cyan-600 font-bold">{options.posY}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="95"
                  value={options.posY}
                  onChange={(e) => setOptions({ ...options, posY: parseInt(e.target.value) })}
                  className="w-full h-2 rounded-lg bg-slate-200 accent-cyan-600 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-medium">Font Size</span>
                  <span className="text-cyan-600 font-bold">{options.fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="120"
                  value={options.fontSize}
                  onChange={(e) => setOptions({ ...options, fontSize: parseInt(e.target.value) })}
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
                onClick={startTextRender}
                disabled={isProcessing}
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md transition-all"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                Render Text Overlay
              </button>
            </div>
          </div>

          {fileItem.status === 'success' && (
            <DownloadBar files={[fileItem]} onReset={handleReset} zipFilename="text_edited_photo.zip" />
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
