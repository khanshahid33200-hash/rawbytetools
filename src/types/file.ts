export type ProcessStatus = 'idle' | 'processing' | 'success' | 'error';

export interface ProcessedFileItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  type: string;
  previewUrl: string;
  status: ProcessStatus;
  progress: number;
  error?: string;
  
  // Output results
  resultBlob?: Blob;
  resultUrl?: string;
  resultSize?: number;
  resultName?: string;
  
  // Custom Metadata (dimensions, pages, options)
  dimensions?: { width: number; height: number };
  pageCount?: number;
  customOptions?: Record<string, any>;
}

export interface CompressionOptions {
  targetUnit: 'KB' | 'MB';
  targetSize?: number;
  quality: number; // 0.1 to 1.0
  format?: 'original' | 'jpeg' | 'png' | 'webp';
}

export interface ResizeOptions {
  mode: 'pixels' | 'percentage';
  width: number;
  height: number;
  percentage: number;
  maintainAspectRatio: boolean;
  format?: string;
}

export interface CropOptions {
  aspectRatio?: number; // e.g. 1, 16/9, 4/3 or undefined for free
  cropShape: 'square' | 'circle' | 'custom';
  rotation: number; // 0, 90, 180, 270 or custom
}

export interface WatermarkOptions {
  type: 'text' | 'image';
  text?: string;
  watermarkImage?: File | null;
  watermarkPreviewUrl?: string;
  fontFamily?: string;
  fontSize?: number;
  fontColor?: string;
  opacity: number; // 0.1 to 1.0
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  scale: number;
  rotation: number;
}

export interface TextEditorOptions {
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  strokeColor?: string;
  strokeWidth?: number;
  shadowColor?: string;
  shadowBlur?: number;
  posX: number; // percentage 0 - 100
  posY: number; // percentage 0 - 100
  rotation: number;
}

export interface PdfCompressOptions {
  targetUnit: 'KB' | 'MB';
  targetSize?: number;
  level: 'low' | 'medium' | 'high' | 'custom';
}

export interface ImagesToPdfOptions {
  orientation: 'portrait' | 'landscape';
  pageSize: 'a4' | 'letter' | 'fit';
  margin: 'none' | 'small' | 'medium' | 'large';
  compress: boolean;
}

export interface PdfToImagesOptions {
  format: 'png' | 'jpeg';
  quality: number;
  dpi: number;
  pageRange?: string; // e.g. "1-5, 8"
}

export interface SplitPdfOptions {
  mode: 'all' | 'custom' | 'odd' | 'even';
  pageRange?: string;
}
