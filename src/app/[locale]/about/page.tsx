import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Target, Eye, ShieldCheck, Award, Factory, Truck, HeadphonesIcon } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import companyData from '@/data/company.json';
import warehouseData from '@/data/warehouse.json';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'cn' ? '关于我们 | HG Hardware' : 'รู้จักเรา | HG Hardware';
  const description =
    locale === 'cn'
      ? '了解 HG Hardware——泰国五金进口批发仓库，源头直采、本地现货、中泰双语支持。'
      : 'รู้จัก HG Hardware คลังสินค้าฮาร์ดแวร์นำเข้าจากจีน ราคาส่งตรงจากโรงงาน มีสต็อกในไทย พร้อมทีมซัพพอร์ตไทย-จีน';
  return { title, description };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-brand-navy text-white overflow-hidden py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay" />
        <div className="relative container mx-auto max-w-4xl text-center space-y-4 z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-md">
            {locale === 'cn' ? '关于 HG Hardware' : 'รู้จัก HG Hardware'}
          </h1>
          <p className="text-lg md:text-xl text-slate-300 font-medium max-w-2xl mx-auto">
            {locale === 'cn'
              ? 'คลังสินค้าฮาร์ดแวร์นำเข้าจากจีน ราคาส่งตรงจากโรงงาน มีสต็อกพร้อมส่งในไทย'
              : 'คลังสินค้าน็อตและฮาร์ดแวร์ก่อสร้าง นำเข้าตรงจากโรงงานในจีน พร้อมสต็อกในไทยและทีมงานซัพพอร์ตสองภาษา'}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-brand-red" />
      </section>

      {/* Stats strip */}
      <section className="bg-brand-surface py-12 px-4 border-b border-slate-200">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center divide-x divide-slate-200">
            <div className="space-y-1 md:space-y-2">
              <div className="text-3xl md:text-4xl font-extrabold text-brand-red">10+</div>
              <div className="text-xs md:text-sm font-semibold text-brand-navy uppercase tracking-wider">
                {locale === 'cn' ? '中国制造经验' : 'ปี ประสบการณ์ในจีน'}
              </div>
            </div>
            <div className="space-y-1 md:space-y-2">
              <div className="text-3xl md:text-4xl font-extrabold text-brand-red">5+</div>
              <div className="text-xs md:text-sm font-semibold text-brand-navy uppercase tracking-wider">
                {locale === 'cn' ? '泰国直销经验' : 'ปี ประสบการณ์ในไทย'}
              </div>
            </div>
            <div className="space-y-1 md:space-y-2">
              <div className="text-3xl md:text-4xl font-extrabold text-brand-red">500+</div>
              <div className="text-xs md:text-sm font-semibold text-brand-navy uppercase tracking-wider">
                {locale === 'cn' ? '服务项目' : 'โครงการที่ไว้วางใจ'}
              </div>
            </div>
            <div className="space-y-1 md:space-y-2">
              <div className="text-3xl md:text-4xl font-extrabold text-brand-red">77</div>
              <div className="text-xs md:text-sm font-semibold text-brand-navy uppercase tracking-wider">
                {locale === 'cn' ? '覆盖泰国全境' : 'จังหวัด ครอบคลุมทั่วไทย'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="py-16 px-4 bg-white border-b border-slate-200">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl border border-slate-100 bg-brand-surface">
            <div className="h-12 w-12 bg-white text-brand-red rounded-full shadow-sm flex items-center justify-center mb-5">
              <Target className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-brand-navy mb-3">
              {locale === 'cn' ? '公司使命' : 'พันธกิจของเรา'}
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {locale === 'cn' ? companyData.mission_cn : companyData.mission_th}
            </p>
          </div>
          <div className="p-8 rounded-2xl border border-slate-100 bg-brand-surface">
            <div className="h-12 w-12 bg-white text-brand-red rounded-full shadow-sm flex items-center justify-center mb-5">
              <Eye className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-brand-navy mb-3">
              {locale === 'cn' ? '公司愿景' : 'วิสัยทัศน์ของเรา'}
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {locale === 'cn' ? companyData.vision_cn : companyData.vision_th}
            </p>
          </div>
        </div>
      </section>

      {/* Trust badges (same content as homepage, reused for consistency) */}
      <section className="bg-brand-surface py-16 px-4 border-b border-slate-200">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-extrabold text-brand-navy mb-10 text-center">
            {locale === 'cn' ? '为什么选择我们' : 'ทำไมต้องเลือกเรา'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center p-6 space-y-4 rounded-xl border border-slate-100 hover:shadow-md transition-shadow bg-white">
              <div className="p-4 bg-brand-surface text-brand-red rounded-full shadow-sm">
                <Factory className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-lg text-brand-navy">
                {locale === 'cn' ? '源头工厂批发价' : 'ราคาส่งตรงจากโรงงาน'}
              </h3>
              <p className="text-slate-500 text-sm">
                {locale === 'cn'
                  ? '直接与中国合作工厂对接，价格全网最低。可开具增值税发票。'
                  : 'รับประกันราคาดีที่สุด ส่งตรงจากโรงงานพันธมิตรในจีน สามารถออกใบกำกับภาษีได้'}
              </p>
            </div>
            <div className="flex flex-col items-center p-6 space-y-4 rounded-xl border border-slate-100 hover:shadow-md transition-shadow bg-white">
              <div className="p-4 bg-brand-surface text-brand-red rounded-full shadow-sm">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-lg text-brand-navy">
                {locale === 'cn' ? '泰国本地快速发货' : 'จัดส่งรวดเร็วในไทย'}
              </h3>
              <p className="text-slate-500 text-sm">
                {locale === 'cn'
                  ? '泰国春武里府大型仓库现货，24-48小时内发往泰国全境。'
                  : 'มีคลังสินค้าขนาดใหญ่ที่ชลบุรี พร้อมจัดส่งทั่วประเทศภายใน 24-48 ชั่วโมง'}
              </p>
            </div>
            <div className="flex flex-col items-center p-6 space-y-4 rounded-xl border border-slate-100 hover:shadow-md transition-shadow bg-white">
              <div className="p-4 bg-brand-surface text-brand-red rounded-full shadow-sm">
                <HeadphonesIcon className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-lg text-brand-navy">
                {locale === 'cn' ? '中泰双语客服支持' : 'ทีมซัพพอร์ตไทย-จีน'}
              </h3>
              <p className="text-slate-500 text-sm">
                {locale === 'cn'
                  ? '精通中泰双语的销售与工程团队，随时通过微信和Line为您服务。'
                  : 'ทีมขายและวิศวกรผู้เชี่ยวชาญพร้อมให้คำปรึกษาสองภาษา ผ่าน Line และ WeChat'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History timeline */}
      <section className="py-16 px-4 bg-white border-b border-slate-200">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-extrabold text-brand-navy mb-10 text-center">
            {locale === 'cn' ? '发展历程' : 'เส้นทางของเรา'}
          </h2>
          <div className="relative border-l-2 border-slate-200 ml-4 space-y-10">
            {companyData.history.map((item, idx) => (
              <div key={idx} className="relative pl-8">
                <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-brand-red border-4 border-white shadow" />
                <div className="text-brand-red font-extrabold text-lg mb-1">{item.year}</div>
                <p className="text-slate-600 leading-relaxed">
                  {locale === 'cn' ? item.text_cn : item.text_th}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 px-4 bg-brand-surface border-b border-slate-200">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-extrabold text-brand-navy mb-10 text-center">
            {locale === 'cn' ? '认证与信誉' : 'ใบรับรองและความน่าเชื่อถือ'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {companyData.certifications.map((cert) => (
              <div
                key={cert.id}
                className="flex items-center gap-4 p-5 bg-white rounded-xl border border-slate-100 shadow-sm"
              >
                <div className="h-12 w-12 flex-shrink-0 bg-brand-surface text-brand-navy rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6" />
                </div>
                <p className="text-slate-700 font-medium text-sm leading-snug">
                  {locale === 'cn' ? cert.name_cn : cert.name_th}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Warehouse showcase (reusing same data/section as homepage) */}
      <section className="py-16 px-4 bg-white border-b border-slate-200">
        <div className="container mx-auto max-w-6xl text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold text-brand-navy">
              {locale === 'cn' ? '仓储与物流实力' : 'คลังสินค้าและการจัดส่ง'}
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              {locale === 'cn'
                ? '查看我们在泰国的现货库存，为大型建筑项目提供稳定的物资保障。'
                : 'ชมคลังสินค้าจริงของเราในไทย มั่นใจได้ในสต็อกที่พร้อมซัพพอร์ตโปรเจกต์ก่อสร้างขนาดใหญ่'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {warehouseData.map((item) => (
              <div key={item.id} className="relative group overflow-hidden rounded-2xl shadow-md border border-slate-200">
                <img
                  src={item.image}
                  alt={locale === 'cn' ? item.title_cn : item.title_th}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                />
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

      {/* CTA */}
      <section className="py-16 px-4 bg-brand-navy text-white">
        <div className="container mx-auto max-w-3xl text-center space-y-6">
          <ShieldCheck className="h-10 w-10 mx-auto text-brand-yellow" />
          <h2 className="text-2xl md:text-3xl font-extrabold">
            {locale === 'cn' ? '准备好合作了吗？' : 'พร้อมเริ่มต้นทำงานร่วมกับเรา?'}
          </h2>
          <p className="text-slate-300">
            {locale === 'cn'
              ? '浏览我们的产品目录，或直接联系销售团队获取报价。'
              : 'เลือกชมสินค้าในแคตตาล็อกของเรา หรือติดต่อฝ่ายขายเพื่อขอใบเสนอราคาได้ทันที'}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Link href="/products">
              <Button size="lg" className="bg-brand-red hover:bg-red-700 text-white font-bold px-8 h-12 rounded-full w-full sm:w-auto">
                {locale === 'cn' ? '查看产品目录' : 'ดูแคตตาล็อกสินค้า'}
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white/50 text-white hover:bg-white/10 hover:border-white font-bold px-8 h-12 rounded-full w-full sm:w-auto"
              >
                {locale === 'cn' ? '联系我们' : 'ติดต่อเรา'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
