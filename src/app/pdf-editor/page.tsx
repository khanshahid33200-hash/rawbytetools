import ToolPageLayout from '@/components/common/ToolPageLayout';
import PdfEditorUI from '@/components/pdf/PdfEditorUI';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit PDF Pages - Reorder, Delete, Rotate & Extract Pages',
  description: 'Interactive PDF page editor. Reorder page thumbnails, rotate orientation, delete pages, and export.',
  keywords: ['edit pdf pages', 'reorder pdf pages', 'delete page from pdf', 'rotate pdf pages']
};

export default function PdfEditorPage() {
  return (
    <ToolPageLayout slug="pdf-editor">
      <PdfEditorUI />
    </ToolPageLayout>
  );
}
