import ToolPageLayout from '@/components/common/ToolPageLayout';
import PdfToImagesUI from '@/components/pdf/PdfToImagesUI';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convert PDF to Image (PNG / JPG) Online',
  description: 'Extract every page of a PDF document into high-res PNG or JPG images. Download single pages or ZIP archive.',
  keywords: ['pdf to image', 'pdf to jpg', 'pdf to png', 'extract pages as photos']
};

export default function PdfToImagesPage() {
  return (
    <ToolPageLayout slug="pdf-to-images">
      <PdfToImagesUI />
    </ToolPageLayout>
  );
}
