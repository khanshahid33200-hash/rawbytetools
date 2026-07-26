export interface ResizeParams {
  file: File;
  targetWidth: number;
  targetHeight: number;
  format?: string;
  quality?: number;
}

export async function resizeImage(params: ResizeParams): Promise<{ blob: Blob; url: string; size: number }> {
  const { file, targetWidth, targetHeight, format, quality = 0.92 } = params;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const inputUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(inputUrl);

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(targetWidth));
      canvas.height = Math.max(1, Math.round(targetHeight));

      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context failed'));

      // High-quality downsampling smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const mimeType = format || file.type || 'image/png';
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Blob generation failed'));
          const url = URL.createObjectURL(blob);
          resolve({ blob, url, size: blob.size });
        },
        mimeType,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(inputUrl);
      reject(new Error('Could not load image for resizing'));
    };

    img.src = inputUrl;
  });
}
