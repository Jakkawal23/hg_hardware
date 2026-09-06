/**
 * Price-range display helper.
 *
 * We only know each product's wholesale price. Rather than showing that exact number
 * (or a single made-up retail price), the site shows a +/-20% band around it, e.g. a
 * wholesale price of 100 THB displays as "80 - 120". If no price is known at all, the
 * caller should fall back to a "contact us" message instead.
 */
export function getPriceRange(price?: number | null): { low: number; high: number } | null {
  if (price == null || Number.isNaN(price) || price <= 0) return null;
  return {
    low: Math.round(price * 0.8),
    high: Math.round(price * 1.2),
  };
}

export function formatPriceRange(price: number | null | undefined, locale: string): string | null {
  const range = getPriceRange(price);
  if (!range) return null;
  const low = range.low.toLocaleString(locale === 'cn' ? 'zh-CN' : 'th-TH');
  const high = range.high.toLocaleString(locale === 'cn' ? 'zh-CN' : 'th-TH');
  const unit = locale === 'cn' ? '฿' : '฿';
  return `${unit}${low} - ${unit}${high}`;
}
