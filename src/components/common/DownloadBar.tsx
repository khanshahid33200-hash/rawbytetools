'use client';

import { useState } from 'react';
import { Download, Archive, RefreshCw, CheckCircle2, FileCheck } from 'lucide-react';
import { ProcessedFileItem } from '@/types/file';
import { downloadFilesAsZip, downloadSingleFile } from '@/lib/utils/zip';
import { formatBytes, calculateSavings } from '@/lib/utils/formatters';

interface DownloadBarProps {
  files: ProcessedFileItem[];
  onReset: () => void;
  zipFilename?: string;
}

export default function DownloadBar({ files, onReset, zipFilename = 'rawbyte_processed_files.zip' }: DownloadBarProps) {
  const [isZipping, setIsZipping] = useState(false);

  const completedFiles = files.filter((f) => f.status === 'success' && f.resultBlob);
  const totalOriginalSize = completedFiles.reduce((acc, curr) => acc + curr.originalSize, 0);
  const totalResultSize = completedFiles.reduce((acc, curr) => acc + (curr.resultSize || 0), 0);
  const totalSavings = calculateSavings(totalOriginalSize, totalResultSize);

  if (completedFiles.length === 0) return null;

  const handleDownloadAllZip = async () => {
    setIsZipping(true);
    try {
      await downloadFilesAsZip(completedFiles, zipFilename);
    } catch (e) {
      console.error('ZIP packaging error:', e);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="w-full p-4 md:p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status & Savings */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              Processing Complete ({completedFiles.length} file{completedFiles.length > 1 ? 's' : ''})
              {totalSavings.percent > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                  {totalSavings.text} Saved
                </span>
              )}
            </h4>
            <p className="text-xs text-slate-500">
              Original: {formatBytes(totalOriginalSize)} → Output: {formatBytes(totalResultSize)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {completedFiles.length === 1 ? (
            <button
              onClick={() => downloadSingleFile(completedFiles[0].resultBlob!, completedFiles[0].resultName || completedFiles[0].name)}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md transition-all"
            >
              <Download className="w-4 h-4" /> Download File
            </button>
          ) : (
            <>
              <button
                onClick={handleDownloadAllZip}
                disabled={isZipping}
                className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md transition-all disabled:opacity-50"
              >
                {isZipping ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Archive className="w-4 h-4" />}
                Download All (ZIP)
              </button>
            </>
          )}

          <button
            onClick={onReset}
            className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
            title="Start New Batch"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* File List Summary */}
      <div className="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {completedFiles.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs"
          >
            <div className="flex items-center gap-3 truncate pr-2">
              <FileCheck className="w-4 h-4 text-cyan-600 shrink-0" />
              <span className="truncate text-slate-800 font-medium">{file.name}</span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-slate-500 text-[11px]">
                {formatBytes(file.originalSize)} → <strong className="text-emerald-700">{formatBytes(file.resultSize || 0)}</strong>
              </span>
              <button
                onClick={() => downloadSingleFile(file.resultBlob!, file.resultName || file.name)}
                className="p-1.5 rounded-xl bg-slate-200 hover:bg-cyan-100 hover:text-cyan-700 text-slate-700 transition-colors"
                title="Download single file"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
