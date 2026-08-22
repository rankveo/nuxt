import { createBlogClient } from '@rankveo/nuxt';

// Server-only: everything under server/ is stripped from the client bundle, and
// the key comes from the private half of runtimeConfig — never `public`, which
// is serialised into the page payload and readable by any visitor.
export function blogClient() {
  const config = useRuntimeConfig();
  return createBlogClient(config.rankveo as { apiKey?: string; baseUrl?: string });
}
