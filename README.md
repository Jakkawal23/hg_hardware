# HG-Hardware (คลังสินค้าน็อตฮาร์ดแวร์)

An e-commerce and catalog platform for HG-Hardware, built with modern web technologies to showcase hardware products and handle quotation requests.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI Library**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/) & [Base UI](https://base-ui.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Internationalization (i18n)**: [next-intl](https://next-intl-docs.vercel.app/)
- **Database / Backend**: [Supabase](https://supabase.com/)

## 🚀 Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ✨ Key Features

- **Product Catalog**: Browse hardware products and view specifications.
- **Company Profile**: About page with company history, mission/vision, and certifications.
- **Contact Us**: Contact channels (phone, email, LINE, WeChat) and an embedded map.
- **Articles / Knowledge Base**: Educational articles about hardware knowledge and product usage.
- **RFQ System**: Seamless "Request for Quotation" drawer and workflow.
- **Internationalization**: Full i18n support for multiple languages (Thai, Chinese).
- **Responsive Design**: Fully responsive, mobile-first design.
- **Interactive UI**: Fluid animations and highly polished user interfaces.

## 📂 Project Structure

- `src/app/[locale]/` - Next.js App Router pages (locale routing: `/th/...`, `/cn/...`)
  - `products/` - Product catalog (list + `[slug]` detail pages)
  - `about/` - Company profile page
  - `contact/` - Contact us page
  - `articles/` - Articles list + `[slug]` detail pages
- `src/components/` - Reusable React components (e.g., Navbar, Footer, RFQDrawer, ProductCard, ArticleCard)
- `src/lib/products.ts` - Reads `src/data/products/` at build time
- `src/lib/articles.ts` - Reads `src/data/articles/` at build time (same pattern as `products.ts`)
- `supabase/` - Supabase database integration and configurations (not currently wired into the app)
- `messages/` - Translation JSON files for `next-intl` (short UI labels only, e.g. nav links)
- `public/` - Static assets like images and icons

### ✍️ Editing content (no code changes needed)

Business content lives entirely in `src/data/`, organized by folder/file so it's easy to find and edit:

- **Products**: `src/data/categories.json` (main categories + sub-categories) and `src/data/products/<main-category-slug>/<sub-category-slug>/<group-id>.json` — one file per product group (e.g. `01-01-01-quan-ya-si-gan.json`), containing an array of products with pricing, specs, and inventory fields imported from the source catalog. Add a product by editing an existing group file, or add a new product group by creating a new `<group-id>.json` file in the matching sub-category folder (see an existing file for the required shape).
- **Company info**: `src/data/company.json` — legal name, founding year, tax ID, mission/vision, history timeline, certifications. Values still marked `"TODO: ..."` are placeholders — replace them with real company facts before launch.
- **Contact info**: `src/data/contact.json` — address, phone, email, LINE ID, WeChat ID, business hours, Google Maps embed URL. Also marked with `"TODO: ..."` placeholders.
- **Articles**: `src/data/article-categories.json` lists the article categories. Each article is its own folder under `src/data/articles/<article-slug>/`:
  - `meta.json` - title, excerpt, category, cover image, published date, author (both languages)
  - `th.md` - Thai article body, written in plain Markdown
  - `cn.md` - Chinese article body, written in plain Markdown
  
  To add a new article, copy an existing folder (e.g. `src/data/articles/how-to-choose-anchor-bolts/`), rename it to your new slug, and edit the three files.

### 🖼️ Product Images

Every product already has an empty folder pre-created for its photos — you never need to create folders
yourself, and you never need to touch any JSON file. Just drop image files into the right folder and they
appear on the site on the next `npm run dev` / `npm run build`.

**Folder pattern** (mirrors the product data folder structure one level deeper, down to one folder per product):

```
public/products/<main_category_slug>/<sub_category_slug>/<group_id>/<product_slug>/
  cover.jpg   <- main/cover photo (required — shown on product cards and as the main image)
  1.jpg       <- optional gallery photo #1
  2.jpg       <- optional gallery photo #2
  ...
  8.jpg       <- up to 8 gallery photos total
```

Example — product `01-01-01-002` (สตัดเกลียวตลอด มาตรฐานจีน 6\*3\*50):
```
public/products/01-jin-gu-jian/01-01-quan-ya-si-gan/01-01-01-quan-ya-si-gan/01-01-01-002/cover.jpg
```

**File naming rules**:
- Cover image must be named exactly `cover` (any of `.jpg`, `.jpeg`, `.png`, `.webp`)
- Gallery images must be named `1` through `8` (same extensions allowed) — numbers can be skipped, they just display in ascending order
- No photo yet? No problem — the product shows an automatic placeholder image until one is added

**How to find the right folder for a product you have a photo for**: open
[`docs/product-image-lookup.csv`](docs/product-image-lookup.csv) in Excel/Google Sheets — every product is
listed with its Thai/Chinese name, SKU, and the exact folder path to drop the photo into. Search by name or
SKU, copy the path from the last column.

If products are ever added or removed in `src/data/products/`, re-run these to keep the image folder
skeleton and the lookup spreadsheet in sync (safe to re-run — never deletes existing photos):

```bash
node scripts/generate-product-image-folders.js
node scripts/generate-product-image-lookup.js
```

Full details (and the code that scans these folders): [`docs/product-images.md`](docs/product-images.md) /
[`src/lib/products.ts`](src/lib/products.ts) (`getProductImages`).
