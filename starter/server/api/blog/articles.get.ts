import { blogClient } from '../../utils/rankveo';

// Pages fetch through this rather than calling rankveo directly, so the key
// never has to exist anywhere the client bundle can reach.
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  return blogClient().getArticles({
    page: Math.max(0, Number(query.page ?? 0)),
    limit: Math.min(50, Math.max(1, Number(query.limit ?? 9))),
    tag: typeof query.tag === 'string' ? query.tag : undefined,
  });
});
