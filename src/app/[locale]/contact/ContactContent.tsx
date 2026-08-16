"use client";
import { MapPin, Phone, Mail, MessageCircle, Copy, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ContactData {
  address_th: string;
  address_cn: string;
  phone: string;
  phone_display: string;
  email: string;
  line_id: string;
  wechat_id: string;
  business_hours_th: string;
  business_hours_cn: string;
  map_embed_src: string;
  social: {
    facebook_url: string;
    line_oa_url: string;
  };
}

export function ContactContent({ contact, locale }: { contact: ContactData; locale: string }) {
  const address = locale === 'cn' ? contact.address_cn : contact.address_th;
  const businessHours = locale === 'cn' ? contact.business_hours_cn : contact.business_hours_th;

  const handleLine = () => {
    const message = locale === 'cn' ? '您好，我想咨询五金产品报价' : 'สวัสดีค่ะ/ครับ ต้องการสอบถามราคาสินค้าฮาร์ดแวร์';
    window.open(`https://line.me/R/msg/text/?${encodeURIComponent(message)}`, '_blank');
  };

  const handleCopyWeChat = () => {
    navigator.clipboard.writeText(contact.wechat_id);
    toast.success(
      locale === 'cn' ? '微信号已复制！请前往微信添加好友。' : 'คัดลอก WeChat ID แล้ว! นำไปเพิ่มเพื่อนใน WeChat ได้เลย'
    );
  };

  return (
    <>
      {/* Hero */}
      <section className="relative bg-brand-navy text-white overflow-hidden py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="relative container mx-auto max-w-4xl text-center space-y-4 z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            {locale === 'cn' ? '联系我们' : 'ติดต่อเรา'}
          </h1>
          <p className="text-lg md:text-xl text-slate-300 font-medium max-w-2xl mx-auto">
            {locale === 'cn'
              ? '有任何产品或报价问题？欢迎通过以下方式联系我们的团队。'
              : 'มีคำถามเกี่ยวกับสินค้าหรือต้องการขอใบเสนอราคา ทีมงานของเราพร้อมให้บริการผ่านช่องทางด้านล่าง'}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-brand-red" />
      </section>

      {/* Contact channel cards */}
      <section className="py-16 px-4 bg-brand-surface">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Address */}
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col items-start gap-3">
            <div className="h-12 w-12 bg-brand-surface text-brand-red rounded-full flex items-center justify-center">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-brand-navy">{locale === 'cn' ? '仓库地址' : 'ที่อยู่คลังสินค้า'}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{address}</p>
          </div>

          {/* Phone */}
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col items-start gap-3">
            <div className="h-12 w-12 bg-brand-surface text-brand-red rounded-full flex items-center justify-center">
              <Phone className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-brand-navy">{locale === 'cn' ? '电话' : 'เบอร์โทรศัพท์'}</h3>
            <a href={`tel:${contact.phone}`} className="text-brand-red font-semibold text-sm hover:underline">
              {contact.phone_display}
            </a>
          </div>

          {/* Email */}
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col items-start gap-3">
            <div className="h-12 w-12 bg-brand-surface text-brand-red rounded-full flex items-center justify-center">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-brand-navy">{locale === 'cn' ? '邮箱' : 'อีเมล'}</h3>
            <a href={`mailto:${contact.email}`} className="text-brand-red font-semibold text-sm hover:underline break-all">
              {contact.email}
            </a>
          </div>

          {/* LINE */}
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col items-start gap-3">
            <div className="h-12 w-12 bg-brand-surface text-brand-red rounded-full flex items-center justify-center">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-brand-navy">LINE</h3>
            <p className="text-slate-500 text-sm">{contact.line_id}</p>
            <Button onClick={handleLine} className="w-full bg-[#00B900] hover:bg-[#009900] text-white font-bold">
              <MessageCircle className="mr-2 h-4 w-4" /> {locale === 'cn' ? '发送 LINE 消息' : 'แชทผ่าน LINE'}
            </Button>
          </div>

          {/* WeChat */}
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col items-start gap-3">
            <div className="h-12 w-12 bg-brand-surface text-brand-red rounded-full flex items-center justify-center">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-brand-navy">WeChat</h3>
            <p className="text-slate-500 text-sm">{contact.wechat_id}</p>
            <Button onClick={handleCopyWeChat} className="w-full bg-[#07C160] hover:bg-[#06AD56] text-white font-bold">
              <Copy className="mr-2 h-4 w-4" /> {locale === 'cn' ? '复制微信号' : 'คัดลอก WeChat ID'}
            </Button>
          </div>

          {/* Business hours */}
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col items-start gap-3">
            <div className="h-12 w-12 bg-brand-surface text-brand-red rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-brand-navy">{locale === 'cn' ? '营业时间' : 'เวลาทำการ'}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{businessHours}</p>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="pb-16 px-4 bg-brand-surface">
        <div className="container mx-auto max-w-6xl">
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            <iframe
              src={contact.map_embed_src}
              className="w-full h-80 md:h-96 border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={locale === 'cn' ? '仓库地图位置' : 'แผนที่คลังสินค้า'}
            />
          </div>
        </div>
      </section>
    </>
  );
}
