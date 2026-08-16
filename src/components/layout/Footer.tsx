import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { Link } from '@/i18n/routing';
import contactData from '@/data/contact.json';
import companyData from '@/data/company.json';

export function Footer({ locale }: { locale: string }) {
  const address = locale === 'cn' ? contactData.address_cn : contactData.address_th;

  return (
    <footer className="bg-brand-navy text-slate-300">
      <div className="container mx-auto max-w-6xl px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Logo + tagline */}
        <div>
          <Link href="/" className="font-extrabold text-2xl tracking-tight">
            <span className="text-white">HG</span>
            <span className="text-brand-yellow">HARDWARE</span>
          </Link>
          <p className="text-sm mt-3 leading-relaxed text-slate-400">
            {locale === 'cn'
              ? '泰国五金进口批发仓库，源头直采、本地现货、中泰双语支持。'
              : 'คลังสินค้าน็อตและฮาร์ดแวร์ก่อสร้าง นำเข้าตรงจากโรงงานในจีน พร้อมสต็อกในไทย'}
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
            {locale === 'cn' ? '快速链接' : 'ลิงก์ด่วน'}
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-brand-yellow transition-colors">{locale === 'cn' ? '首页' : 'หน้าแรก'}</Link></li>
            <li><Link href="/products" className="hover:text-brand-yellow transition-colors">{locale === 'cn' ? '产品' : 'สินค้า'}</Link></li>
            <li><Link href="/about" className="hover:text-brand-yellow transition-colors">{locale === 'cn' ? '关于我们' : 'เกี่ยวกับเรา'}</Link></li>
            <li><Link href="/articles" className="hover:text-brand-yellow transition-colors">{locale === 'cn' ? '文章' : 'บทความ'}</Link></li>
            <li><Link href="/contact" className="hover:text-brand-yellow transition-colors">{locale === 'cn' ? '联系我们' : 'ติดต่อเรา'}</Link></li>
          </ul>
        </div>

        {/* Contact summary */}
        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
            {locale === 'cn' ? '联系方式' : 'ติดต่อเรา'}
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5 text-brand-yellow" />
              <span>{address}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 flex-shrink-0 text-brand-yellow" />
              <a href={`tel:${contactData.phone}`} className="hover:text-brand-yellow transition-colors">
                {contactData.phone_display}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 flex-shrink-0 text-brand-yellow" />
              <a href={`mailto:${contactData.email}`} className="hover:text-brand-yellow transition-colors break-all">
                {contactData.email}
              </a>
            </li>
          </ul>
        </div>

        {/* LINE / WeChat */}
        <div>
          <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
            {locale === 'cn' ? '在线咨询' : 'แชทกับเรา'}
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 flex-shrink-0 text-[#00B900]" />
              <span>LINE: {contactData.line_id}</span>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 flex-shrink-0 text-[#07C160]" />
              <span>WeChat: {contactData.wechat_id}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto max-w-6xl px-4 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} HG Hardware. {locale === 'cn' ? '版权所有' : 'สงวนลิขสิทธิ์'}</p>
          <p>{locale === 'cn' ? '统一社会信用代码' : 'เลขประจำตัวผู้เสียภาษี'}: {companyData.tax_id}</p>
        </div>
      </div>
    </footer>
  );
}
