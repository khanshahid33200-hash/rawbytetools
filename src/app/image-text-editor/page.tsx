import ToolPageLayout from '@/components/common/ToolPageLayout';
import ImageTextEditorUI from '@/components/image/ImageTextEditorUI';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Text Editor - Add Styled Typography & Captions',
  description: 'Add text captions to images. Choose font, color, text stroke, drop shadow, position, and rotation.',
  keywords: ['add text to image', 'photo text editor', 'caption photo online', 'styled text overlay']
};

export default function ImageTextEditorPage() {
  return (
    <ToolPageLayout slug="image-text-editor">
      <ImageTextEditorUI />
    </ToolPageLayout>
  );
}
