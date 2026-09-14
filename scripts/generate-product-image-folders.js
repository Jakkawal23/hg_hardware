// Pre-creates the full product image folder skeleton under public/products/, mirroring
// src/data/products/<main>/<sub>/<group>.json one level deeper, down to a folder per product:
//
//   public/products/<main_category_slug>/<sub_category_slug>/<group_id>/<product_slug>/
//
// Each leaf folder starts out empty except for a .gitkeep (so git tracks it). Drop
// cover.jpg (+ optional 1.jpg..8.jpg) into the right leaf folder and it appears on the
// site automatically — see docs/product-images.md. Re-run this script any time products
// are added/removed in src/data/products/ to keep the folder skeleton in sync (it only
// ever adds missing folders; it never deletes existing ones, so real photos are safe).
//
// Usage: node scripts/generate-product-image-folders.js

const fs = require('fs');
const path = require('path');

const productsDir = path.join(__dirname, '../src/data/products');
const imagesRoot = path.join(__dirname, '../public/products');

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

let foldersCreated = 0;
let foldersAlreadyExisted = 0;
let productCount = 0;

for (const file of getAllJsonFiles(productsDir)) {
  const group = JSON.parse(fs.readFileSync(file, 'utf8'));
  const { main_category_slug, sub_category_slug, id: groupId } = group;

  for (const product of group.products || []) {
    productCount++;
    const folderPath = path.join(imagesRoot, main_category_slug, sub_category_slug, groupId, product.slug);
    const alreadyExisted = fs.existsSync(folderPath);

    fs.mkdirSync(folderPath, { recursive: true });

    const gitkeepPath = path.join(folderPath, '.gitkeep');
    if (!fs.existsSync(gitkeepPath)) {
      fs.writeFileSync(gitkeepPath, '');
    }

    if (alreadyExisted) {
      foldersAlreadyExisted++;
    } else {
      foldersCreated++;
    }
  }
}

console.log(`Products scanned: ${productCount}`);
console.log(`Folders created: ${foldersCreated}`);
console.log(`Folders already existed: ${foldersAlreadyExisted}`);
