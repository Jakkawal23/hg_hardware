import { Badge } from '@/components/ui/badge';
import { Link } from '@/i18n/routing';
import { CalendarDays } from 'lucide-react';

interface ArticleCardProps {
  slug: string;
  title_th: string;
  title_cn: string;
  excerpt_th: string;
  excerpt_cn: string;
  cover_image: string;
  published_date: string;
  category_name?: string;
  locale: string;
}

export function ArticleCard({
  slug,
  title_th,
  title_cn,
  excerpt_th,
  excerpt_cn,
  cover_image,
  published_date,
  category_name,
  locale,
}: ArticleCardProps) {
  const title = locale === 'cn' ? title_cn : title_th;
  const excerpt = locale === 'cn' ? excerpt_cn : excerpt_th;

  return (
    <Link href={`/articles/${slug}`} className="group block h-full">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 h-full flex flex-col overflow-hidden hover:border-brand-red">
        <div className="relative aspect-[16/10] w-full bg-brand-surface overflow-hidden">
          <img
            src={cover_image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {category_name && (
            <Badge className="absolute top-3 left-3 bg-brand-navy/90 text-white hover:bg-brand-navy border-0 font-semibold text-[10px] uppercase tracking-wider">
              {category_name}
            </Badge>
          )}
        </div>

        <div className="p-4 md:p-5 flex flex-col flex-1">
          <h3 className="font-bold text-slate-900 text-base md:text-lg line-clamp-2 leading-snug mb-2 group-hover:text-brand-red transition-colors">
            {title}
          </h3>
          <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1">
            {excerpt}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mt-auto pt-3 border-t border-slate-50">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>{published_date}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
