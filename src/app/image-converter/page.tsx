import ToolPageLayout from '@/components/common/ToolPageLayout';
import ImageConverterUI from '@/components/image/ImageConverterUI';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Converter - Batch Convert JPG, PNG, WEBP & AVIF',
  description: 'Convert images between JPG, PNG, WEBP, and AVIF formats seamlessly with custom quality control.',
  keywords: ['image converter', 'jpg to png', 'png to webp', 'convert webp to jpg']
};

export default function ImageConverterPage() {
  return (
    <ToolPageLayout slug="image-converter">
      <ImageConverterUI />
    </ToolPageLayout>
  );
}
