import { parsePageRange } from '@/lib/utils/formatters';

export interface PdfToImageResult {
  pageIndex: number; // 1-indexed
  blob: Blob;
  url: string;
  width: number;
  height: number;
}

export async function convertPdfToImages(
  file: File,
  format: 'png' | 'jpeg' = 'png',
  quality: number = 0.9,
  dpiScale: number = 1.5,
  pageRangeStr?: string
): Promise<PdfToImageResult[]> {
  const pdfjsLib = await import('pdfjs-dist');
  
  // Set worker source dynamically
  if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;

  const totalPages = pdfDoc.numPages;
  const targetPages = parsePageRange(pageRangeStr || '', totalPages);

  const results: PdfToImageResult[] = [];
  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';

  for (const pageNum of targetPages) {
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale: dpiScale });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) continue;

    if (format === 'jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };

    await page.render(renderContext as any).promise;

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Canvas toBlob failed'))), mimeType, quality);
    });

    const url = URL.createObjectURL(blob);
    results.push({
      pageIndex: pageNum,
      blob,
      url,
      width: canvas.width,
      height: canvas.height
    });
  }

  return results;
}
