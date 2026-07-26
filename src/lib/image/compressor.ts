import imageCompression from 'browser-image-compression';

export interface CompressParams {
  file: File;
  targetUnit?: 'KB' | 'MB';
  targetSize?: number; // target size in KB or MB
  quality?: number; // 0 to 1
  format?: 'original' | 'jpeg' | 'png' | 'webp';
  onProgress?: (progress: number) => void;
}

export async function compressImage(params: CompressParams): Promise<{ blob: Blob; url: string; size: number }> {
  const { file, targetUnit, targetSize, quality = 0.8, format = 'original', onProgress } = params;

  let targetSizeMB: number | undefined = undefined;
  if (targetSize && targetSize > 0) {
    if (targetUnit === 'KB') {
      targetSizeMB = targetSize / 1024;
    } else if (targetUnit === 'MB') {
      targetSizeMB = targetSize;
    }
  }

  // Determine output format
  let fileType = file.type;
  if (format === 'jpeg') fileType = 'image/jpeg';
  else if (format === 'png') fileType = 'image/png';
  else if (format === 'webp') fileType = 'image/webp';

  const options: any = {
    maxSizeMB: targetSizeMB || (file.size / (1024 * 1024)) * quality,
    useWebWorker: true,
    initialQuality: quality,
    fileType: fileType,
    onProgress: (p: number) => {
      if (onProgress) onProgress(p);
    }
  };

  try {
    const compressedFile = await imageCompression(file, options);
    const url = URL.createObjectURL(compressedFile);
    return {
      blob: compressedFile,
      url,
      size: compressedFile.size
    };
  } catch (error) {
    console.warn('browser-image-compression fallback to Canvas compression:', error);
    // Canvas fallback
    return await compressImageCanvas(file, quality, fileType);
  }
}

function compressImageCanvas(file: File, quality: number, fileType: string): Promise<{ blob: Blob; url: string; size: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context unavailable'));
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Compression blob failed'));
          const blobUrl = URL.createObjectURL(blob);
          resolve({ blob, url: blobUrl, size: blob.size });
        },
        fileType || file.type || 'image/jpeg',
        quality
      );
    };
    img.onerror = () => reject(new Error('Failed to load image for canvas compression'));
    img.src = url;
  });
}
