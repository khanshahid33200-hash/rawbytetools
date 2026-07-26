'use client';

import { useState } from 'react';
import FileUploader from '@/components/common/FileUploader';
import DownloadBar from '@/components/common/DownloadBar';
import { ProcessedFileItem } from '@/types/file';
import { mergePdfFiles } from '@/lib/pdf/pdfManipulator';
import { formatBytes } from '@/lib/utils/formatters';
import { Combine, ArrowUp, ArrowDown, Trash2, Zap, RefreshCw } from 'lucide-react';

export default function MergePdfUI() {
  const [files, setFiles] = useState<ProcessedFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedResult, setMergedResult] = useState<ProcessedFileItem | null>(null);

  const handleFilesSelected = (selectedFiles: File[]) => {
    const items: ProcessedFileItem[] = selectedFiles.map((file, idx) => ({
      id: `${Date.now()}_${idx}`,
      file,
      name: file.name,
      originalSize: file.size,
      type: file.type,
      previewUrl: '',
      status: 'idle',
      progress: 0
    }));
    setFiles((prev) => [...prev, ...items]);
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= files.length) return;
    const newFiles = [...files];
    const temp = newFiles[index];
    newFiles[index] = newFiles[targetIdx];
    newFiles[targetIdx] = temp;
    setFiles(newFiles);
  };

  const removeFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  const startMerge = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);

    try {
      const rawFiles = files.map((f) => f.file);
      const result = await mergePdfFiles(rawFiles);

      const mergedItem: ProcessedFileItem = {
        id: `merged_${Date.now()}`,
        file: rawFiles[0],
        name: 'merged_document.pdf',
        originalSize: files.reduce((a, b) => a + b.originalSize, 0),
        type: 'application/pdf',
        previewUrl: '',
        status: 'success',
        progress: 100,
        resultBlob: result.blob,
        resultUrl: result.url,
        resultSize: result.blob.size,
        resultName: 'merged_document.pdf'
      };

      setMergedResult(mergedItem);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (mergedResult?.resultUrl) URL.revokeObjectURL(mergedResult.resultUrl);
    setFiles([]);
    setMergedResult(null);
  };

  return (
    <div className="w-full space-y-8">
      {files.length === 0 ? (
        <FileUploader
          onFilesSelected={handleFilesSelected}
          acceptTypes={['application/pdf']}
          acceptExtensions={['.pdf']}
          title="Upload PDFs to Merge"
          subtitle="Select 2 or more PDF documents to combine into a single PDF."
        />
      ) : (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Combine className="w-4 h-4 text-purple-600" /> PDF Merge Queue ({files.length} documents)
              </h3>

              <button
                onClick={() => document.getElementById('add-more-pdf-input')?.click()}
                className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-xs font-semibold text-purple-700"
              >
                + Add More PDFs
              </button>
              <input
                id="add-more-pdf-input"
                type="file"
                multiple
                accept=".pdf"
                className="hidden"
                onChange={(e) => e.target.files && handleFilesSelected(Array.from(e.target.files))}
              />
            </div>

            {/* List of files to merge with reordering buttons */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {files.map((file, idx) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200 text-xs shadow-2xs"
                >
                  <div className="flex items-center gap-3 truncate">
                    <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-[11px] shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-slate-800 truncate">{file.name}</span>
                    <span className="text-[11px] text-slate-500 shrink-0">({formatBytes(file.originalSize)})</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => moveFile(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveFile(idx, 'down')}
                      disabled={idx === files.length - 1}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {!mergedResult && (
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs text-slate-700 transition-colors"
                >
                  Clear Queue
                </button>
                <button
                  onClick={startMerge}
                  disabled={files.length < 2 || isProcessing}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  Merge PDF Documents
                </button>
              </div>
            )}
          </div>

          {mergedResult && <DownloadBar files={[mergedResult]} onReset={handleReset} zipFilename="merged_document.zip" />}
        </div>
      )}
    </div>
  );
}
