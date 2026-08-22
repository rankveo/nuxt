<script setup lang="ts">
import { formatPublishedDate, pageCount } from '@rankveo/nuxt';

const route = useRoute();
const config = useRuntimeConfig();
const basePath = (config.public.rankveo as { basePath: string }).basePath;
const PAGE_SIZE = 9;

// Fetched through our own server route, so the key never has to be reachable
// from anything the client bundle can see.
const page = computed(() => Math.max(1, Number(route.query.page ?? 1)));
const { data } = await useFetch('/api/blog/articles', {
  query: computed(() => ({ page: page.value - 1, limit: PAGE_SIZE })),
});

const lastPage = computed(() => pageCount(data.value?.total ?? 0, PAGE_SIZE));
useHead({ title: 'Blog' });
</script>

<template>
  <main class="blog-index">
    <header>
      <h1>Blog</h1>
      <p>{{ data?.total ?? 0 }} {{ data?.total === 1 ? 'article' : 'articles' }}</p>
    </header>

    <p v-if="!data?.articles.length">
      Nothing published yet. Approve and publish an article in rankveo and it appears here.
    </p>

    <div v-else class="blog-grid">
      <article v-for="article in data.articles" :key="article.id" class="blog-card">
        <NuxtLink v-if="article.image" :to="`${basePath}/${article.slug}`">
          <img
            :src="article.image.url"
            :alt="article.image.alt"
            :width="article.image.width ?? undefined"
            :height="article.image.height ?? undefined"
            loading="lazy"
          />
        </NuxtLink>
        <div>
          <span v-if="article.category" class="blog-card-category">{{ article.category.name }}</span>
          <h2><NuxtLink :to="`${basePath}/${article.slug}`">{{ article.title }}</NuxtLink></h2>
          <p>{{ article.metaDescription }}</p>
          <div class="blog-meta">
            <time v-if="formatPublishedDate(article)" :datetime="article.publishedAt ?? undefined">
              {{ formatPublishedDate(article) }}
            </time>
            <span>{{ article.readingTime }} min read</span>
          </div>
        </div>
      </article>
    </div>

    <nav v-if="lastPage > 1" class="blog-pagination" aria-label="Pagination">
      <NuxtLink v-if="page > 1" :to="{ query: { page: page - 1 } }" rel="prev">← Newer</NuxtLink>
      <span v-else />
      <span>Page {{ page }} of {{ lastPage }}</span>
      <NuxtLink v-if="page < lastPage" :to="{ query: { page: page + 1 } }" rel="next">Older →</NuxtLink>
      <span v-else />
    </nav>
  </main>
</template>
