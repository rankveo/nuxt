/**
 * Nuxt module.
 *
 * Typed structurally rather than against `@nuxt/kit`, so the package carries no
 * build-time dependency on Nuxt internals and keeps working across majors.
 *
 * Nuxt invokes a module as `(inlineOptions, nuxt)`, so that is exactly what the
 * default export is — not a factory returning a module definition, which Nuxt
 * would call once and silently discard.
 */

import { existsSync } from 'node:fs';
import { join } from 'node:path';

export interface RankveoModuleOptions {
  /** Defaults to `RANKVEO_BLOG_API_KEY`. */
  apiKey?: string;
  /** Defaults to `https://api.rankveo.com/api`. */
  baseUrl?: string;
  /** Where the blog lives. Defaults to `/blog`. */
  basePath?: string;
  /**
   * Seconds to cache blog routes for. Defaults to 3600, `false` to skip.
   * Applied through `routeRules`, so the behaviour follows the deployment
   * preset: ISR where the platform supports it, cache headers elsewhere.
   */
  swr?: number | false;
}

interface NuxtLike {
  options: {
    runtimeConfig: Record<string, unknown> & { public?: Record<string, unknown> };
    routeRules?: Record<string, unknown>;
    css?: string[];
    srcDir?: string;
  };
}

const DEFAULT_BASE_PATH = '/blog';
const DEFAULT_SWR = 3_600;

/**
 * Wires runtime config and route rules.
 *
 * Deliberately does not inject routes. Blog pages are copy-in files rather than
 * hidden framework output, because the first thing anyone does is restyle them,
 * and an injected route is far harder to change than one in your own repo.
 */
export function rankveoModule(inlineOptions: RankveoModuleOptions = {}, nuxt?: NuxtLike): void {
  // Nuxt always passes `nuxt`; the guard keeps the function callable in tests.
  if (!nuxt) return;

  const basePath = inlineOptions.basePath ?? DEFAULT_BASE_PATH;
  const existing = (nuxt.options.runtimeConfig.rankveo ?? {}) as RankveoModuleOptions;

  // Top level, never `public`: anything under runtimeConfig.public is serialised
  // into the page payload and readable by any visitor. A key there is a leaked
  // key. Values already in nuxt.config win, so an app can override.
  nuxt.options.runtimeConfig.rankveo = {
    apiKey: existing.apiKey || inlineOptions.apiKey || process.env.RANKVEO_BLOG_API_KEY || '',
    baseUrl: existing.baseUrl || inlineOptions.baseUrl || process.env.RANKVEO_API_URL || '',
  };

  // The public half carries only what a component legitimately needs.
  nuxt.options.runtimeConfig.public = {
    ...nuxt.options.runtimeConfig.public,
    rankveo: { basePath },
  };

  registerBlogStylesheet(nuxt);

  if (inlineOptions.swr !== false) {
    const rules = (nuxt.options.routeRules ??= {});
    const swr = inlineOptions.swr ?? DEFAULT_SWR;
    // `swr` becomes ISR on presets that support it and cache headers where they
    // do not — the closest Nuxt has to revalidate-on-demand without this module
    // taking over the deployment.
    rules[basePath] = { ...(rules[basePath] as object), swr };
    rules[`${basePath}/**`] = { ...(rules[`${basePath}/**`] as object), swr };
  }
}

/**
 * Registers the starter's stylesheet globally, if the project has one.
 *
 * Importing `assets/blog.css` from a page's `<script setup>` looks like it
 * should work, but Vite folds it into a shared chunk that is not part of the
 * route's CSS manifest, so a prerendered page ships with no stylesheet link at
 * all — the blog renders unstyled and nothing warns you. `nuxt.options.css` is
 * the path Nuxt guarantees ends up in the document head.
 *
 * Kept conditional: a project that never copied the starter, or one that styles
 * the blog itself, gets nothing added.
 */
function registerBlogStylesheet(nuxt: NuxtLike): void {
  const entry = '~/assets/blog.css';
  const srcDir = nuxt.options.srcDir;
  if (!srcDir) return;
  if (!existsSync(join(srcDir, 'assets', 'blog.css'))) return;
  const css = (nuxt.options.css ??= []);
  if (!css.includes(entry)) css.push(entry);
}

// Nuxt reads this to name the module and to find its config key.
rankveoModule.meta = { name: '@rankveo/nuxt', configKey: 'rankveo' };

export default rankveoModule;
