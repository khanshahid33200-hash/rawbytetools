'use client';

import { useState } from 'react';
import FileUploader from '@/components/common/FileUploader';
import DownloadBar from '@/components/common/DownloadBar';
import ProcessingProgress from '@/components/common/ProcessingProgress';
import { ProcessedFileItem } from '@/types/file';
import { compressPdfFile } from '@/lib/pdf/pdfCompressor';
import { Settings, FileArchive, Zap } from 'lucide-react';

export default function PdfCompressorUI() {
  const [files, setFiles] = useState<ProcessedFileItem[]>([]);
  const [level, setLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProcessingIndex, setCurrentProcessingIndex] = useState(0);

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
    setFiles(items);
  };

  const startCompression = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);

    const updatedFiles = [...files];

    for (let i = 0; i < updatedFiles.length; i++) {
      setCurrentProcessingIndex(i);
      updatedFiles[i].status = 'processing';
      setFiles([...updatedFiles]);

      try {
        const result = await compressPdfFile(updatedFiles[i].file, level);

        updatedFiles[i].status = 'success';
        updatedFiles[i].resultBlob = result.blob;
        updatedFiles[i].resultUrl = result.url;
        updatedFiles[i].resultSize = result.size;
        updatedFiles[i].resultName = `compressed_${updatedFiles[i].name}`;
      } catch (err: any) {
        updatedFiles[i].status = 'error';
        updatedFiles[i].error = err.message || 'PDF compression failed';
      }

      setFiles([...updatedFiles]);
    }

    setIsProcessing(false);
  };

  const handleReset = () => {
    files.forEach((f) => {
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
          acceptTypes={['application/pdf']}
          acceptExtensions={['.pdf']}
          title="Upload PDF Files to Compress"
          subtitle="Compress PDF size while preserving layout and crisp readability."
        />
      ) : (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
              <Settings className="w-5 h-5 text-purple-600" />
              <h3 className="text-base font-semibold text-slate-900">PDF Compression Level</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: 'low', label: 'Low Compression', desc: 'Maximum visual quality, minor reduction' },
                { id: 'medium', label: 'Medium Compression', desc: 'Balanced quality & optimal file size' },
                { id: 'high', label: 'High Compression', desc: 'Smallest file size for low bandwidth' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setLevel(item.id as any)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    level === item.id
                      ? 'bg-purple-50 border-purple-300 text-slate-900 shadow-2xs ring-2 ring-purple-500/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <h4 className="text-xs font-bold text-slate-900">{item.label}</h4>
                  <p className="text-[11px] text-slate-600 mt-1">{item.desc}</p>
                </button>
              ))}
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
                  onClick={startCompression}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md transition-all"
                >
                  <Zap className="w-4 h-4" /> Compress PDF Files Now
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

          {isCompleted && <DownloadBar files={files} onReset={handleReset} zipFilename="compressed_pdfs.zip" />}
        </div>
      )}
    </div>
  );
}
