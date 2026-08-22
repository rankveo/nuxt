import assert from 'node:assert/strict';
import test from 'node:test';
import { RankveoBlogError as CoreError } from '@rankveo/client';
import * as pkg from './index.js';

// This package is mostly a re-export layer, so what can break is the seam: a
// core dependency that failed to resolve, or an export dropped during a
// refactor. Both are silent until someone imports the package.

void test('re-exports the core surface', () => {
  for (const name of [
    'BlogClient',
    'RankveoBlogError',
    'ArticleNotFoundError',
    'articleJsonLd',
    'sitemapXml',
    'rssXml',
    'verifyRevalidateSecret',
    'pageCount',
    'articleUrl',
    'formatPublishedDate',
  ]) {
    assert.ok(name in pkg, `missing export: ${name}`);
  }
});

void test('exports its own nuxt helpers', () => {
  for (const name of ['createBlogClient']) {
    assert.ok(name in pkg, `missing export: ${name}`);
  }
});

void test('errors keep their identity across the package boundary', () => {
  // If this ever fails, two copies of the core are installed and every
  // `instanceof RankveoBlogError` in consumer code silently stops matching.
  assert.equal(pkg.RankveoBlogError, CoreError);
});

void test('the client refuses to run in a browser', () => {
  (globalThis as { window?: unknown }).window = {};
  try {
    assert.throws(() => new pkg.BlogClient('rk_key'), /must not run in the browser/);
  } finally {
    delete (globalThis as { window?: unknown }).window;
  }
});
