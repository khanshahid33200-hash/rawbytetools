import ToolPageLayout from '@/components/common/ToolPageLayout';
import PdfCompressorUI from '@/components/pdf/PdfCompressorUI';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF Compressor - Reduce PDF File Size Online (KB/MB)',
  description: 'Compress PDF documents to target KB or MB sizes. Fast, 100% private, browser-side PDF compression.',
  keywords: ['compress pdf', 'reduce pdf size', 'compress pdf to 200kb', 'pdf size reducer']
};

export default function PdfCompressorPage() {
  return (
    <ToolPageLayout slug="pdf-compressor">
      <PdfCompressorUI />
    </ToolPageLayout>
  );
}
