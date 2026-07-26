import ToolPageLayout from '@/components/common/ToolPageLayout';
import ImagesToPdfUI from '@/components/pdf/ImagesToPdfUI';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert Images to PDF - Combine Photos to PDF Online',
  description: 'Combine multiple JPG, PNG, WEBP pictures into one PDF. Custom page orientation, paper size (A4, Letter), and margins.',
  keywords: ['images to pdf', 'jpg to pdf', 'combine pictures into pdf', 'photo to pdf converter']
};

export default function ImagesToPdfPage() {
  return (
    <ToolPageLayout slug="images-to-pdf">
      <ImagesToPdfUI />
    </ToolPageLayout>
  );
}
