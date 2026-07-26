import { WatermarkOptions, TextEditorOptions } from '@/types/file';

export async function applyWatermark(
  file: File,
  options: WatermarkOptions
): Promise<{ blob: Blob; url: string; size: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const inputUrl = URL.createObjectURL(file);

    img.onload = async () => {
      URL.revokeObjectURL(inputUrl);

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context failed'));

      ctx.drawImage(img, 0, 0);

      ctx.save();
      ctx.globalAlpha = options.opacity;

      if (options.type === 'text' && options.text) {
        const fontSize = options.fontSize || Math.round(canvas.width * 0.05);
        const fontFamily = options.fontFamily || 'sans-serif';
        const color = options.fontColor || '#ffffff';

        ctx.font = `bold ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = color;
        ctx.textBaseline = 'middle';

        const metrics = ctx.measureText(options.text);
        const textWidth = metrics.width;
        const textHeight = fontSize;

        let posX = canvas.width / 2 - textWidth / 2;
        let posY = canvas.height / 2;

        if (options.position === 'top-left') {
          posX = 20;
          posY = 20 + textHeight / 2;
        } else if (options.position === 'top-right') {
          posX = canvas.width - textWidth - 20;
          posY = 20 + textHeight / 2;
        } else if (options.position === 'bottom-left') {
          posX = 20;
          posY = canvas.height - textHeight;
        } else if (options.position === 'bottom-right') {
          posX = canvas.width - textWidth - 20;
          posY = canvas.height - textHeight;
        }

        ctx.translate(posX + textWidth / 2, posY);
        if (options.rotation) {
          ctx.rotate((options.rotation * Math.PI) / 180);
        }
        ctx.fillText(options.text, -textWidth / 2, 0);
      } else if (options.type === 'image' && options.watermarkImage) {
        try {
          const wmImg = await loadHtmlImage(options.watermarkImage);
          const scale = options.scale || 0.2;
          const wmWidth = canvas.width * scale;
          const wmHeight = (wmImg.height / wmImg.width) * wmWidth;

          let posX = canvas.width / 2 - wmWidth / 2;
          let posY = canvas.height / 2 - wmHeight / 2;

          if (options.position === 'top-left') {
            posX = 20;
            posY = 20;
          } else if (options.position === 'top-right') {
            posX = canvas.width - wmWidth - 20;
            posY = 20;
          } else if (options.position === 'bottom-left') {
            posX = 20;
            posY = canvas.height - wmHeight - 20;
          } else if (options.position === 'bottom-right') {
            posX = canvas.width - wmWidth - 20;
            posY = canvas.height - wmHeight - 20;
          }

          ctx.translate(posX + wmWidth / 2, posY + wmHeight / 2);
          if (options.rotation) {
            ctx.rotate((options.rotation * Math.PI) / 180);
          }
          ctx.drawImage(wmImg, -wmWidth / 2, -wmHeight / 2, wmWidth, wmHeight);
        } catch (e) {
          console.error('Failed to load watermark logo image:', e);
        }
      }

      ctx.restore();

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Watermark generation failed'));
          const url = URL.createObjectURL(blob);
          resolve({ blob, url, size: blob.size });
        },
        file.type || 'image/png',
        0.95
      );
    };

    img.onerror = () => reject(new Error('Failed to load base image for watermarking'));
    img.src = inputUrl;
  });
}

export async function addStyledTextToImage(
  file: File,
  options: TextEditorOptions
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

      ctx.drawImage(img, 0, 0);

      if (options.text) {
        ctx.save();
        const fontSize = options.fontSize || Math.round(canvas.width * 0.06);
        const fontFamily = options.fontFamily || 'Inter, sans-serif';

        ctx.font = `bold ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = options.color || '#ffffff';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';

        if (options.shadowColor && options.shadowBlur) {
          ctx.shadowColor = options.shadowColor;
          ctx.shadowBlur = options.shadowBlur;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
        }

        const posX = (options.posX / 100) * canvas.width;
        const posY = (options.posY / 100) * canvas.height;

        ctx.translate(posX, posY);
        if (options.rotation) {
          ctx.rotate((options.rotation * Math.PI) / 180);
        }

        if (options.strokeColor && options.strokeWidth) {
          ctx.strokeStyle = options.strokeColor;
          ctx.lineWidth = options.strokeWidth;
          ctx.strokeText(options.text, 0, 0);
        }

        ctx.fillText(options.text, 0, 0);
        ctx.restore();
      }

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Text overlay creation failed'));
          const url = URL.createObjectURL(blob);
          resolve({ blob, url, size: blob.size });
        },
        file.type || 'image/png',
        0.95
      );
    };

    img.onerror = () => reject(new Error('Failed to load image for text editing'));
    img.src = inputUrl;
  });
}

function loadHtmlImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not load image'));
    };
    img.src = url;
  });
}
