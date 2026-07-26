import { MetadataRoute } from 'next';
import { ALL_TOOLS, SITE_URL } from '@/lib/utils/constants';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/about', '/contact', '/privacy', '/terms'];

  const toolRoutes = ALL_TOOLS.map((t) => `/${t.slug}`);

  const allPaths = [...routes, ...toolRoutes];

  return allPaths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: path === '' ? 1.0 : 0.8
  }));
}
