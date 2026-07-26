import { PDFDocument } from 'pdf-lib';

export interface CompressPdfParams {
  file: File;
  level?: 'low' | 'medium' | 'high' | 'custom';
  targetSize?: number; // numeric target size
  targetUnit?: 'KB' | 'MB'; // 'KB' or 'MB'
  onProgress?: (progress: number) => void;
}

export async function compressPdfFile(
  params: CompressPdfParams | File,
  legacyLevel: 'low' | 'medium' | 'high' = 'medium'
): Promise<{ blob: Blob; url: string; size: number; originalSize: number }> {
  let file: File;
  let level: 'low' | 'medium' | 'high' | 'custom' = legacyLevel;
  let targetSize: number | undefined;
  let targetUnit: 'KB' | 'MB' = 'KB';

  if (params instanceof File) {
    file = params;
  } else {
    file = params.file;
    level = params.level || 'medium';
    targetSize = params.targetSize;
    targetUnit = params.targetUnit || 'KB';
  }

  const originalSize = file.size;
  let targetBytes: number | undefined;
  if (targetSize && targetSize > 0) {
    targetBytes = targetUnit === 'KB' ? targetSize * 1024 : targetSize * 1024 * 1024;
  }

  const fileBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });

  // If target size is specified and smaller than file size, re-encode pages if needed
  if (targetBytes && originalSize > targetBytes) {
    try {
      const pdfjsLib = await import('pdfjs-dist');
      if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      }

      const loadingTask = pdfjsLib.getDocument({ data: fileBytes.slice(0) });
      const pdfjsDoc = await loadingTask.promise;
      const totalPages = pdfjsDoc.numPages;

      // Estimate scale & quality based on target ratio
      const ratio = targetBytes / originalSize;
      const quality = Math.max(0.3, Math.min(0.85, ratio * 0.9));
      const scale = Math.max(0.7, Math.min(1.5, Math.sqrt(ratio) * 1.2));

      const newPdfDoc = await PDFDocument.create();

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdfjsDoc.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;

          const jpegBlob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Canvas toBlob failed'))), 'image/jpeg', quality);
          });

          const jpegBytes = await jpegBlob.arrayBuffer();
          const embeddedImage = await newPdfDoc.embedJpg(jpegBytes);

          const newPage = newPdfDoc.addPage([viewport.width, viewport.height]);
          newPage.drawImage(embeddedImage, {
            x: 0,
            y: 0,
            width: viewport.width,
            height: viewport.height
          });
        }
      }

      const compressedBytes = await newPdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        updateFieldAppearances: false
      });

      const blob = new Blob([compressedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      return { blob, url, size: blob.size, originalSize };
    } catch (err) {
      console.warn('PDF stream re-encoding fallback to pdf-lib stream optimization:', err);
    }
  }

  // Standard stream optimization
  const pdfBytes = await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
    updateFieldAppearances: false
  });

  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  return {
    blob,
    url,
    size: blob.size,
    originalSize
  };
}
