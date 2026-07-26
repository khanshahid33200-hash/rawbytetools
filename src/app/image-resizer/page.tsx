import ToolPageLayout from '@/components/common/ToolPageLayout';
import ImageResizerUI from '@/components/image/ImageResizerUI';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Resizer - Change Dimensions (Pixels / %) Online',
  description: 'Resize JPG, PNG, WEBP dimensions by pixels (W x H) or percentage scale. Instant browser-side resizing.',
  keywords: ['image resizer', 'resize photo online', 'change image width height', 'scale photo']
};

export default function ImageResizerPage() {
  return (
    <ToolPageLayout slug="image-resizer">
      <ImageResizerUI />
    </ToolPageLayout>
  );
}
