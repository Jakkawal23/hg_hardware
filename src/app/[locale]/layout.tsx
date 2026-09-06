import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Navbar } from "@/components/layout/Navbar";
import { FloatingWidget } from "@/components/layout/FloatingWidget";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";

const prompt = Prompt({ 
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ["latin", "thai"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "HG Hardware | คลังสินค้าน็อตฮาร์ดแวร์ ราคาส่ง",
  description: "B2B Hardware & Construction Supply Digital Catalog. Direct from China.",
  alternates: {
    languages: {
      'th': '/th',
      'zh-Hans': '/cn',
    },
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
 
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={prompt.className}>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="min-h-screen bg-slate-50">
            {children}
          </main>
          <Footer locale={locale} />
          <FloatingWidget />
          <Toaster position="top-right" duration={3000} closeButton />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
