'use client';

import { useState } from 'react';
import FileUploader from '@/components/common/FileUploader';
import DownloadBar from '@/components/common/DownloadBar';
import { ProcessedFileItem } from '@/types/file';
import { rotateAndFlipImage } from '@/lib/image/cropper';
import { RotateCw, FlipHorizontal, FlipVertical, Zap, RefreshCw } from 'lucide-react';

export default function ImageRotateFlipUI() {
  const [fileItem, setFileItem] = useState<ProcessedFileItem | null>(null);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const applyTransformation = async () => {
    if (!fileItem) return;
    setIsProcessing(true);

    try {
      const result = await rotateAndFlipImage(fileItem.file, rotation, flipH, flipV);

      setFileItem({
        ...fileItem,
        status: 'success',
        resultBlob: result.blob,
        resultUrl: result.url,
        resultSize: result.size,
        resultName: `transformed_${fileItem.name}`
      });
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (fileItem?.previewUrl) URL.revokeObjectURL(fileItem.previewUrl);
    if (fileItem?.resultUrl) URL.revokeObjectURL(fileItem.resultUrl);
    setFileItem(null);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
  };

  return (
    <div className="w-full space-y-8">
      {!fileItem ? (
        <FileUploader
          onFilesSelected={handleFilesSelected}
          acceptTypes={['image/*']}
          acceptExtensions={['.jpg', '.jpeg', '.png', '.webp']}
          multiple={false}
          title="Upload Image to Rotate & Flip"
          subtitle="Rotate 90°, 180°, 270° or set custom angle degrees. Flip horizontally or vertically."
        />
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <RotateCw className="w-4 h-4 text-cyan-600" /> Rotation & Mirror Flipping Controls
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Preset Buttons */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-700">Quick Rotation Presets</label>
                <div className="flex flex-wrap gap-2">
                  {[0, 90, 180, 270].map((deg) => (
                    <button
                      key={deg}
                      onClick={() => setRotation(deg)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        rotation === deg
                          ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {deg}°
                    </button>
                  ))}
                </div>
              </div>

              {/* Flip Toggles */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-700">Mirror Flipping</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFlipH(!flipH)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                      flipH ? 'bg-cyan-50 text-cyan-700 border-cyan-200' : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    <FlipHorizontal className="w-4 h-4" /> Flip Horizontal
                  </button>
                  <button
                    onClick={() => setFlipV(!flipV)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                      flipV ? 'bg-cyan-50 text-cyan-700 border-cyan-200' : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    <FlipVertical className="w-4 h-4" /> Flip Vertical
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Angle Slider */}
            <div className="space-y-1 pt-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-700 font-medium">Fine Custom Angle</span>
                <span className="text-cyan-600 font-bold">{rotation}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg bg-slate-200 accent-cyan-600 cursor-pointer"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs text-slate-700 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={applyTransformation}
                disabled={isProcessing}
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md transition-all"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                Apply Transformation
              </button>
            </div>
          </div>

          {fileItem.status === 'success' && (
            <DownloadBar files={[fileItem]} onReset={handleReset} zipFilename="transformed_image.zip" />
          )}

          {/* Live Preview */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200 flex justify-center items-center shadow-2xs">
            <div
              className="transition-transform duration-300 max-h-[480px] overflow-hidden rounded-2xl border border-slate-200"
              style={{
                transform: `rotate(${rotation}deg) scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})`
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fileItem.resultUrl || fileItem.previewUrl}
                alt={fileItem.name}
                className="max-h-[440px] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
