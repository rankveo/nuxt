import { blogClient } from '../../utils/rankveo';

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Missing slug' });

  const article = await blogClient().findArticle(slug);
  if (!article) throw createError({ statusCode: 404, statusMessage: 'Article not found' });
  return article;
});
