import { sitemapXml } from '@rankveo/nuxt';
import { blogClient } from '../../utils/rankveo';

// Our own document: it carries per-URL lastmod and the <image:image> entries
// Google indexes, which the generic sitemap modules do not emit.
export default defineEventHandler(async (event) => {
  const { articles } = await blogClient().getSitemap();
  const config = useRuntimeConfig();

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8');
  return sitemapXml(articles, {
    siteUrl: (config.public as { siteUrl?: string }).siteUrl ?? 'https://example.com',
    basePath: (config.public as { rankveo?: { basePath?: string } }).rankveo?.basePath ?? '/blog',
  });
});
