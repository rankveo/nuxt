import { verifyRevalidateSecret } from '@rankveo/nuxt';

// Nitro's cache is keyed per route rule. What this does depends on your preset:
// on a platform with on-demand ISR, trigger a revalidation; elsewhere, purge
// your CDN. A fully prerendered Nuxt site should use a deploy hook instead.
export default defineEventHandler(async (event) => {
  const secret = process.env.RANKVEO_REVALIDATE_SECRET;
  if (!verifyRevalidateSecret(getHeader(event, 'authorization'), secret)) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const payload = await readBody<{ event: string; slug?: string }>(event);
  return { revalidated: true, event: payload.event, slug: payload.slug ?? null };
});
