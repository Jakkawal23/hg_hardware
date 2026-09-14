// Generates docs/product-image-lookup.csv — a spreadsheet listing every product,
// grouped/sorted by category (main > sub > group), with the exact folder path
// (under public/products/) to drop real photos into.
//
// This is a *reference* for humans matching real photos to products — it does not
// change how the site loads images. The actual image system (nested
// public/products/<main>/<sub>/<group>/<slug>/ folders, pre-created and auto-scanned)
// is documented in docs/product-images.md and implemented in src/lib/products.ts
// (getProductImages). Re-run this script any time product data changes to keep the
// lookup file in sync.
//
// Usage: node scripts/generate-product-image-lookup.js

const fs = require('fs');
const path = require('path');

const productsDir = path.join(__dirname, '../src/data/products');
const categoriesPath = path.join(__dirname, '../src/data/categories.json');
const outPath = path.join(__dirname, '../docs/product-image-lookup.csv');

const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));

// Build lookup maps: main category slug -> names, and "main|sub" -> sub-category names
const mainCatNames = new Map();
const subCatNames = new Map();
for (const cat of categories) {
  mainCatNames.set(cat.slug, { th: cat.name_th, cn: cat.name_cn });
  for (const sub of cat.sub_categories || []) {
    subCatNames.set(`${cat.slug}|${sub.slug}`, { th: sub.name_th, cn: sub.name_cn });
  }
}

function getAllJsonFiles(dirPath, arrayOfFiles = []) {
  for (const file of fs.readdirSync(dirPath)) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllJsonFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.json')) {
      arrayOfFiles.push(fullPath);
    }
  }
  return arrayOfFiles;
}

// Natural sort so zero-padded numeric codes ("01-03-01-002") order correctly —
// mirrors byCode() in src/lib/products.ts so this file reads in the same order
// products/categories appear on the actual website.
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

const rows = [];
for (const file of getAllJsonFiles(productsDir)) {
  const group = JSON.parse(fs.readFileSync(file, 'utf8'));
  const mainNames = mainCatNames.get(group.main_category_slug) || { th: '', cn: '' };
  const subNames = subCatNames.get(`${group.main_category_slug}|${group.sub_category_slug}`) || { th: '', cn: '' };

  for (const product of group.products || []) {
    rows.push({
      main_category_th: mainNames.th,
      main_category_cn: mainNames.cn,
      sub_category_th: subNames.th,
      sub_category_cn: subNames.cn,
      group_name_th: group.name_th || '',
      product_name_th: product.name_th || '',
      product_name_cn: product.name_cn || '',
      sku: product.sku || '',
      slug: product.slug,
      image_folder: `public/products/${group.main_category_slug}/${group.sub_category_slug}/${group.id}/${product.slug}/`,
    });
  }
}

rows.sort((a, b) => collator.compare(a.slug, b.slug));

const headers = [
  'หมวดหมู่หลัก (TH)',
  'หมวดหมู่หลัก (CN)',
  'หมวดหมู่ย่อย (TH)',
  'หมวดหมู่ย่อย (CN)',
  'กลุ่มสินค้า (TH)',
  'ชื่อสินค้า (TH)',
  'ชื่อสินค้า (CN)',
  'SKU',
  'Slug (รหัสสินค้า)',
  'โฟลเดอร์ที่ต้องวางรูป',
];

function csvEscape(value) {
  const str = String(value ?? '');
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

const lines = [headers.map(csvEscape).join(',')];
for (const row of rows) {
  lines.push(
    [
      row.main_category_th,
      row.main_category_cn,
      row.sub_category_th,
      row.sub_category_cn,
      row.group_name_th,
      row.product_name_th,
      row.product_name_cn,
      row.sku,
      row.slug,
      row.image_folder,
    ]
      .map(csvEscape)
      .join(',')
  );
}

// UTF-8 BOM so Excel on Windows renders Thai/Chinese text correctly instead of mojibake.
fs.writeFileSync(outPath, '﻿' + lines.join('\r\n') + '\r\n', 'utf8');

console.log(`Wrote ${rows.length} products to ${outPath}`);
