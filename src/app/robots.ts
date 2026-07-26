import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/utils/constants';

export default function robots(): MetadataRoute.Robots {
  const adminSlug = process.env.NEXT_PUBLIC_ADMIN_SECRET_SLUG || 'admin-secret-portal-9872';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [`/${adminSlug}`, '/api/']
    },
    sitemap: `${SITE_URL}/sitemap.xml`
  };
}
