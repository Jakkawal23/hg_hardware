"use client";
import { useQuoteStore } from '@/store/useQuoteStore';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft, CheckCircle2, MessageCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useLocale } from 'next-intl';

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { formatPriceRange } from '@/lib/pricing';

export function ProductDetailClient({ product }: { product: any }) {
  const locale = useLocale();
  const addItem = useQuoteStore(state => state.addItem);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  // Type assertions to ensure we access the correctly localized text
  const localizedName = locale === 'cn' ? product.name_cn : product.name_th;
  const shortDesc = locale === 'cn' ? (product.short_description as any)?.cn : (product.short_description as any)?.th;
  const fullDescHtml = locale === 'cn' ? (product.full_description_html as any)?.cn : (product.full_description_html as any)?.th;
  const legacyPriceDisplay = locale === 'cn' ? (product.pricing_tier?.price_display as any)?.cn : (product.pricing_tier?.price_display as any)?.th;
  // We only know the wholesale price, so the site shows a +/-20% band around it
  // (e.g. a 100 THB wholesale price displays as "80 - 120") rather than one exact number.
  const rangePriceDisplay = formatPriceRange(product.wholesale_price_1 ?? product.price, locale);
  const priceDisplay = legacyPriceDisplay || rangePriceDisplay;

  // Specs shown on the detail page — built from whichever fields this product actually has.
  // Internal-only fields (cost, warehouse bin location, last import date) are deliberately excluded.
  const specEntries: [string, string][] = product.specs
    ? Object.entries(product.specs).map(([k, v]) => [k, String(v)])
    : ([
        [locale === 'cn' ? '货号' : 'รหัสสินค้า', product.code],
        ['SKU', product.sku],
        [locale === 'cn' ? '型号' : 'รุ่น/โมเดล', product.model],
        [locale === 'cn' ? '规格' : 'ขนาด/สเปค', product.spec_number],
        [locale === 'cn' ? '单位' : 'หน่วยนับ', product.unit],
        [locale === 'cn' ? '材质' : 'วัสดุ', product.material_cn],
        [locale === 'cn' ? '分类' : 'หมวดย่อย (จีน)', product.category_cn],
      ].filter(([, v]) => !!v) as [string, string][]);

  const handleAdd = () => {
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      toast.error(locale === 'th' ? 'กรุณาเลือกตัวเลือกสินค้าก่อน' : '请先选择产品规格');
      return;
    }
    const cartId = selectedVariant ? `${product.id}_${selectedVariant}` : product.id;
    const firstImage = (product.images && product.images[0]) || product.image || '/placeholder.svg';
    addItem({
      id: cartId,
      name_th: product.name_th || localizedName,
      name_cn: product.name_cn || localizedName,
      quantity: 1,
      image: firstImage,
      variant: selectedVariant || undefined
    });
    toast.success(locale === 'th' ? 'เพิ่มลงในรายการขอใบเสนอราคาแล้ว' : '已添加到报价单');
  };

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const width = scrollRef.current.offsetWidth;
    const newIndex = Math.round(scrollLeft / width);
    if (newIndex !== activeImageIndex) {
      setActiveImageIndex(newIndex);
    }
  };

  const displayImages = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : ['/placeholder.svg']);

  const handleNext = () => {
    if (activeImageIndex < displayImages.length - 1) {
      setActiveImageIndex(prev => prev + 1);
      scrollToIndex(activeImageIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeImageIndex > 0) {
      setActiveImageIndex(prev => prev - 1);
      scrollToIndex(activeImageIndex - 1);
    }
  };

  const handleThumbnailClick = (index: number) => {
    setActiveImageIndex(index);
    scrollToIndex(index);
  };

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const width = scrollRef.current.offsetWidth;
      scrollRef.current.scrollTo({ left: width * index, behavior: 'smooth' });
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 pb-24 md:pb-8">
      <Link href="/products" className="inline-flex items-center text-slate-500 hover:text-brand-red font-bold mb-6 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> {locale === 'cn' ? '返回产品目录' : 'กลับไปหน้ารวมสินค้า'}
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          
          {/* Image Gallery */}
          <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 relative group/gallery">
            <div 
              ref={scrollRef}
              className="bg-brand-surface flex items-center min-h-[300px] md:min-h-[400px] lg:min-h-[500px] w-full overflow-x-auto snap-x snap-mandatory hide-scrollbar relative"
              onScroll={handleScroll}
            >
              {displayImages.map((img: string, idx: number) => (
                <div key={idx} className="min-w-full w-full h-full snap-start flex items-center justify-center p-4 md:p-8">
                  <img 
                    src={img} 
                    alt={`${localizedName} - Image ${idx + 1}`} 
                    className="max-w-full max-h-[500px] object-contain rounded-lg shadow-sm bg-white p-2 md:p-4"
                  />
                </div>
              ))}
            </div>

            {/* Nav Buttons (Desktop hover) */}
            {displayImages.length > 1 && (
              <>
                <button 
                  onClick={handlePrev}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-700 p-2 rounded-full shadow-md opacity-0 group-hover/gallery:opacity-100 transition-opacity disabled:opacity-0 hidden md:block ${activeImageIndex === 0 ? 'pointer-events-none' : ''}`}
                  disabled={activeImageIndex === 0}
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button 
                  onClick={handleNext}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-700 p-2 rounded-full shadow-md opacity-0 group-hover/gallery:opacity-100 transition-opacity disabled:opacity-0 hidden md:block ${activeImageIndex === displayImages.length - 1 ? 'pointer-events-none' : ''}`}
                  disabled={activeImageIndex === displayImages.length - 1}
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Thumbnails */}
            {displayImages.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto bg-slate-50 hide-scrollbar border-t border-slate-200">
                {displayImages.map((img: string, idx: number) => (
                  <button 
                    key={idx} 
                    onClick={() => handleThumbnailClick(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md border-2 overflow-hidden transition-all ${activeImageIndex === idx ? 'border-brand-red opacity-100' : 'border-transparent opacity-60 hover:opacity-100 hover:border-slate-300'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover bg-white" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Pricing Content */}
          <div className="p-8 lg:p-12 flex flex-col bg-white">
            <Badge className="w-fit mb-4 bg-slate-100 text-brand-navy hover:bg-slate-200 uppercase tracking-wider text-[10px] font-bold border border-slate-200">
              {product.category_cn || product.category_slug || product.sub_category_slug || 'HARDWARE'}
            </Badge>

            <h1 className="text-3xl font-extrabold text-brand-navy mb-4 leading-tight">
              {localizedName}
            </h1>

            {(shortDesc || product.sku) && (
              <p className="text-slate-600 mb-6 font-medium">
                {shortDesc || (locale === 'cn' ? `货号：${product.sku}` : `รหัสอ้างอิง: ${product.sku}`)}
              </p>
            )}

            {/* Pricing Area */}
            <div className="bg-brand-surface border border-slate-200 rounded-xl p-6 mb-8">
              <div className="mb-4">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                  {locale === 'cn' ? '批发价参考区间 / Estimated Price Range' : 'ช่วงราคาโดยประมาณ / Estimated Price Range'}
                </span>
                <div className="text-3xl font-extrabold text-brand-red mt-1">
                  {priceDisplay || (locale === 'cn' ? '联系销售获取报价' : 'ติดต่อสอบถามราคา')}
                  {priceDisplay && product.unit && <span className="text-base font-semibold text-slate-500 ml-1">/ {product.unit}</span>}
                </div>
                {priceDisplay && (
                  <p className="text-xs text-slate-500 mt-2">
                    {locale === 'cn' ? '此区间仅供参考，实际报价请联系销售人员。' : 'ราคานี้เป็นช่วงโดยประมาณเท่านั้น กรุณาติดต่อฝ่ายขายเพื่อขอราคาที่แน่นอน'}
                  </p>
                )}
              </div>

              {product.pricing_tier?.type === 'tiered' && product.pricing_tier.tiers && (
                <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden bg-white">
                  <Table>
                    <TableHeader className="bg-slate-100">
                      <TableRow>
                        <TableHead className="font-bold text-brand-navy">{locale === 'cn' ? '数量' : 'ปริมาณสั่งซื้อ'}</TableHead>
                        <TableHead className="font-bold text-brand-navy text-right">{locale === 'cn' ? '单价' : 'ราคาต่อหน่วย'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {product.pricing_tier.tiers.map((tier: any, idx: number) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium text-slate-700">{tier.min_qty}</TableCell>
                          <TableCell className="text-brand-red font-bold text-right">{tier.price}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              
              <div className="mt-4 text-xs text-slate-500 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-brand-yellow" />
                <p>
                  {locale === 'cn' 
                    ? '价格不含税和运费。最终批发价请联系销售人员确认。' 
                    : 'ราคานี้ยังไม่รวมภาษีมูลค่าเพิ่มและค่าจัดส่ง โปรดยืนยันราคาส่งล่าสุดกับฝ่ายขายอีกครั้ง'}
                </p>
              </div>
            </div>

            {/* Variants Selection */}
            {product.variants && product.variants.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
                  {locale === 'cn' ? '选择规格' : 'เลือกตัวเลือกสินค้า'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v: string) => (
                    <button
                      key={v}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-4 py-2 rounded-md border text-sm font-bold transition-all ${
                        selectedVariant === v 
                          ? 'border-brand-red bg-red-50 text-brand-red shadow-sm' 
                          : 'border-slate-200 text-slate-600 hover:border-slate-400 bg-white'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Area (Desktop) */}
            <div className="mt-auto hidden md:block space-y-3">
              <div className="flex items-center text-green-600 font-bold text-sm mb-4">
                <CheckCircle2 className="h-5 w-5 mr-2" /> 
                {locale === 'cn' ? '现货 - 泰国仓库发货' : 'สินค้าพร้อมส่ง - สต็อกไทย'}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button className="w-full bg-[#00B900] hover:bg-[#009900] text-white font-bold h-12 text-base shadow-sm">
                  <MessageCircle className="mr-2 h-5 w-5" /> Line OA
                </Button>
                <Button className="w-full bg-[#07C160] hover:bg-[#06AD56] text-white font-bold h-12 text-base shadow-sm">
                  <MessageCircle className="mr-2 h-5 w-5" /> WeChat
                </Button>
              </div>
              <Button onClick={handleAdd} variant="outline" className="w-full border-brand-red text-brand-red hover:bg-brand-red hover:text-white font-bold h-12 text-base transition-colors">
                <Plus className="mr-2 h-5 w-5" /> {locale === 'cn' ? '加入报价单 (RFQ)' : 'เพิ่มลงในรายการขอใบเสนอราคา'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 flex gap-2 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col gap-1 w-1/3">
          <Button variant="outline" size="sm" className="h-full flex flex-col items-center justify-center border-slate-200 text-slate-600 p-1 text-[10px]">
             <MessageCircle className="h-4 w-4 mb-0.5" /> Line/WeChat
          </Button>
        </div>
        <Button onClick={handleAdd} className="flex-1 bg-brand-red hover:bg-red-700 text-white font-bold h-12 rounded-lg text-sm shadow-sm">
          <Plus className="mr-1 h-4 w-4" /> {locale === 'cn' ? '加入报价单 (RFQ)' : 'เพิ่มลงในรายการขอใบเสนอ'}
        </Button>
      </div>

      {/* Rich Details Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200 bg-brand-surface p-4">
          <h2 className="text-xl font-bold text-brand-navy">
             {locale === 'cn' ? '产品详情规格' : 'รายละเอียดและข้อมูลจำเพาะ'}
          </h2>
        </div>
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-10">
            {/* HTML Description */}
            {fullDescHtml && (
              <div 
                className="prose prose-slate max-w-none prose-headings:text-brand-navy prose-a:text-brand-red"
                dangerouslySetInnerHTML={{ __html: fullDescHtml }}
              />
            )}

            {/* Infographics */}
            {product.detail_infographic_images && product.detail_infographic_images.length > 0 && (
              <div className="space-y-6 pt-6 border-t border-slate-100">
                <h3 className="text-lg font-bold text-brand-navy">{locale === 'cn' ? '技术图纸 / 尺寸表' : 'รูปภาพข้อมูลเทคนิค'}</h3>
                {product.detail_infographic_images.map((img: string, idx: number) => (
                  <img key={idx} src={img} alt="Infographic" className="w-full rounded-lg border border-slate-200 shadow-sm" />
                ))}
              </div>
            )}
          </div>

          {/* Side Specifications Table */}
          <div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden sticky top-24">
              <div className="bg-slate-100 p-4 border-b border-slate-200">
                <h3 className="font-bold text-brand-navy">{locale === 'cn' ? '规格参数' : 'ข้อมูลทางเทคนิค'}</h3>
              </div>
              <Table>
                <TableBody>
                  {specEntries.map(([key, value], idx) => (
                    <TableRow key={key} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <TableCell className="font-semibold text-slate-700 py-3 w-1/3">{key}</TableCell>
                      <TableCell className="text-slate-600 py-3">{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
