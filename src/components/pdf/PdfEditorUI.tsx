'use client';

import { useState } from 'react';
import FileUploader from '@/components/common/FileUploader';
import DownloadBar from '@/components/common/DownloadBar';
import { ProcessedFileItem } from '@/types/file';
import { convertPdfToImages } from '@/lib/pdf/pdfToImage';
import { processPdfPages, PageModification } from '@/lib/pdf/pdfManipulator';
import { FileText, RotateCw, Trash2, ArrowLeft, ArrowRight, Zap, RefreshCw } from 'lucide-react';

interface PdfPageThumb {
  id: string;
  originalIndex: number;
  rotation: number;
  previewUrl: string;
}

export default function PdfEditorUI() {
  const [fileItem, setFileItem] = useState<ProcessedFileItem | null>(null);
  const [pages, setPages] = useState<PdfPageThumb[]>([]);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultItem, setResultItem] = useState<ProcessedFileItem | null>(null);

  const handleFilesSelected = async (files: File[]) => {
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

      setIsLoadingPages(true);
      try {
        const thumbs = await convertPdfToImages(f, 'png', 0.6, 0.6);
        const pageList: PdfPageThumb[] = thumbs.map((t, idx) => ({
          id: `p_${idx}`,
          originalIndex: idx,
          rotation: 0,
          previewUrl: t.url
        }));
        setPages(pageList);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingPages(false);
      }
    }
  };

  const rotatePage = (id: string) => {
    setPages(
      pages.map((p) => (p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p))
    );
  };

  const deletePage = (id: string) => {
    setPages(pages.filter((p) => p.id !== id));
  };

  const movePage = (index: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= pages.length) return;
    const newPages = [...pages];
    const temp = newPages[index];
    newPages[index] = newPages[targetIdx];
    newPages[targetIdx] = temp;
    setPages(newPages);
  };

  const startExport = async () => {
    if (!fileItem || pages.length === 0) return;
    setIsProcessing(true);

    try {
      const mods: PageModification[] = pages.map((p) => ({
        pageIndex: p.originalIndex,
        rotation: p.rotation
      }));

      const result = await processPdfPages(fileItem.file, mods);

      const exportedItem: ProcessedFileItem = {
        id: `edited_${Date.now()}`,
        file: fileItem.file,
        name: `edited_${fileItem.name}`,
        originalSize: fileItem.originalSize,
        type: 'application/pdf',
        previewUrl: '',
        status: 'success',
        progress: 100,
        resultBlob: result.blob,
        resultUrl: result.url,
        resultSize: result.blob.size,
        resultName: `edited_${fileItem.name}`,
        pageCount: result.pageCount
      };

      setResultItem(exportedItem);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    pages.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    if (resultItem?.resultUrl) URL.revokeObjectURL(resultItem.resultUrl);
    setFileItem(null);
    setPages([]);
    setResultItem(null);
  };

  return (
    <div className="w-full space-y-8">
      {!fileItem ? (
        <FileUploader
          onFilesSelected={handleFilesSelected}
          acceptTypes={['application/pdf']}
          acceptExtensions={['.pdf']}
          multiple={false}
          title="Upload PDF to Edit Pages"
          subtitle="Reorder, rotate, or delete individual pages interactively before saving."
        />
      ) : (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" /> PDF Page Editor ({pages.length} pages remaining)
              </h3>

              {!resultItem && (
                <button
                  onClick={startExport}
                  disabled={pages.length === 0 || isProcessing || isLoadingPages}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  Save & Export PDF
                </button>
              )}
            </div>

            {isLoadingPages ? (
              <div className="py-12 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
                <p className="text-xs text-slate-600">Rendering PDF Page Thumbnails...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[550px] overflow-y-auto pr-1">
                {pages.map((p, idx) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-2xl bg-white border border-slate-200 space-y-2 relative group overflow-hidden shadow-2xs"
                  >
                    <div className="aspect-[3/4] rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.previewUrl}
                        alt={`Page ${idx + 1}`}
                        className="max-h-full max-w-full object-contain transition-transform duration-300"
                        style={{ transform: `rotate(${p.rotation}deg)` }}
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/90 border border-slate-300 text-[10px] font-bold text-slate-700 shadow-2xs">
                        P. {idx + 1}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-1 pt-1 text-slate-700">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => movePage(idx, 'left')}
                          disabled={idx === 0}
                          className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700"
                          title="Move Left"
                        >
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => movePage(idx, 'right')}
                          disabled={idx === pages.length - 1}
                          className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700"
                          title="Move Right"
                        >
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => rotatePage(p.id)}
                          className="p-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200"
                          title="Rotate 90°"
                        >
                          <RotateCw className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => deletePage(p.id)}
                          className="p-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                          title="Delete Page"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {resultItem && <DownloadBar files={[resultItem]} onReset={handleReset} zipFilename="edited_pdf_document.pdf" />}
        </div>
      )}
    </div>
  );
}
