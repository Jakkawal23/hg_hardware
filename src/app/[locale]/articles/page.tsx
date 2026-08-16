import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getAllArticles } from '@/lib/articles';
import categoriesData from '@/data/article-categories.json';
import { ArticlesCatalogClient } from './ArticlesCatalogClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'cn' ? '文章 | HG Hardware' : 'บทความ | HG Hardware';
  const description =
    locale === 'cn'
      ? '五金知识与产品使用指南，帮助您更好地选择和使用五金工具与建材。'
      : 'บทความให้ความรู้เรื่องฮาร์ดแวร์และวิธีใช้งานสินค้า ช่วยให้คุณเลือกซื้อและใช้งานสินค้าได้อย่างถูกต้อง';
  return { title, description };
}

export default async function ArticlesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articles = getAllArticles();

  return <ArticlesCatalogClient articles={articles} categories={categoriesData} />;
}
