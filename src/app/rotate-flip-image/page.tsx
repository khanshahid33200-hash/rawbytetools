import ToolPageLayout from '@/components/common/ToolPageLayout';
import ImageRotateFlipUI from '@/components/image/ImageRotateFlipUI';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rotate & Flip Image Online - 90, 180, 270 & Custom Angles',
  description: 'Rotate images clockwise, counter-clockwise, or custom angles. Flip horizontally or vertically.',
  keywords: ['rotate image', 'flip photo', 'mirror image online', 'turn photo']
};

export default function RotateFlipPage() {
  return (
    <ToolPageLayout slug="rotate-flip-image">
      <ImageRotateFlipUI />
    </ToolPageLayout>
  );
}
