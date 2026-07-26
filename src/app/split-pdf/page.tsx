import ToolPageLayout from '@/components/common/ToolPageLayout';
import SplitPdfUI from '@/components/pdf/SplitPdfUI';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Split PDF Online - Extract Pages & Cut PDF',
  description: 'Split PDF files online into individual pages or specific page ranges (e.g. 1-3, 5-8). Download as ZIP.',
  keywords: ['split pdf', 'extract pdf pages', 'separate pdf pages', 'cut pdf']
};

export default function SplitPdfPage() {
  return (
    <ToolPageLayout slug="split-pdf">
      <SplitPdfUI />
    </ToolPageLayout>
  );
}
