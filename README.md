# @rankveo/nuxt

Run your [rankveo](https://rankveo.com) blog on a Nuxt site.

```bash
npm install @rankveo/nuxt
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@rankveo/nuxt/module'],
  runtimeConfig: {
    rankveo: { apiKey: process.env.RANKVEO_BLOG_API_KEY },
    public: { siteUrl: 'https://yoursite.com' },
  },
});
```

The module puts the key at the **top level** of `runtimeConfig`, never under
`public` — anything in `public` is serialised into the page payload and readable
by any visitor. It also applies `swr` route rules to the blog paths, which
becomes ISR on presets that support it and cache headers where they do not.

## Starter

```bash
cp -r node_modules/@rankveo/nuxt/starter/* .
```

Server routes under `server/api` and `server/routes` do the fetching; pages call
those, so the key never has to be reachable from anything the client bundle
sees. You get a listing, article pages with metadata and JSON-LD, a sitemap with
`<image:image>` entries, and an RSS feed.

Blog pages are copy-in files rather than injected routes. The first thing anyone
does is restyle them, and a file in your own repo is far easier to change than
framework output.

## Keeping it fresh

`server/api/rankveo-revalidate.post.ts` receives the notification when an article
changes. What it should do depends on your preset: trigger on-demand ISR where
the platform supports it, purge your CDN otherwise. A fully prerendered Nuxt site
has nothing to invalidate — use a deploy hook instead.

MIT.
