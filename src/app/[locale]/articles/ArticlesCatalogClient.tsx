"use client";
import { Suspense, useState } from 'react';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ArticleCard } from '@/components/article/ArticleCard';
import type { Article } from '@/lib/articles';

type ArticleCategory = {
  id: string;
  slug: string;
  name_th: string;
  name_cn: string;
};

interface Props {
  articles: Article[];
  categories: ArticleCategory[];
}

function ArticlesCatalogContent({ articles, categories }: Props) {
  const searchParams = useSearchParams();
  const defaultCategory = searchParams.get('category') || '';

  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const locale = useLocale();

  const categoryName = (slug: string) => {
    const cat = categories.find((c) => c.slug === slug);
    if (!cat) return '';
    return locale === 'cn' ? cat.name_cn : cat.name_th;
  };

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = activeCategory ? article.category_slug === activeCategory : true;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      q === '' ||
      article.title_th.toLowerCase().includes(q) ||
      article.title_cn.toLowerCase().includes(q) ||
      article.excerpt_th.toLowerCase().includes(q) ||
      article.excerpt_cn.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Hero */}
      <section className="bg-brand-navy text-white py-14 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            {locale === 'cn' ? '文章与知识库' : 'บทความและความรู้'}
          </h1>
          <p className="text-slate-300">
            {locale === 'cn'
              ? '五金知识与产品使用指南，帮助您更好地选购与使用产品'
              : 'รวมความรู้เรื่องฮาร์ดแวร์และวิธีใช้งานสินค้า เพื่อให้คุณเลือกซื้อและใช้งานได้อย่างถูกต้อง'}
          </p>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4 pt-8">
        {/* Search */}
        <div className="relative w-full max-w-md mx-auto mb-8">
          <Input
            type="text"
            placeholder={locale === 'cn' ? '搜索文章...' : 'ค้นหาบทความ...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border-slate-200 rounded-full focus-visible:ring-brand-red"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10">
          <button
            onClick={() => setActiveCategory('')}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors border ${
              activeCategory === ''
                ? 'bg-brand-red text-white border-brand-red shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {locale === 'cn' ? '全部' : 'ทั้งหมด'}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors border ${
                activeCategory === cat.slug
                  ? 'bg-brand-red text-white border-brand-red shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {locale === 'cn' ? cat.name_cn : cat.name_th}
            </button>
          ))}
        </div>

        {/* Article grid */}
        {filteredArticles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-100 shadow-sm">
            <div className="h-16 w-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8" />
            </div>
            <p className="text-slate-500 text-lg">
              {locale === 'cn' ? '没有找到相关文章' : 'ไม่พบบทความที่คุณค้นหา'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.slug}
                slug={article.slug}
                title_th={article.title_th}
                title_cn={article.title_cn}
                excerpt_th={article.excerpt_th}
                excerpt_cn={article.excerpt_cn}
                cover_image={article.cover_image}
                published_date={article.published_date}
                category_name={categoryName(article.category_slug)}
                locale={locale}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ArticlesCatalogClient({ articles, categories }: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ArticlesCatalogContent articles={articles} categories={categories} />
    </Suspense>
  );
}
