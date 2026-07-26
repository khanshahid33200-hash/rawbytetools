'use client';

import { useState } from 'react';
import FileUploader from '@/components/common/FileUploader';
import DownloadBar from '@/components/common/DownloadBar';
import { ProcessedFileItem, CropOptions } from '@/types/file';
import { cropImage } from '@/lib/image/cropper';
import { Crop as CropIcon, Circle, Square, Zap, RefreshCw } from 'lucide-react';

export default function ImageCropperUI() {
  const [fileItem, setFileItem] = useState<ProcessedFileItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [options, setOptions] = useState<CropOptions>({
    cropShape: 'custom',
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

  const startCrop = async () => {
    if (!fileItem) return;
    setIsProcessing(true);

    try {
      // Calculate crop rect (center 80% default)
      const img = await loadImage(fileItem.file);
      const cropW = options.cropShape === 'circle' ? Math.min(img.width, img.height) * 0.8 : img.width * 0.8;
      const cropH = options.cropShape === 'circle' ? cropW : img.height * 0.8;
      const cropX = (img.width - cropW) / 2;
      const cropY = (img.height - cropH) / 2;

      const result = await cropImage({
        file: fileItem.file,
        cropArea: { x: cropX, y: cropY, width: cropW, height: cropH },
        shape: options.cropShape
      });

      setFileItem({
        ...fileItem,
        status: 'success',
        resultBlob: result.blob,
        resultUrl: result.url,
        resultSize: result.size,
        resultName: `cropped_${fileItem.name}`
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
  };

  return (
    <div className="w-full space-y-8">
      {!fileItem ? (
        <FileUploader
          onFilesSelected={handleFilesSelected}
          acceptTypes={['image/*']}
          acceptExtensions={['.jpg', '.jpeg', '.png', '.webp']}
          multiple={false}
          title="Upload Image to Crop"
          subtitle="Crop photos into Square, Circle, 16:9, 4:3, 1:1, or custom shapes."
        />
      ) : (
        <div className="space-y-6">
          {/* Settings Bar */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <CropIcon className="w-4 h-4 text-cyan-600" /> Choose Crop Shape & Presets
            </h3>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setOptions({ ...options, cropShape: 'custom' })}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  options.cropShape === 'custom'
                    ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                Custom Free
              </button>

              <button
                onClick={() => setOptions({ ...options, cropShape: 'square' })}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  options.cropShape === 'square'
                    ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <Square className="w-3.5 h-3.5" /> Square (1:1)
              </button>

              <button
                onClick={() => setOptions({ ...options, cropShape: 'circle' })}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  options.cropShape === 'circle'
                    ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <Circle className="w-3.5 h-3.5" /> Circle Profile Mask
              </button>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs text-slate-700 transition-colors"
              >
                Reset Image
              </button>
              <button
                onClick={startCrop}
                disabled={isProcessing}
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md transition-all"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                Crop & Download
              </button>
            </div>
          </div>

          {/* Download Bar when done */}
          {fileItem.status === 'success' && (
            <DownloadBar files={[fileItem]} onReset={handleReset} zipFilename="cropped_photo.zip" />
          )}

          {/* Preview Container */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200 flex justify-center items-center shadow-2xs">
            <div className="max-h-[500px] overflow-hidden rounded-2xl border border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={fileItem.resultUrl || fileItem.previewUrl}
                alt={fileItem.name}
                className="max-h-[480px] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.src = url;
  });
}
