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
// Convention: public/products/<product-slug>/cover.{jpg|jpeg|png|webp}  (1 cover image)
//             public/products/<product-slug>/1.{ext} .. 8.{ext}         (up to 8 gallery images)
// A product's slug is its permanent numeric code (e.g. "01-01-01-002"), so images survive
// any future SKU/name changes. Drop files in following this naming and they appear automatically
// — no code or data changes needed. See docs/product-images.md for details.
//
// With ~5,000 products, checking every extension on disk per product (fs.existsSync in a loop)
// is far too slow for a full static export (thousands of pages x dozens of stat calls each).
// Instead we read the (usually near-empty) image directory ONCE, into an in-memory index, and
// look products up in that — O(uploaded image folders) instead of O(products x extensions).
const productImagesDirectory = path.join(process.cwd(), 'public/products');
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

let imageIndexCache: Map<string, Set<string>> | null = null;

function getImageIndex(): Map<string, Set<string>> {
  if (imageIndexCache) return imageIndexCache;
  const index = new Map<string, Set<string>>();
  if (fs.existsSync(productImagesDirectory)) {
    for (const entry of fs.readdirSync(productImagesDirectory, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const files = fs.readdirSync(path.join(productImagesDirectory, entry.name));
      index.set(entry.name, new Set(files));
    }
  }
  imageIndexCache = index;
  return index;
}

export function getProductImages(productSlug: string): string[] {
  const files = getImageIndex().get(productSlug);
  if (!files) return [];

  const images: string[] = [];
  const coverFile = IMAGE_EXTENSIONS.map((ext) => `cover.${ext}`).find((f) => files.has(f));
  if (coverFile) images.push(`/products/${productSlug}/${coverFile}`);
  for (let i = 1; i <= 8; i++) {
    const galleryFile = IMAGE_EXTENSIONS.map((ext) => `${i}.${ext}`).find((f) => files.has(f));
    if (galleryFile) images.push(`/products/${productSlug}/${galleryFile}`);
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
      group.products = group.products.map((product) => ({
        ...product,
        images: getProductImages(product.slug),
      }));
      groups.push(group);
    } catch (error) {
      console.error(`Error reading product file ${file}:`, error);
    }
  }

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
