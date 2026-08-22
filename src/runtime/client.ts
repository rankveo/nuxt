import { BlogClient } from '@rankveo/client';

export interface RankveoRuntimeConfig {
  apiKey?: string;
  baseUrl?: string;
}

/**
 * Builds a client from Nuxt's *private* runtime config.
 *
 * Must only be called on the server. Anything under `runtimeConfig.public` is
 * serialised into the page payload, so the key belongs at the top level, never
 * in `public`.
 */
export function createBlogClient(config: RankveoRuntimeConfig): BlogClient {
  return new BlogClient({ apiKey: config.apiKey, baseUrl: config.baseUrl || undefined });
}
