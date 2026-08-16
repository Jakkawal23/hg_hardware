import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import contactData from '@/data/contact.json';
import { ContactContent } from './ContactContent';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'cn' ? '联系我们 | HG Hardware' : 'ติดต่อเรา | HG Hardware';
  const description =
    locale === 'cn'
      ? '联系 HG Hardware 销售团队，通过电话、邮件、LINE 或微信获取五金产品报价。'
      : 'ติดต่อทีมขาย HG Hardware ผ่านโทรศัพท์ อีเมล LINE หรือ WeChat เพื่อขอใบเสนอราคาสินค้าฮาร์ดแวร์';
  return { title, description };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ContactContent contact={contactData} locale={locale} />;
}
