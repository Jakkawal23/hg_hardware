"use client";
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { Search, ShoppingCart, Menu, X, Globe } from 'lucide-react';
import { useQuoteStore } from '@/store/useQuoteStore';
import { Button } from '@/components/ui/button';
import { RFQDrawer } from './RFQDrawer';

export function Navbar() {
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const pathname = usePathname();
  const items = useQuoteStore((state) => state.items);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isRFQOpen, setIsRFQOpen] = useState(false);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-brand-red bg-brand-navy shadow-md">
        {/* Main Top Bar */}
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-extrabold text-2xl tracking-tight">
              <span className="text-white">HG</span><span className="text-brand-yellow">HARDWARE</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6 text-white font-medium">
            <Link href="/products" className="hover:text-brand-yellow transition-colors">{t('products')}</Link>
            <Link href="/articles" className="hover:text-brand-yellow transition-colors">{t('articles')}</Link>
            <Link href="/about" className="hover:text-brand-yellow transition-colors">{t('about')}</Link>
            <Link href="/contact" className="hover:text-brand-yellow transition-colors">{t('contact')}</Link>
            <div className="h-6 w-px bg-slate-700"></div>
            
            {/* Language Switcher */}
            <div className="flex items-center gap-2 text-sm bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
              <Globe className="h-4 w-4 text-slate-400" />
              <Link href={pathname} locale="th" className={locale === 'th' ? 'text-brand-yellow font-bold' : 'hover:text-brand-yellow'}>TH</Link>
              <span className="text-slate-600">|</span>
              <Link href={pathname} locale="cn" className={locale === 'cn' ? 'text-brand-yellow font-bold' : 'hover:text-brand-yellow'}>CN</Link>
            </div>

            {/* Quote List Button */}
            <button 
              onClick={() => setIsRFQOpen(true)}
              className="relative p-2 text-slate-300 hover:text-brand-yellow transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-brand-red text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Toggle (Hamburger & Cart) */}
          <div className="md:hidden flex items-center gap-4 text-white">
            <button onClick={() => setIsRFQOpen(true)} className="relative p-2 text-slate-300 hover:text-brand-yellow">
              <ShoppingCart className="h-6 w-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-brand-red text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <button onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

      </header>


        {/* Mobile Slide-out Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] md:hidden">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Drawer */}
            <div className="absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-brand-navy">
                <span className="font-extrabold text-lg text-white">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-brand-yellow p-2">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-8 flex-1 overflow-y-auto">


                {/* Navigation Links */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Pages</h3>
                  <div className="flex flex-col gap-2">
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-brand-navy hover:text-brand-red py-2 border-b border-slate-50">
                      {locale === 'cn' ? '首页 / Home' : 'หน้าแรก / Home'}
                    </Link>
                    <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-brand-navy hover:text-brand-red py-2 border-b border-slate-50">
                      {t('products')}
                    </Link>
                    <Link href="/articles" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-brand-navy hover:text-brand-red py-2 border-b border-slate-50">
                      {t('articles')}
                    </Link>
                    <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-brand-navy hover:text-brand-red py-2 border-b border-slate-50">
                      {t('about')}
                    </Link>
                    <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-brand-navy hover:text-brand-red py-2 border-b border-slate-50">
                      {t('contact')}
                    </Link>
                  </div>
                </div>

                {/* Language Switcher (Segmented Control) */}
                <div className="mt-auto pt-6 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Globe className="h-4 w-4" /> Language / ภาษา
                  </h3>
                  <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
                    <Link 
                      href={pathname} 
                      locale="th" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex-1 text-center py-2 rounded-md text-sm font-bold transition-all ${locale === 'th' ? 'bg-white shadow-sm text-brand-red border border-slate-200' : 'text-slate-500 hover:text-brand-navy'}`}
                    >
                      🇹🇭 ภาษาไทย
                    </Link>
                    <Link 
                      href={pathname} 
                      locale="cn" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex-1 text-center py-2 rounded-md text-sm font-bold transition-all ${locale === 'cn' ? 'bg-white shadow-sm text-brand-red border border-slate-200' : 'text-slate-500 hover:text-brand-navy'}`}
                    >
                      🇨🇳 中文
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      <RFQDrawer isOpen={isRFQOpen} onClose={() => setIsRFQOpen(false)} />
    </>
  );
}
