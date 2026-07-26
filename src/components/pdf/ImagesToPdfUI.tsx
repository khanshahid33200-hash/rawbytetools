'use client';

import { useState } from 'react';
import FileUploader from '@/components/common/FileUploader';
import DownloadBar from '@/components/common/DownloadBar';
import { ProcessedFileItem, ImagesToPdfOptions } from '@/types/file';
import { convertImagesToPdf } from '@/lib/pdf/imagesToPdf';
import { Images, Settings, Zap, RefreshCw } from 'lucide-react';

export default function ImagesToPdfUI() {
  const [files, setFiles] = useState<ProcessedFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultItem, setResultItem] = useState<ProcessedFileItem | null>(null);

  const [options, setOptions] = useState<ImagesToPdfOptions>({
    orientation: 'portrait',
    pageSize: 'a4',
    margin: 'small',
    compress: true
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
    setFiles((prev) => [...prev, ...items]);
  };

  const startPdfGeneration = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);

    try {
      const rawFiles = files.map((f) => f.file);
      const result = await convertImagesToPdf(rawFiles, options);

      const pdfItem: ProcessedFileItem = {
        id: `pdf_${Date.now()}`,
        file: rawFiles[0],
        name: 'images_document.pdf',
        originalSize: files.reduce((a, b) => a + b.originalSize, 0),
        type: 'application/pdf',
        previewUrl: '',
        status: 'success',
        progress: 100,
        resultBlob: result.blob,
        resultUrl: result.url,
        resultSize: result.blob.size,
        resultName: 'images_document.pdf',
        pageCount: result.pageCount
      };

      setResultItem(pdfItem);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    files.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    if (resultItem?.resultUrl) URL.revokeObjectURL(resultItem.resultUrl);
    setFiles([]);
    setResultItem(null);
  };

  return (
    <div className="w-full space-y-8">
      {files.length === 0 ? (
        <FileUploader
          onFilesSelected={handleFilesSelected}
          acceptTypes={['image/*']}
          acceptExtensions={['.jpg', '.jpeg', '.png', '.webp']}
          title="Upload Images to Convert to PDF"
          subtitle="Combine multiple photos into a single PDF document with custom margins and page sizes."
        />
      ) : (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
              <Settings className="w-5 h-5 text-purple-600" />
              <h3 className="text-base font-semibold text-slate-900">PDF Document Layout Options</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Page Orientation */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-700">Orientation</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOptions({ ...options, orientation: 'portrait' })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      options.orientation === 'portrait'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Portrait
                  </button>
                  <button
                    onClick={() => setOptions({ ...options, orientation: 'landscape' })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      options.orientation === 'landscape'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Landscape
                  </button>
                </div>
              </div>

              {/* Page Size */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-700">Page Size</label>
                <select
                  value={options.pageSize}
                  onChange={(e) => setOptions({ ...options, pageSize: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none"
                >
                  <option value="a4">A4 (210 x 297 mm)</option>
                  <option value="letter">US Letter (8.5 x 11 in)</option>
                  <option value="fit">Fit Image Dimensions</option>
                </select>
              </div>

              {/* Margins */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-700">Page Margins</label>
                <select
                  value={options.margin}
                  onChange={(e) => setOptions({ ...options, margin: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none"
                >
                  <option value="none">No Margin</option>
                  <option value="small">Small Margin</option>
                  <option value="medium">Medium Margin</option>
                  <option value="large">Large Margin</option>
                </select>
              </div>
            </div>

            {!resultItem && (
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs text-slate-700 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={startPdfGeneration}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md transition-all"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  Generate PDF Document
                </button>
              </div>
            )}
          </div>

          {resultItem && <DownloadBar files={[resultItem]} onReset={handleReset} zipFilename="converted_document.pdf" />}
        </div>
      )}
    </div>
  );
}
