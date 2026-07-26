import { PDFDocument, PageSizes } from 'pdf-lib';
import { ImagesToPdfOptions } from '@/types/file';

export async function convertImagesToPdf(
  imageFiles: File[],
  options: ImagesToPdfOptions
): Promise<{ blob: Blob; url: string; pageCount: number }> {
  const pdfDoc = await PDFDocument.create();

  for (const file of imageFiles) {
    const arrayBuffer = await file.arrayBuffer();
    const imageType = file.type;

    let embeddedImage;
    if (imageType === 'image/jpeg' || imageType === 'image/jpg') {
      embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
    } else if (imageType === 'image/png') {
      embeddedImage = await pdfDoc.embedPng(arrayBuffer);
    } else {
      // Convert WEBP or other formats to PNG via Canvas first
      const pngBlob = await convertToPngBlob(file);
      const pngBuffer = await pngBlob.arrayBuffer();
      embeddedImage = await pdfDoc.embedPng(pngBuffer);
    }

    const { width: imgWidth, height: imgHeight } = embeddedImage;

    let pageWidth = imgWidth;
    let pageHeight = imgHeight;

    if (options.pageSize === 'a4') {
      pageWidth = options.orientation === 'portrait' ? PageSizes.A4[0] : PageSizes.A4[1];
      pageHeight = options.orientation === 'portrait' ? PageSizes.A4[1] : PageSizes.A4[0];
    } else if (options.pageSize === 'letter') {
      pageWidth = options.orientation === 'portrait' ? PageSizes.Letter[0] : PageSizes.Letter[1];
      pageHeight = options.orientation === 'portrait' ? PageSizes.Letter[1] : PageSizes.Letter[0];
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    // Margins
    let margin = 0;
    if (options.margin === 'small') margin = 15;
    else if (options.margin === 'medium') margin = 30;
    else if (options.margin === 'large') margin = 50;

    const availableWidth = pageWidth - margin * 2;
    const availableHeight = pageHeight - margin * 2;

    const scale = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);
    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;

    const drawX = margin + (availableWidth - drawWidth) / 2;
    const drawY = margin + (availableHeight - drawHeight) / 2;

    page.drawImage(embeddedImage, {
      x: drawX,
      y: drawY,
      width: drawWidth,
      height: drawHeight
    });
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  return { blob, url, pageCount: pdfDoc.getPageCount() };
}

function convertToPngBlob(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context error'));
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((b) => {
        if (!b) return reject(new Error('Png conversion blob error'));
        resolve(b);
      }, 'image/png');
    };
    img.onerror = () => reject(new Error('Image load failed for PDF insertion'));
    img.src = url;
  });
}
