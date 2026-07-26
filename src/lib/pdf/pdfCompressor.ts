import { PDFDocument } from 'pdf-lib';

export async function compressPdfFile(
  file: File,
  level: 'low' | 'medium' | 'high' | 'custom' = 'medium'
): Promise<{ blob: Blob; url: string; size: number; originalSize: number }> {
  const fileBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(fileBytes, { ignoreEncryption: true });

  // Stream optimization and removal of unreferenced objects / metadata streams
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
    originalSize: file.size
  };
}
