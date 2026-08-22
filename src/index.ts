// Server-side surface. Nuxt server routes and Nitro handlers import from here.
export {
  ArticleNotFoundError,
  BlogClient,
  RankveoBlogError,
  absoluteArticleUrl,
  articleJsonLd,
  articleUrl,
  escapeXml,
  formatPublishedDate,
  pageCount,
  rssXml,
  sitemapXml,
  verifyRevalidateSecret,
} from '@rankveo/client';

export type {
  BlogArticle,
  BlogArticleList,
  BlogArticleSummary,
  BlogClientOptions,
  BlogImage,
  BlogRelatedArticle,
  BlogSite,
  BlogSitemap,
  BlogSitemapEntry,
  BlogTag,
  BlogTagCount,
  BlogTagList,
  ListArticlesOptions,
  UrlOptions,
} from '@rankveo/client';

export { createBlogClient, type RankveoRuntimeConfig } from './runtime/client.js';
