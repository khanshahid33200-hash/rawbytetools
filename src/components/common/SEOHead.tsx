import { ToolItem, FAQItem } from '@/types/tools';
import { SITE_NAME, SITE_URL } from '@/lib/utils/constants';

interface SEOHeadProps {
  tool?: ToolItem;
  faqs?: FAQItem[];
}

export default function SEOHead({ tool, faqs }: SEOHeadProps) {
  const pageUrl = tool ? `${SITE_URL}/${tool.slug}` : SITE_URL;

  // SoftwareApplication Schema
  const softwareSchema = tool
    ? {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: tool.title,
        description: tool.metaDescription,
        operatingSystem: 'All (Web Browser)',
        applicationCategory: tool.category === 'image' ? 'MultimediaApplication' : 'UtilitiesApplication',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD'
        },
        url: pageUrl
      }
    : null;

  // FAQ Schema
  const faqSchema =
    faqs && faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer
            }
          }))
        }
      : null;

  // Breadcrumbs Schema
  const breadcrumbSchema = tool
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: tool.title,
            item: pageUrl
          }
        ]
      }
    : null;

  return (
    <>
      {softwareSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
    </>
  );
}
