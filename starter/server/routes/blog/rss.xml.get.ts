import { rssXml } from '@rankveo/nuxt';
import { blogClient } from '../../utils/rankveo';

export default defineEventHandler(async (event) => {
  const { articles } = await blogClient().getAllArticles();
  const config = useRuntimeConfig();

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8');
  return rssXml(articles, {
    siteUrl: (config.public as { siteUrl?: string }).siteUrl ?? 'https://example.com',
    basePath: (config.public as { rankveo?: { basePath?: string } }).rankveo?.basePath ?? '/blog',
    title: 'Blog',
  });
});
