'use client';

import { useState } from 'react';
import FileUploader from '@/components/common/FileUploader';
import DownloadBar from '@/components/common/DownloadBar';
import ProcessingProgress from '@/components/common/ProcessingProgress';
import { ProcessedFileItem } from '@/types/file';
import { convertPdfToImages } from '@/lib/pdf/pdfToImage';
import { FileImage, Settings, Zap, RefreshCw } from 'lucide-react';

export default function PdfToImagesUI() {
  const [fileItem, setFileItem] = useState<ProcessedFileItem | null>(null);
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [quality, setQuality] = useState(0.9);
  const [pageRange, setPageRange] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ProcessedFileItem[]>([]);

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      const f = files[0];
      setFileItem({
        id: `${Date.now()}`,
        file: f,
        name: f.name,
        originalSize: f.size,
        type: f.type,
        previewUrl: '',
        status: 'idle',
        progress: 0
      });
    }
  };

  const startConversion = async () => {
    if (!fileItem) return;
    setIsProcessing(true);

    try {
      const pageImages = await convertPdfToImages(fileItem.file, format, quality, 1.5, pageRange);
      const baseName = fileItem.name.replace(/\.[^/.]+$/, '');
      const ext = format === 'jpeg' ? 'jpg' : 'png';

      const items: ProcessedFileItem[] = pageImages.map((p) => ({
        id: `page_${p.pageIndex}`,
        file: fileItem.file,
        name: `${baseName}_page_${p.pageIndex}.${ext}`,
        originalSize: fileItem.originalSize,
        type: `image/${format}`,
        previewUrl: p.url,
        status: 'success',
        progress: 100,
        resultBlob: p.blob,
        resultUrl: p.url,
        resultSize: p.blob.size,
        resultName: `${baseName}_page_${p.pageIndex}.${ext}`
      }));

      setResults(items);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    results.forEach((r) => {
      if (r.resultUrl) URL.revokeObjectURL(r.resultUrl);
    });
    setFileItem(null);
    setResults([]);
  };

  return (
    <div className="w-full space-y-8">
      {!fileItem ? (
        <FileUploader
          onFilesSelected={handleFilesSelected}
          acceptTypes={['application/pdf']}
          acceptExtensions={['.pdf']}
          multiple={false}
          title="Upload PDF to Extract Images"
          subtitle="Convert every page of a PDF document into high-resolution PNG or JPG photos."
        />
      ) : (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <FileImage className="w-4 h-4 text-purple-600" /> Image Extraction Controls
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-700">Format</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFormat('png')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      format === 'png'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    PNG
                  </button>
                  <button
                    onClick={() => setFormat('jpeg')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      format === 'jpeg'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    JPG
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-700">Page Range (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 1-5, 8 (Default: All)"
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-medium">Quality</span>
                  <span className="text-purple-600 font-bold">{Math.round(quality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.0"
                  step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full h-2 rounded-lg bg-slate-200 accent-purple-600 cursor-pointer"
                />
              </div>
            </div>

            {results.length === 0 && (
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs text-slate-700 transition-colors"
                >
                  Clear PDF
                </button>
                <button
                  onClick={startConversion}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md transition-all"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  Convert PDF to Images
                </button>
              </div>
            )}
          </div>

          {isProcessing && (
            <ProcessingProgress currentFileIndex={0} totalFiles={1} currentFileName={fileItem.name} progressPercent={100} />
          )}

          {results.length > 0 && <DownloadBar files={results} onReset={handleReset} zipFilename="extracted_pdf_images.zip" />}
        </div>
      )}
    </div>
  );
}
