import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ArrowLeft, CalendarDays, User } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAllArticles, getArticleBySlug, getRelatedArticles } from '@/lib/articles';
import { ArticleCard } from '@/components/article/ArticleCard';
import categoriesData from '@/data/article-categories.json';

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const article = getArticleBySlug(resolvedParams.slug);

  if (!article) {
    return {};
  }

  const localizedTitle = resolvedParams.locale === 'cn' ? article.title_cn : article.title_th;
  const description = resolvedParams.locale === 'cn' ? article.excerpt_cn : article.excerpt_th;
  const title = `${localizedTitle} | HG Hardware`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [article.cover_image],
      type: 'article',
    },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const resolvedParams = await params;
  setRequestLocale(resolvedParams.locale);
  const { locale } = resolvedParams;

  const article = getArticleBySlug(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(article);
  const category = categoriesData.find((c) => c.slug === article.category_slug);
  const categoryName = category ? (locale === 'cn' ? category.name_cn : category.name_th) : '';
  const localizedTitle = locale === 'cn' ? article.title_cn : article.title_th;
  const author = locale === 'cn' ? article.author_cn : article.author_th;
  const bodyHtml = locale === 'cn' ? article.body_html.cn : article.body_html.th;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: localizedTitle,
    image: [article.cover_image],
    datePublished: article.published_date,
    author: {
      '@type': 'Organization',
      name: author || 'HG Hardware',
    },
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link href="/articles" className="inline-flex items-center text-slate-500 hover:text-brand-red font-bold mb-6 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> {locale === 'cn' ? '返回文章列表' : 'กลับไปหน้ารวมบทความ'}
      </Link>

      <article>
        <div className="rounded-2xl overflow-hidden mb-6 border border-slate-200 shadow-sm">
          <img src={article.cover_image} alt={localizedTitle} className="w-full h-64 md:h-96 object-cover" />
        </div>

        {categoryName && (
          <Badge className="mb-4 bg-slate-100 text-brand-navy hover:bg-slate-200 uppercase tracking-wider text-[10px] font-bold border border-slate-200">
            {categoryName}
          </Badge>
        )}

        <h1 className="text-2xl md:text-4xl font-extrabold text-brand-navy mb-4 leading-tight">
          {localizedTitle}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-8 pb-6 border-b border-slate-200">
          {author && (
            <span className="inline-flex items-center gap-1.5">
              <User className="h-4 w-4" /> {author}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" /> {article.published_date}
          </span>
        </div>

        <div
          className="prose prose-slate max-w-none prose-headings:text-brand-navy prose-a:text-brand-red"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      </article>

      {/* CTA */}
      <div className="mt-12 bg-brand-navy text-white rounded-2xl p-8 text-center space-y-4">
        <h2 className="text-xl md:text-2xl font-extrabold">
          {locale === 'cn' ? '想选购相关产品？' : 'นำความรู้นี้ไปเลือกซื้อสินค้าจริง'}
        </h2>
        <p className="text-slate-300 text-sm md:text-base">
          {locale === 'cn' ? '浏览我们的产品目录，寻找适合您工程的五金产品。' : 'เลือกชมสินค้าที่เหมาะกับงานของคุณได้ในแคตตาล็อกของเรา'}
        </p>
        <Link href="/products">
          <Button className="bg-brand-red hover:bg-red-700 text-white font-bold px-8 h-11 rounded-full">
            {locale === 'cn' ? '查看产品目录' : 'ดูแคตตาล็อกสินค้า'}
          </Button>
        </Link>
      </div>

      {/* Related articles */}
      {relatedArticles.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-extrabold text-brand-navy mb-6">
            {locale === 'cn' ? '相关文章' : 'บทความที่เกี่ยวข้อง'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedArticles.map((related) => (
              <ArticleCard
                key={related.slug}
                slug={related.slug}
                title_th={related.title_th}
                title_cn={related.title_cn}
                excerpt_th={related.excerpt_th}
                excerpt_cn={related.excerpt_cn}
                cover_image={related.cover_image}
                published_date={related.published_date}
                category_name={categoryName}
                locale={locale}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
