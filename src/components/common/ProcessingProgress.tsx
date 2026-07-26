'use client';

import { Loader2, XCircle } from 'lucide-react';

interface ProcessingProgressProps {
  currentFileIndex: number;
  totalFiles: number;
  currentFileName?: string;
  progressPercent: number;
  onCancel?: () => void;
}

export default function ProcessingProgress({
  currentFileIndex,
  totalFiles,
  currentFileName,
  progressPercent,
  onCancel
}: ProcessingProgressProps) {
  return (
    <div className="w-full p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-cyan-600 animate-spin" />
          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              Processing File {currentFileIndex + 1} of {totalFiles}
            </h4>
            {currentFileName && <p className="text-xs text-slate-500 truncate max-w-xs md:max-w-md">{currentFileName}</p>}
          </div>
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" /> Cancel
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden relative">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 transition-all duration-300 rounded-full"
          style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
        />
      </div>
    </div>
  );
}
