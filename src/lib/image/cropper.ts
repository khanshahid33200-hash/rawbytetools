export interface CropParams {
  file: File;
  cropArea: { x: number; y: number; width: number; height: number };
  shape?: 'square' | 'circle' | 'custom';
  rotation?: number;
  format?: string;
}

export async function cropImage(params: CropParams): Promise<{ blob: Blob; url: string; size: number }> {
  const { file, cropArea, shape = 'custom', rotation = 0, format } = params;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const inputUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(inputUrl);

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(cropArea.width));
      canvas.height = Math.max(1, Math.round(cropArea.height));

      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context failed'));

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Shape mask if circle
      if (shape === 'circle') {
        const radius = Math.min(canvas.width, canvas.height) / 2;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
        ctx.clip();
      }

      // Draw crop area onto target canvas
      ctx.drawImage(
        img,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const mimeType = format || (shape === 'circle' ? 'image/png' : file.type || 'image/png');
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Crop output blob creation failed'));
          const url = URL.createObjectURL(blob);
          resolve({ blob, url, size: blob.size });
        },
        mimeType,
        0.95
      );
    };

    img.onerror = () => reject(new Error('Failed to load image for cropping'));
    img.src = inputUrl;
  });
}

export async function rotateAndFlipImage(
  file: File,
  angleDegrees: number,
  flipH: boolean,
  flipV: boolean
): Promise<{ blob: Blob; url: string; size: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const inputUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(inputUrl);

      const rad = (angleDegrees * Math.PI) / 180;
      const sin = Math.abs(Math.sin(rad));
      const cos = Math.abs(Math.cos(rad));

      const newWidth = Math.round(img.width * cos + img.height * sin);
      const newHeight = Math.round(img.width * sin + img.height * cos);

      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context unavailable'));

      ctx.save();
      ctx.translate(newWidth / 2, newHeight / 2);
      ctx.rotate(rad);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Rotate/Flip blob generation failed'));
          const url = URL.createObjectURL(blob);
          resolve({ blob, url, size: blob.size });
        },
        file.type || 'image/png',
        0.95
      );
    };

    img.onerror = () => reject(new Error('Failed to load image for rotate/flip'));
    img.src = inputUrl;
  });
}
