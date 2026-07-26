'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { UploadCloud, File, Image as ImageIcon, FileText, Clipboard, AlertCircle, X } from 'lucide-react';
import { formatBytes } from '@/lib/utils/formatters';

interface FileUploaderProps {
  acceptTypes?: string[]; // e.g. ['image/*', 'application/pdf']
  acceptExtensions?: string[]; // e.g. ['.jpg', '.png', '.pdf']
  multiple?: boolean;
  maxFiles?: number;
  maxSizeBytes?: number; // default 100MB
  onFilesSelected: (files: File[]) => void;
  title?: string;
  subtitle?: string;
}

export default function FileUploader({
  acceptTypes = ['image/*', 'application/pdf'],
  acceptExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'],
  multiple = true,
  maxFiles = 100,
  maxSizeBytes = 100 * 1024 * 1024, // 100MB
  onFilesSelected,
  title = 'Drag & Drop files here, or click to browse',
  subtitle = 'Supports images (JPG, PNG, WEBP) & PDF documents. Up to 100 files, max 100MB each.'
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(
    (incomingFiles: FileList | File[]) => {
      setErrorMessage(null);
      const validFiles: File[] = [];

      const fileArray = Array.from(incomingFiles);

      if (fileArray.length > maxFiles) {
        setErrorMessage(`Maximum ${maxFiles} files allowed per batch.`);
        return;
      }

      for (const file of fileArray) {
        if (file.size > maxSizeBytes) {
          setErrorMessage(`File "${file.name}" exceeds maximum allowed size of ${formatBytes(maxSizeBytes)}.`);
          continue;
        }
        validFiles.push(file);
      }

      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    },
    [maxFiles, maxSizeBytes, onFilesSelected]
  );

  // Paste from clipboard listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        processFiles(e.clipboardData.files);
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [processFiles]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="w-full space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer border-2 border-dashed rounded-3xl p-8 md:p-12 text-center transition-all duration-300 ${
          isDragging
            ? 'border-cyan-500 bg-cyan-50 shadow-lg scale-[1.01]'
            : 'border-slate-300 bg-white hover:bg-slate-50/80 hover:border-cyan-500'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptExtensions.join(',')}
          onChange={(e) => e.target.files && processFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Animated Icon Container */}
          <div className="w-16 h-16 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center group-hover:scale-110 group-hover:border-cyan-400 transition-all duration-300">
            <UploadCloud className="w-8 h-8 text-cyan-600 group-hover:animate-bounce" />
          </div>

          <div className="space-y-1 max-w-md">
            <h3 className="text-base md:text-lg font-semibold text-slate-900 group-hover:text-cyan-600 transition-colors">
              {title}
            </h3>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>

          {/* Supported format pill tags */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-cyan-50 text-cyan-700 border border-cyan-200">
              <ImageIcon className="w-3.5 h-3.5" /> JPG / PNG / WEBP
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
              <FileText className="w-3.5 h-3.5" /> PDF Documents
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-300">
              <Clipboard className="w-3.5 h-3.5" /> Ctrl+V Clipboard
            </span>
          </div>
        </div>
      </div>

      {/* Error alert if any */}
      {errorMessage && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="p-1 hover:text-rose-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
