import ToolPageLayout from '@/components/common/ToolPageLayout';
import ImageCropperUI from '@/components/image/ImageCropperUI';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crop Tool - Free Aspect Ratio & Circle Cropper',
  description: 'Crop images with 16:9, 4:3, 1:1, Circle mask, or free selection presets directly in your browser.',
  keywords: ['crop image', 'crop photo online', 'circular crop', '16:9 crop tool']
};

export default function CropToolPage() {
  return (
    <ToolPageLayout slug="crop-tool">
      <ImageCropperUI />
    </ToolPageLayout>
  );
}
