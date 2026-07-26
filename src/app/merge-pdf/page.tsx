import ToolPageLayout from '@/components/common/ToolPageLayout';
import MergePdfUI from '@/components/pdf/MergePdfUI';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Merge PDF Online - Combine Multiple PDF Files',
  description: 'Combine multiple PDF documents into a single file with custom reordering. Fast and 100% private.',
  keywords: ['merge pdf', 'combine pdf files', 'join pdf documents', 'pdf joiner']
};

export default function MergePdfPage() {
  return (
    <ToolPageLayout slug="merge-pdf">
      <MergePdfUI />
    </ToolPageLayout>
  );
}
