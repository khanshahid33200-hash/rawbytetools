import { PDFDocument, degrees } from 'pdf-lib';
import { parsePageRange } from '@/lib/utils/formatters';

/**
 * Merge multiple PDF files into one output Blob
 */
export async function mergePdfFiles(files: File[]): Promise<{ blob: Blob; url: string; pageCount: number }> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const fileBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(fileBytes);
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const pdfBytes = await mergedPdf.save();
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  return { blob, url, pageCount: mergedPdf.getPageCount() };
}

/**
 * Reorder, rotate, or delete specific pages of a PDF document
 */
export interface PageModification {
  pageIndex: number; // 0-based original index
  rotation?: number; // 0, 90, 180, 270
}

export async function processPdfPages(
  file: File,
  pageOrder: PageModification[]
): Promise<{ blob: Blob; url: string; pageCount: number }> {
  const fileBytes = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(fileBytes);
  const newDoc = await PDFDocument.create();

  for (const mod of pageOrder) {
    if (mod.pageIndex >= 0 && mod.pageIndex < srcDoc.getPageCount()) {
      const [copiedPage] = await newDoc.copyPages(srcDoc, [mod.pageIndex]);
      if (mod.rotation) {
        const currentRot = copiedPage.getRotation().angle;
        copiedPage.setRotation(degrees((currentRot + mod.rotation) % 360));
      }
      newDoc.addPage(copiedPage);
    }
  }

  const pdfBytes = await newDoc.save();
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  return { blob, url, pageCount: newDoc.getPageCount() };
}

/**
 * Split PDF based on mode ('all' | 'custom' | 'odd' | 'even')
 */
export async function splitPdf(
  file: File,
  mode: 'all' | 'custom' | 'odd' | 'even',
  rangeStr?: string
): Promise<{ filename: string; blob: Blob }[]> {
  const fileBytes = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(fileBytes);
  const totalPages = srcDoc.getPageCount();
  const results: { filename: string; blob: Blob }[] = [];

  const baseName = file.name.replace(/\.[^/.]+$/, '');

  if (mode === 'all') {
    for (let i = 0; i < totalPages; i++) {
      const newDoc = await PDFDocument.create();
      const [copiedPage] = await newDoc.copyPages(srcDoc, [i]);
      newDoc.addPage(copiedPage);
      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      results.push({
        filename: `${baseName}_page_${i + 1}.pdf`,
        blob
      });
    }
  } else if (mode === 'odd' || mode === 'even') {
    const newDoc = await PDFDocument.create();
    const pageIndices: number[] = [];
    for (let i = 0; i < totalPages; i++) {
      const pageNum = i + 1;
      if (mode === 'odd' && pageNum % 2 !== 0) pageIndices.push(i);
      if (mode === 'even' && pageNum % 2 === 0) pageIndices.push(i);
    }
    if (pageIndices.length > 0) {
      const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
      copiedPages.forEach((p) => newDoc.addPage(p));
      const pdfBytes = await newDoc.save();
      results.push({
        filename: `${baseName}_${mode}_pages.pdf`,
        blob: new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' })
      });
    }
  } else if (mode === 'custom' && rangeStr) {
    const targetPages = parsePageRange(rangeStr, totalPages);
    if (targetPages.length > 0) {
      const newDoc = await PDFDocument.create();
      const pageIndices = targetPages.map((p) => p - 1);
      const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
      copiedPages.forEach((p) => newDoc.addPage(p));
      const pdfBytes = await newDoc.save();
      results.push({
        filename: `${baseName}_split_range.pdf`,
        blob: new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' })
      });
    }
  }

  return results;
}
