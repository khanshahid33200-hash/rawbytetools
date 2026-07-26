export type TargetFormat = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/avif';

export async function convertImageFormat(
  file: File,
  targetFormat: TargetFormat,
  quality: number = 0.9
): Promise<{ blob: Blob; url: string; size: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const inputUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(inputUrl);

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context failed'));

      // If converting to JPEG, fill white background for transparent PNGs
      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Format conversion failed'));
          const url = URL.createObjectURL(blob);
          resolve({ blob, url, size: blob.size });
        },
        targetFormat,
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image for format conversion'));
    img.src = inputUrl;
  });
}
