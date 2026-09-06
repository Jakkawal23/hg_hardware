"use client";
import { Suspense, useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/product/ProductCard';
import { Input } from '@/components/ui/input';
import { Search, Filter, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Types
type Product = any; 
type Category = any;
type ProductGroup = {
  id: string;
  main_category_slug: string;
  sub_category_slug: string;
  name_th: string;
  name_cn: string;
  products: Product[];
};

interface Props {
  products: ProductGroup[]; // We pass ProductGroup[] now from page.tsx
  categories: Category[];
}

function ProductsCatalogContent({ products, categories }: Props) {
  const searchParams = useSearchParams();
  const defaultCategory = searchParams.get('category') || (categories.length > 0 ? categories[0].slug : '');
  
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [activeSubCategory, setActiveSubCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const locale = useLocale();

  // Find the currently selected main category object
  const currentMainCategory = categories.find(c => c.slug === activeCategory) || categories[0];

  // When activeCategory changes, reset activeSubCategory to the first sub_category if available
  useEffect(() => {
    if (currentMainCategory && currentMainCategory.sub_categories && currentMainCategory.sub_categories.length > 0) {
      // If we don't have an active sub category, or if the current active sub category doesn't belong to the new main category
      const subExists = currentMainCategory.sub_categories.find((sc: any) => sc.slug === activeSubCategory);
      if (!subExists) {
        setActiveSubCategory(currentMainCategory.sub_categories[0].slug);
      }
    } else {
      setActiveSubCategory('');
    }
  }, [activeCategory, currentMainCategory]);

  // Filter logic
  const filteredGroups = products
    .filter(group => {
      const matchesMainCat = group.main_category_slug === activeCategory;
      const matchesSubCat = activeSubCategory ? group.sub_category_slug === activeSubCategory : true;
      return matchesMainCat && matchesSubCat;
    })
    .map(group => {
      // Filter products inside the group based on search query
      const filteredProductsInGroup = group.products.filter(product => {
        const q = searchQuery.toLowerCase();
        const matchesSearch = searchQuery === '' ||
          product.name_th?.toLowerCase().includes(q) ||
          product.name_cn?.toLowerCase().includes(q) ||
          product.sku?.toLowerCase().includes(q) ||
          product.slug?.toLowerCase().includes(q);
        return matchesSearch;
      });
      return {
        ...group,
        products: filteredProductsInGroup
      };
    })
    .filter(group => group.products.length > 0); // Hide empty groups

  // Calculate total products matching for the badge
  const totalProductsMatch = filteredGroups.reduce((acc, group) => acc + group.products.length, 0);

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      {/* Mobile Search Bar (Sticky Top) */}
      <div className="md:hidden sticky top-0 z-30 bg-white p-4 border-b border-slate-200 shadow-sm">
        <div className="relative w-full">
          <Input 
            type="text" 
            placeholder={locale === 'cn' ? '搜索产品...' : 'ค้นหาสินค้า...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-slate-100 border-none rounded-full focus-visible:ring-brand-red"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
        </div>
      </div>

      <div className="container mx-auto max-w-7xl flex flex-col md:flex-row pt-2 md:pt-8 gap-2 md:gap-6 px-4">
        
        {/* Sidebar - Main Categories */}
        <aside className="w-full md:w-64 flex-shrink-0 mb-1 md:mb-0">
          <div className="py-2 md:p-0">
            <h3 className="font-bold text-slate-900 mb-4 hidden md:flex items-center gap-2">
              <Filter className="h-5 w-5" /> {locale === 'cn' ? '产品分类' : 'หมวดหมู่หลัก'}
            </h3>
            <ul className="flex flex-row overflow-x-auto md:flex-col gap-2 md:gap-1 pb-1 md:pb-0 hide-scrollbar snap-x">
              {categories.map(cat => {
                const catName = locale === 'cn' ? cat.name_cn : (cat.name_th_short || cat.name_th);
                const isActive = activeCategory === cat.slug;
                return (
                  <li key={cat.id} className="snap-start flex-shrink-0 md:w-full">
                    <button 
                      onClick={() => setActiveCategory(cat.slug)}
                      className={`
                        w-full text-left px-4 py-2 md:py-3 rounded-full md:rounded-lg transition-all text-sm md:text-base font-medium flex items-center justify-between border
                        ${isActive 
                          ? 'bg-brand-red text-white border-brand-red md:bg-white md:text-brand-red md:shadow-sm md:border-l-4 md:border-brand-red md:border-y-slate-100 md:border-r-slate-100 md:rounded-l-none' 
                          : 'bg-white text-slate-600 border-slate-200 md:bg-transparent md:border-transparent hover:bg-slate-50 md:hover:bg-white md:hover:text-brand-navy'}
                      `}
                    >
                      <span className="truncate">{catName}</span>
                      {isActive && <ChevronRight className="h-4 w-4 hidden md:block" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-full overflow-hidden">
          
          {/* Desktop Search */}
          <div className="hidden md:flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6">
             <h1 className="text-xl font-bold text-brand-navy">
              {locale === 'cn' ? currentMainCategory?.name_cn : currentMainCategory?.name_th}
             </h1>
             <div className="relative w-72">
              <Input 
                type="text" 
                placeholder={locale === 'cn' ? '搜索此分类...' : 'ค้นหาในหมวดหมู่นี้...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-brand-red rounded-full"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            </div>
          </div>

          {/* Sub Category Header Title (Mobile) */}
          <div className="md:hidden mb-3">
            <h2 className="text-xl font-extrabold text-brand-navy flex items-center gap-2">
              {currentMainCategory?.sub_categories?.find((sc:any) => sc.slug === activeSubCategory)
                ? (locale === 'cn' 
                    ? currentMainCategory.sub_categories.find((sc:any) => sc.slug === activeSubCategory).name_cn
                    : currentMainCategory.sub_categories.find((sc:any) => sc.slug === activeSubCategory).name_th)
                : (locale === 'cn' ? currentMainCategory?.name_cn : currentMainCategory?.name_th)}
              <Badge variant="secondary" className="bg-slate-200 text-slate-700 font-bold">{totalProductsMatch}</Badge>
            </h2>
          </div>

          {/* Sub Categories Tabs */}
          {currentMainCategory?.sub_categories && currentMainCategory.sub_categories.length > 0 && (
            <div className="bg-transparent md:bg-white pb-3 md:p-4 md:rounded-xl md:shadow-sm md:border md:border-slate-100 mb-2 md:mb-6 z-20">
              <ul className="flex flex-row overflow-x-auto gap-2 md:gap-3 hide-scrollbar snap-x">
                {currentMainCategory.sub_categories.map((subCat: any) => {
                  const subCatName = locale === 'cn' ? subCat.name_cn : (subCat.name_th_short || subCat.name_th);
                  const isActive = activeSubCategory === subCat.slug;
                  return (
                    <li key={subCat.id} className="snap-start flex-shrink-0">
                      <button
                        onClick={() => setActiveSubCategory(subCat.slug)}
                        className={`
                          px-4 py-1.5 md:px-5 md:py-2 rounded-full text-sm font-medium transition-colors border
                          ${isActive 
                            ? 'bg-brand-navy text-white border-brand-navy shadow-sm' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm'}
                        `}
                      >
                        {subCatName}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Product Groups */}
          {filteredGroups.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-100 shadow-sm">
              <div className="h-16 w-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8" />
              </div>
              <p className="text-slate-500 text-lg">{locale === 'cn' ? '没有找到相关产品' : 'ไม่พบสินค้าที่คุณค้นหา'}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-8 pb-10">
              {filteredGroups.map(group => (
                <div key={`${group.main_category_slug}-${group.sub_category_slug}-${group.id}`} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-6">
                  <h3 className="text-lg font-bold text-brand-navy mb-4 border-b border-slate-100 pb-2">
                    {locale === 'cn' ? group.name_cn : group.name_th}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                    {group.products.map(product => (
                      <ProductCard
                        key={product.id}
                        id={product.id}
                        slug={product.slug}
                        name_th={product.name_th}
                        name_cn={product.name_cn}
                        images={product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : undefined)}
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
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export function ProductsCatalogClient({ products, categories }: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProductsCatalogContent products={products} categories={categories} />
    </Suspense>
  );
}
