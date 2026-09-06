import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Truck, ShieldCheck, Factory, Building2, PackageCheck, HeadphonesIcon, Search } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/ProductCard';
import { ArticleCard } from '@/components/article/ArticleCard';
import { getAllProducts } from '@/lib/products';
import { getAllArticles } from '@/lib/articles';
import categoriesData from '@/data/categories.json';
import warehouseData from '@/data/warehouse.json';
import articleCategoriesData from '@/data/article-categories.json';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('Hero');
  const cat = await getTranslations('Categories');

  const productsData = getAllProducts();
  const featuredProducts = productsData.flatMap(g => g.products).slice(0, 4);
  const latestArticles = getAllArticles().slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-brand-navy text-white overflow-hidden py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1587293852726-70cdb56c28ea?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay" />
        <div className="relative container mx-auto max-w-5xl text-center space-y-6 md:space-y-8 z-10">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-md leading-tight">
            {locale === 'cn' ? '泰国直营五金建材批发仓库' : 'คลังสินค้าน็อต ฮาร์ดแวร์ก่อสร้าง นำเข้าโดยตรง'}
          </h1>
          <p className="text-lg md:text-2xl text-slate-300 font-medium mb-8 max-w-2xl mx-auto drop-shadow-md">
            {locale === 'cn' ? '厂家直销价格 • 泰国现货 • 中泰双语团队支持' : 'ราคาส่งจากโรงงาน • มีสต็อกในไทย • ทีมงานซัพพอร์ตไทย-จีน'}
          </p>
          
          {/* Homepage Search Bar */}
          <div className="w-full max-w-2xl mx-auto mb-8 px-2 md:px-0">
            <form action={`/${locale}/products`} method="GET" className="relative flex items-center shadow-2xl rounded-full">
              <div className="absolute left-4 text-slate-400">
                <Search className="h-5 w-5" />
              </div>
              <input 
                type="text" 
                name="search" 
                placeholder={locale === 'cn' ? '搜索 螺栓、螺母、五金...' : 'ค้นหา น็อต, สกรู, ฮาร์ดแวร์...'} 
                className="w-full bg-white text-slate-900 rounded-full py-3.5 md:py-4 pl-12 pr-[100px] md:pr-32 focus:outline-none focus:ring-4 focus:ring-brand-red/30 transition-shadow text-base md:text-lg border-2 border-transparent focus:border-brand-red"
              />
              <button type="submit" className="absolute right-1.5 md:right-2 top-1.5 md:top-2 bottom-1.5 md:bottom-2 bg-brand-red hover:bg-red-700 text-white font-bold px-5 md:px-6 rounded-full transition-colors text-sm md:text-base">
                {locale === 'cn' ? '搜索' : 'ค้นหา'}
              </button>
            </form>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 md:pt-6">
            <Link href="/products">
              <Button size="lg" className="bg-brand-red hover:bg-red-700 text-white font-bold text-base md:text-lg px-8 shadow-xl h-12 md:h-14 rounded-full w-full sm:w-auto cursor-pointer">
                {locale === 'cn' ? '查看产品目录' : 'ดูแคตตาล็อกสินค้า'}
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="bg-transparent border-2 border-white/50 text-white hover:bg-white/10 hover:border-white font-bold text-base md:text-lg px-8 shadow-xl h-12 md:h-14 rounded-full w-full sm:w-auto transition-all backdrop-blur-sm cursor-pointer">
              {locale === 'cn' ? '联系销售团队' : 'ติดต่อฝ่ายขาย'}
            </Button>
          </div>
        </div>
        {/* Accent Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-brand-red"></div>
      </section>

      {/* Key Achievement Stats (Company Profile) */}
      <section className="bg-brand-surface py-12 px-4 border-b border-slate-200">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center divide-x divide-slate-200">
            <div className="space-y-1 md:space-y-2">
              <div className="text-3xl md:text-4xl font-extrabold text-brand-red">10+</div>
              <div className="text-xs md:text-sm font-semibold text-brand-navy uppercase tracking-wider">{locale === 'cn' ? '中国制造经验' : 'ปี ประสบการณ์ในจีน'}</div>
            </div>
            <div className="space-y-1 md:space-y-2">
              <div className="text-3xl md:text-4xl font-extrabold text-brand-red">5+</div>
              <div className="text-xs md:text-sm font-semibold text-brand-navy uppercase tracking-wider">{locale === 'cn' ? '泰国直销经验' : 'ปี ประสบการณ์ในไทย'}</div>
            </div>
            <div className="space-y-1 md:space-y-2">
              <div className="text-3xl md:text-4xl font-extrabold text-brand-red">500+</div>
              <div className="text-xs md:text-sm font-semibold text-brand-navy uppercase tracking-wider">{locale === 'cn' ? '服务项目' : 'โครงการที่ไว้วางใจ'}</div>
            </div>
            <div className="space-y-1 md:space-y-2">
              <div className="text-3xl md:text-4xl font-extrabold text-brand-red">77</div>
              <div className="text-xs md:text-sm font-semibold text-brand-navy uppercase tracking-wider">{locale === 'cn' ? '覆盖泰国全境' : 'จังหวัด ครอบคลุมทั่วไทย'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white py-12 px-4 border-b border-slate-200">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center p-6 space-y-4 rounded-xl border border-slate-100 hover:shadow-md transition-shadow bg-brand-surface">
            <div className="p-4 bg-white text-brand-red rounded-full shadow-sm">
              <Factory className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-lg text-brand-navy">{locale === 'cn' ? '源头工厂批发价' : 'ราคาส่งตรงจากโรงงาน'}</h3>
            <p className="text-slate-500 text-sm">{locale === 'cn' ? '直接与中国合作工厂对接，价格全网最低。可开具增值税发票。' : 'รับประกันราคาดีที่สุด ส่งตรงจากโรงงานพันธมิตรในจีน สามารถออกใบกำกับภาษีได้'}</p>
          </div>
          <div className="flex flex-col items-center p-6 space-y-4 rounded-xl border border-slate-100 hover:shadow-md transition-shadow bg-brand-surface">
            <div className="p-4 bg-white text-brand-red rounded-full shadow-sm">
              <Truck className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-lg text-brand-navy">{locale === 'cn' ? '泰国本地快速发货' : 'จัดส่งรวดเร็วในไทย'}</h3>
            <p className="text-slate-500 text-sm">{locale === 'cn' ? '泰国春武里府大型仓库现货，24-48小时内发往泰国全境。' : 'มีคลังสินค้าขนาดใหญ่ที่ชลบุรี พร้อมจัดส่งทั่วประเทศภายใน 24-48 ชั่วโมง'}</p>
          </div>
          <div className="flex flex-col items-center p-6 space-y-4 rounded-xl border border-slate-100 hover:shadow-md transition-shadow bg-brand-surface">
            <div className="p-4 bg-white text-brand-red rounded-full shadow-sm">
              <HeadphonesIcon className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-lg text-brand-navy">{locale === 'cn' ? '中泰双语客服支持' : 'ทีมซัพพอร์ตไทย-จีน'}</h3>
            <p className="text-slate-500 text-sm">{locale === 'cn' ? '精通中泰双语的销售与工程团队，随时通过微信和Line为您服务。' : 'ทีมขายและวิศวกรผู้เชี่ยวชาญพร้อมให้คำปรึกษาสองภาษา ผ่าน Line และ WeChat'}</p>
          </div>
        </div>
      </section>

      {/* Category Quick Jump */}
      <section className="py-16 px-4 bg-brand-surface">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-extrabold text-brand-navy mb-10 text-center">{cat('title')}</h2>
          
          {/* Horizontal Scroll (2-rows) on Mobile, Grid on Desktop */}
          <div className="grid grid-rows-2 grid-flow-col auto-cols-[110px] md:grid-rows-none md:grid-flow-row md:grid-cols-5 gap-3 md:gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
            {categoriesData.map((category) => {
              const catName = locale === 'cn' ? category.name_cn : (category.name_th_short || category.name_th);
              return (
                <Link 
                  href={`/products?category=${category.slug}`} 
                  key={category.id} 
                  className="group flex flex-col items-center p-4 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 transition-all hover:border-brand-red active:scale-95 snap-center w-full"
                >
                  <div className="h-12 w-12 bg-slate-50 rounded-full mb-3 flex items-center justify-center text-brand-navy group-hover:bg-brand-red group-hover:text-white transition-colors">
                    <span className="font-bold text-lg">{catName.charAt(0)}</span>
                  </div>
                  <span className="font-bold text-brand-navy text-center text-[11px] leading-tight break-words line-clamp-2">{catName}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Warehouse & Logistics Showcase */}
      <section className="py-16 px-4 bg-white border-t border-slate-200">
        <div className="container mx-auto max-w-6xl text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold text-brand-navy">{locale === 'cn' ? '仓储与物流实力' : 'คลังสินค้าและการจัดส่ง'}</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">{locale === 'cn' ? '查看我们在泰国的现货库存，为大型建筑项目提供稳定的物资保障。' : 'ชมคลังสินค้าจริงของเราในไทย มั่นใจได้ในสต็อกที่พร้อมซัพพอร์ตโปรเจกต์ก่อสร้างขนาดใหญ่'}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {warehouseData.map((item) => (
              <div key={item.id} className="relative group overflow-hidden rounded-2xl shadow-md border border-slate-200">
                <img src={item.image} alt={locale === 'cn' ? item.title_cn : item.title_th} className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 to-transparent flex items-end p-6">
                  <h3 className="text-2xl font-bold text-white">
                    {locale === 'cn' ? item.title_cn : item.title_th}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      {latestArticles.length > 0 && (
        <section className="py-16 px-4 bg-white border-t border-slate-200">
          <div className="container mx-auto max-w-6xl">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-extrabold text-brand-navy">{locale === 'cn' ? '最新文章' : 'บทความล่าสุด'}</h2>
                <p className="text-slate-500 mt-2">{locale === 'cn' ? '五金知识与产品使用指南' : 'ความรู้เรื่องฮาร์ดแวร์และวิธีใช้งานสินค้า'}</p>
              </div>
              <Link href="/articles" className="text-brand-red font-bold hover:text-red-700 hidden sm:block">
                {locale === 'cn' ? '查看全部文章 &rarr;' : 'ดูบทความทั้งหมด &rarr;'}
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {latestArticles.map((article) => {
                const category = articleCategoriesData.find(c => c.slug === article.category_slug);
                const categoryName = category ? (locale === 'cn' ? category.name_cn : category.name_th) : '';
                return (
                  <ArticleCard
                    key={article.slug}
                    slug={article.slug}
                    title_th={article.title_th}
                    title_cn={article.title_cn}
                    excerpt_th={article.excerpt_th}
                    excerpt_cn={article.excerpt_cn}
                    cover_image={article.cover_image}
                    published_date={article.published_date}
                    category_name={categoryName}
                    locale={locale}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Showcase */}
      <section className="py-16 px-4 bg-brand-surface border-t border-slate-200">
        <div className="container mx-auto max-w-6xl">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-brand-navy">{locale === 'cn' ? '热销产品' : 'สินค้าขายดี'}</h2>
              <p className="text-slate-500 mt-2">{locale === 'cn' ? '最受客户欢迎的五金工具' : 'ฮาร์ดแวร์และอุปกรณ์ที่ได้รับความนิยมสูงสุด'}</p>
            </div>
            <Link href="/products" className="text-brand-red font-bold hover:text-red-700 hidden sm:block">
              {locale === 'cn' ? '查看全部产品 &rarr;' : 'ดูสินค้าทั้งหมด &rarr;'}
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                slug={product.slug}
                name_th={product.name_th}
                name_cn={product.name_cn}
                images={product.images && product.images.length > 0 ? product.images : undefined}
                image={product.image}
                specs={product.specs}
                sku={product.sku}
                unit={product.unit}
                wholesale_price_1={product.wholesale_price_1}
                price={product.price}
                price_display={product.pricing_tier?.price_display}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
