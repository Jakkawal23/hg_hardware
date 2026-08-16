import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

// Define the type for an article, matching the src/data/articles/<slug>/meta.json shape
export interface ArticleMeta {
  id: string;
  slug: string;
  category_slug: string;
  title_th: string;
  title_cn: string;
  excerpt_th: string;
  excerpt_cn: string;
  cover_image: string;
  published_date: string;
  author_th?: string;
  author_cn?: string;
}

export interface Article extends ArticleMeta {
  body_html: {
    th: string;
    cn: string;
  };
}

const articlesDirectory = path.join(process.cwd(), 'src/data/articles');

/**
 * Reads a single article folder (meta.json + th.md + cn.md) and converts
 * the markdown bodies to HTML at build time.
 */
function readArticleFolder(folderName: string): Article | null {
  const folderPath = path.join(articlesDirectory, folderName);
  const metaPath = path.join(folderPath, 'meta.json');

  if (!fs.existsSync(metaPath)) {
    return null;
  }

  try {
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8')) as ArticleMeta;

    const thPath = path.join(folderPath, 'th.md');
    const cnPath = path.join(folderPath, 'cn.md');

    const thMarkdown = fs.existsSync(thPath) ? fs.readFileSync(thPath, 'utf8') : '';
    const cnMarkdown = fs.existsSync(cnPath) ? fs.readFileSync(cnPath, 'utf8') : '';

    return {
      ...meta,
      body_html: {
        th: marked.parse(thMarkdown, { async: false }) as string,
        cn: marked.parse(cnMarkdown, { async: false }) as string,
      },
    };
  } catch (error) {
    console.error(`Error reading article folder ${folderName}:`, error);
    return null;
  }
}

/**
 * Reads all article folders under src/data/articles and returns them
 * sorted by published_date, newest first.
 */
export function getAllArticles(): Article[] {
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  const folders = fs.readdirSync(articlesDirectory).filter((entry) =>
    fs.statSync(path.join(articlesDirectory, entry)).isDirectory()
  );

  const articles = folders
    .map((folder) => readArticleFolder(folder))
    .filter((article): article is Article => article !== null);

  return articles.sort((a, b) => (a.published_date < b.published_date ? 1 : -1));
}

/**
 * Gets a single article by slug.
 */
export function getArticleBySlug(slug: string): Article | undefined {
  return getAllArticles().find((article) => article.slug === slug);
}

/**
 * Gets all articles belonging to a given category slug.
 */
export function getArticlesByCategory(categorySlug: string): Article[] {
  return getAllArticles().filter((article) => article.category_slug === categorySlug);
}

/**
 * Gets other articles in the same category as the given article, for a
 * "related articles" section.
 */
export function getRelatedArticles(article: Article, limit = 3): Article[] {
  return getAllArticles()
    .filter((a) => a.slug !== article.slug && a.category_slug === article.category_slug)
    .slice(0, limit);
}
