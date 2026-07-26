import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ProcessedFileItem } from '@/types/file';

export async function downloadFilesAsZip(
  files: ProcessedFileItem[],
  zipFilename: string = 'raubyte_tools_processed.zip'
): Promise<void> {
  const zip = new JSZip();

  files.forEach((item, index) => {
    if (item.resultBlob) {
      const fileName = item.resultName || item.name || `file_${index + 1}`;
      zip.file(fileName, item.resultBlob);
    }
  });

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, zipFilename);
}

export function downloadSingleFile(blob: Blob, fileName: string): void {
  saveAs(blob, fileName);
}
