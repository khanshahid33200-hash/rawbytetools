export type ToolCategory = 'image' | 'pdf';

export interface ToolItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: ToolCategory;
  iconName: string;
  popular?: boolean;
  recentlyAdded?: boolean;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  features: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}
