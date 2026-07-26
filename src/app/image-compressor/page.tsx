import ToolPageLayout from '@/components/common/ToolPageLayout';
import ImageCompressorUI from '@/components/image/ImageCompressorUI';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Compressor - Reduce Image Size to Exact KB/MB Online',
  description: 'Compress JPG, PNG, and WEBP images online to target KB/MB sizes. 100% private client-side processing.',
  keywords: ['image compressor', 'compress image to 50kb', 'reduce image size', 'png compressor', 'webp compressor']
};

export default function ImageCompressorPage() {
  return (
    <ToolPageLayout slug="image-compressor">
      <ImageCompressorUI />
    </ToolPageLayout>
  );
}
