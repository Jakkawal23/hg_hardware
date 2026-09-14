import fs from 'fs';
import path from 'path';

// Define the type for a product, matching your JSON structure
export interface Product {
  id: string;
  slug: string;
  name_th: string;
  name_cn: string;

  // Permanent identifiers
  code?: string; // dot-formatted legacy code, e.g. "01.01.01.002" (same value as id/slug, dash-formatted)
  sku?: string; // human-friendly label, NOT stable — never used for routing, display only

  // Images (see getProductImages — auto-detected from /public/products/<slug>/)
  images?: string[];
  image?: string; // single fallback image (legacy / placeholder)

  // Pricing — wholesale_price_1 is the known price; the site shows it as a +/-20% range
  price?: number;
  wholesale_price_1?: number | null;
  wholesale_price_2?: number | null;

  // Specs / inventory metadata carried over from the source data
  unit?: string | null;
  model?: string | null;
  spec_number?: string | null;
  qty_sub_unit?: string | null;
  qty_main_unit?: number | null;
  category_cn?: string | null;
  category_code?: string | null;
  material_cn?: string | null;
  material_code?: string | null;
  name_th_full?: string | null;
  name_cn_full?: string | null;
  product_name_raw?: string | null;

  // Legacy rich-content fields (older/curated products only — not present on imported inventory data)
  short_description?: Record<string, string>;
  full_description_html?: Record<string, string>;
  detail_infographic_images?: string[];
  pricing_tier?: any;
  specs?: Record<string, string>;
  variants?: string[];
}

export interface ProductGroup {
  id: string;
  main_category_slug: string;
  sub_category_slug: string;
  name_th: string;
  name_cn: string;
  products: Product[];
}

const productsDirectory = path.join(process.cwd(), 'src/data/products');

// --- Product image auto-detection -------------------------------------------------
// Convention: public/products/<main_category_slug>/<sub_category_slug>/<group_id>/<product-slug>/
//               cover.{jpg|jpeg|png|webp}   (1 cover image)
//               1.{ext} .. 8.{ext}          (up to 8 gallery images)
// This mirrors the src/data/products/<main>/<sub>/<group>.json folder layout one level
// deeper, down to a folder per product. The full skeleton (every product's folder, empty
// except for a .gitkeep) is pre-created by scripts/generate-product-image-folders.js, so
// no folders need to be made by hand — just drop matching files into the right leaf folder
// and they appear automatically, no code or JSON changes needed. See docs/product-images.md.
//
// A product's slug is its permanent numeric code (e.g. "01-01-01-002"), so images survive
// any future SKU/name changes.
//
// With ~5,000 product folders (nested ~4 levels deep), checking every extension on disk per
// product (fs.existsSync in a loop) is far too slow for a full static export. Instead we walk
// the image tree ONCE into an in-memory index — keyed by leaf folder name (= product slug),
// regardless of nesting depth — and look products up in that.
const productImagesRoot = path.join(process.cwd(), 'public/products');
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

interface ImageFolderEntry {
  webPath: string; // e.g. "/products/01-jin-gu-jian/01-01-quan-ya-si-gan/01-01-01-quan-ya-si-gan/01-01-01-002"
  files: Set<string>;
}

let imageIndexCache: Map<string, ImageFolderEntry> | null = null;

// Recursively indexes every directory under `dir` that directly contains files (a "leaf"
// product folder — possibly containing only a .gitkeep placeholder), keyed by that
// directory's own name (the product slug), regardless of how deeply it's nested.
function walkAndIndexImages(dir: string, dirWebPath: string, index: Map<string, ImageFolderEntry>) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = entries.filter((e) => e.isFile()).map((e) => e.name);
  if (files.length > 0) {
    index.set(path.basename(dir), { webPath: dirWebPath, files: new Set(files) });
  }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      walkAndIndexImages(path.join(dir, entry.name), `${dirWebPath}/${entry.name}`, index);
    }
  }
}

function getImageIndex(): Map<string, ImageFolderEntry> {
  if (imageIndexCache) return imageIndexCache;
  const index = new Map<string, ImageFolderEntry>();
  if (fs.existsSync(productImagesRoot)) {
    walkAndIndexImages(productImagesRoot, '/products', index);
  }
  imageIndexCache = index;
  return index;
}

export function getProductImages(productSlug: string): string[] {
  const entry = getImageIndex().get(productSlug);
  if (!entry) return [];

  const images: string[] = [];
  const coverFile = IMAGE_EXTENSIONS.map((ext) => `cover.${ext}`).find((f) => entry.files.has(f));
  if (coverFile) images.push(`${entry.webPath}/${coverFile}`);
  for (let i = 1; i <= 8; i++) {
    const galleryFile = IMAGE_EXTENSIONS.map((ext) => `${i}.${ext}`).find((f) => entry.files.has(f));
    if (galleryFile) images.push(`${entry.webPath}/${galleryFile}`);
  }
  return images;
}

/**
 * Recursively fetches all JSON files in a directory
 */
function getAllJsonFiles(dirPath: string, arrayOfFiles: string[] = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllJsonFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.json')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

// The catalog is ~5,000 products across ~580 files and is read on every single product page
// during static export (once directly, once via generateMetadata) — re-parsing everything
// from disk each time made a full build effectively never finish. The data doesn't change
// within a single build/dev-server process, so it's safe to read it once and reuse it.
let productsCache: ProductGroup[] | null = null;

// Natural sort so zero-padded numeric codes ("01-03-01-002") order correctly, and stays
// correct even if some future code isn't zero-padded (e.g. "...-9" before "...-10").
const codeCollator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
function byCode(a: string, b: string): number {
  return codeCollator.compare(a, b);
}

/**
 * Reads all product JSON files and returns an array of product groups.
 * Each product's `images` array is populated from disk (see getProductImages) —
 * uploaded photos show up automatically without touching the JSON data.
 */
export function getAllProducts(): ProductGroup[] {
  if (productsCache) return productsCache;

  if (!fs.existsSync(productsDirectory)) {
    return [];
  }

  const files = getAllJsonFiles(productsDirectory);
  const groups: ProductGroup[] = [];

  for (const file of files) {
    try {
      const fileContents = fs.readFileSync(file, 'utf8');
      const group = JSON.parse(fileContents) as ProductGroup;
      group.products = group.products
        .map((product) => ({
          ...product,
          images: getProductImages(product.slug),
        }))
        // Sort by permanent code (falls back to slug/id) so products always display in
        // catalog-code order, e.g. "01-03-01-001" before "01-03-01-002", regardless of
        // the order they happen to appear in the source JSON.
        .sort((a, b) => byCode(a.code || a.slug || a.id, b.code || b.slug || b.id));
      groups.push(group);
    } catch (error) {
      console.error(`Error reading product file ${file}:`, error);
    }
  }

  // Sort groups themselves by id too, so sub-category sections and their product groups
  // appear in the same code order on the page.
  groups.sort((a, b) => byCode(a.id, b.id));

  productsCache = groups;
  return groups;
}

/**
 * Gets a single product by slug (its permanent numeric code, e.g. "01-01-01-002").
 * SKU is never used for routing — it's a display-only label that may change later.
 */
export function getProductBySlug(slug: string): Product | undefined {
  const allGroups = getAllProducts();
  for (const group of allGroups) {
    const product = group.products.find((p) => p.slug === slug);
    if (product) {
      return product;
    }
  }
  return undefined;
}
