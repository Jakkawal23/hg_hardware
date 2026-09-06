import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllProducts, getProductBySlug } from '@/lib/products';
import { setRequestLocale } from 'next-intl/server';
import { ProductDetailClient } from './ProductDetailClient';

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export function generateStaticParams() {
  const productsData = getAllProducts();
  const allProducts = productsData.flatMap(g => g.products);
  return allProducts.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const resolvedParams = await params;
  const product = getProductBySlug(resolvedParams.slug);

  if (!product) {
    return {};
  }

  const localizedName = resolvedParams.locale === 'cn' ? product.name_cn : product.name_th;
  const title = `${localizedName} ราคาส่ง | hg-hardware คลังสินค้าน็อตฮาร์ดแวร์`;
  const description = resolvedParams.locale === 'cn' ? (product.short_description as any)?.cn : (product.short_description as any)?.th;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [product.images && product.images.length > 0 ? product.images[0] : (product.image || '')],
      type: 'website',
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const resolvedParams = await params;
  setRequestLocale(resolvedParams.locale);
  const product = getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  // JSON-LD Structured Data
  const localizedName = resolvedParams.locale === 'cn' ? product.name_cn : product.name_th;
  const description = resolvedParams.locale === 'cn' ? (product.short_description as any)?.cn : (product.short_description as any)?.th;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: localizedName,
    image: product.images && product.images.length > 0 ? product.images[0] : (product.image || ''),
    description: description,
    sku: product.sku || product.slug,
    offers: {
      '@type': 'AggregateOffer',
      offerCount: product.pricing_tier?.tiers?.length || 1,
      priceCurrency: 'THB',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} />
    </>
  );
}
