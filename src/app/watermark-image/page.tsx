import ToolPageLayout from '@/components/common/ToolPageLayout';
import ImageWatermarkUI from '@/components/image/ImageWatermarkUI';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Watermark Tool - Add Text & Logo Image Watermarks',
  description: 'Protect photos with text or logo image watermarks. Custom position, transparency, font, and scale.',
  keywords: ['watermark image', 'add text watermark', 'watermark photo online', 'logo stamp']
};

export default function WatermarkPage() {
  return (
    <ToolPageLayout slug="watermark-image">
      <ImageWatermarkUI />
    </ToolPageLayout>
  );
}
