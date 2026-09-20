const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

const projectRoot = path.resolve(__dirname, '..');
const sourcePath = path.join(projectRoot, 'public/brand/logo-text.svg');
const outputDir = path.join(projectRoot, 'public/brand/printful/name-only-palette');

const colors = [
  ['01', 'signature-brown', 'Signature Brown', '#5a4639', 'Light backgrounds'],
  ['02', 'black', 'Black', '#000000', 'Light backgrounds'],
  ['03', 'white', 'White', '#ffffff', 'Dark backgrounds'],
  ['04', 'warm-cream', 'Warm Cream', '#fff7ea', 'Dark backgrounds'],
  ['05', 'sage', 'Sage', '#647f4f', 'Light backgrounds'],
  ['06', 'rust', 'Rust', '#bd553d', 'Light backgrounds'],
  ['07', 'honey-gold', 'Honey Gold', '#e6a33a', 'Light backgrounds'],
  ['08', 'sky-blue', 'Sky Blue', '#5f93b5', 'Light backgrounds'],
];

const sizes = [
  ['large', 3000],
  ['small', 1500],
];

function setSvgSize(source, width) {
  const height = (width * 114) / 210;
  return source
    .replace('width="210mm"', `width="${width}px"`)
    .replace('height="114mm"', `height="${height.toFixed(2)}px"`);
}

async function main() {
  const source = await fs.readFile(sourcePath, 'utf8');
  if (!source.includes('viewBox="0 0 210 114"')) throw new Error('Unexpected source viewBox');
  if ((source.match(/#39271b/gi) || []).length !== 1) throw new Error('Unexpected source fill');

  await fs.mkdir(outputDir, { recursive: true });
  const manifest = [];

  for (const [sizeName, width] of sizes) {
    for (const [number, slug, name, hex, background] of colors) {
      const stem = `${number}-sourdough-house-name-only-${slug}-${sizeName}`;
      const svg = setSvgSize(source.replace('#39271b', hex), width);
      const svgPath = path.join(outputDir, `${stem}.svg`);
      const pngPath = path.join(outputDir, `${stem}.png`);
      await fs.writeFile(svgPath, svg);
      const png = await sharp(Buffer.from(svg)).withMetadata({ density: 300 }).png().toBuffer();
      await fs.writeFile(pngPath, png);
      const metadata = await sharp(png).metadata();
      manifest.push({
        colorNumber: number,
        color: name,
        hex,
        size: sizeName,
        nominalWidth: width,
        width: metadata.width,
        height: metadata.height,
        background,
        svg: `${stem}.svg`,
        png: `${stem}.png`,
      });
    }
  }

  await fs.writeFile(path.join(outputDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  await fs.writeFile(path.join(outputDir, 'README.md'), `# Name-Only Logo Palette

Generated from [logo-text.svg](../../logo-text.svg), the existing stacked Sourdough House Bakery name-only vector.

## Contents

- 8 colors: signature brown, black, white, warm cream, sage, rust, honey gold, and sky blue.
- 2 sizes: large (3000px nominal width) and small (1500px nominal width).
- Each size/color has an SVG master and a transparent PNG preview tagged at 300 DPI.

The SVGs preserve the source viewBox and geometry. The PNGs use the same aspect ratio and transparent padding so they can be tested consistently in Printful. Choose the color based on the product surface; use white or warm cream on dark products and avoid low-contrast combinations.

This folder is a design library. Upload or connect a specific asset to Printful only after checking the product's print area and mockup.
`);

  console.log(JSON.stringify({ outputDir, files: manifest.length * 2 + 2, manifest }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
