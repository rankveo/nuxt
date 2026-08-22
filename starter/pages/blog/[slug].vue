<script setup lang="ts">
import { absoluteArticleUrl, articleJsonLd, formatPublishedDate } from '@rankveo/nuxt';

const route = useRoute();
const config = useRuntimeConfig();
const basePath = (config.public.rankveo as { basePath: string }).basePath;
const siteUrl = (config.public.siteUrl as string) ?? 'https://example.com';

const { data: article } = await useFetch(`/api/blog/${route.params.slug}`);
if (!article.value) throw createError({ statusCode: 404, statusMessage: 'Article not found' });

const urlOptions = { siteUrl, basePath };
const url = absoluteArticleUrl(article.value.slug, urlOptions);
const published = formatPublishedDate(article.value);

useHead({
  title: article.value.title,
  link: [{ rel: 'canonical', href: url }],
  meta: [
    { name: 'description', content: article.value.metaDescription },
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: article.value.title },
    { property: 'og:url', content: url },
    ...article.value.images.map((image) => ({ property: 'og:image', content: image.url })),
    { property: 'article:modified_time', content: article.value.updatedAt },
  ],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(articleJsonLd(article.value, urlOptions)) },
  ],
});
</script>

<template>
  <main v-if="article" class="blog-article">
    <nav><NuxtLink :to="basePath">← All articles</NuxtLink></nav>

    <header>
      <h1>{{ article.title }}</h1>
      <div class="blog-meta">
        <time v-if="published" :datetime="article.publishedAt ?? undefined">{{ published }}</time>
        <span>{{ article.readingTime }} min read</span>
      </div>
    </header>

    <!--
      Only a genuinely featured image becomes the hero. With no featured image
      `image` falls back to the first body image, which the article HTML below
      already renders — showing it here too would print it twice.
    -->
    <img
      v-if="article.image?.role === 'featured'"
      class="blog-hero"
      :src="article.image.url"
      :alt="article.image.alt"
      :width="article.image.width ?? undefined"
      :height="article.image.height ?? undefined"
    />

    <div class="article-body" v-html="article.html" />

    <footer v-if="article.tags.length" class="blog-tags">
      <NuxtLink v-for="tag in article.tags" :key="tag.slug" :to="`${basePath}?tag=${tag.slug}`">
        {{ tag.name }}
      </NuxtLink>
    </footer>
  </main>
</template>
