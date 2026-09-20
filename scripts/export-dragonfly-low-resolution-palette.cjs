const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const sourceDir = path.join(root, 'public/brand/printful/dragonfly-wing-cleanup-v3');
const outputDir = path.join(sourceDir, 'palette');

async function main() {
  const source = await fs.readFile(path.join(sourceDir, 'dragonfly-wing-cleanup-white.svg'), 'utf8');
  const approved = await sharp(path.join(sourceDir, 'dragonfly-wing-cleanup-white.png'))
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const palette = JSON.parse(await fs.readFile(path.join(root, '.qa/printful/logo-palette/palette.json'), 'utf8'));
  assert.equal(palette.length, 8);
  assert.equal((source.match(/#ffffff/g) || []).length, 3);
  const results = [];
  await fs.mkdir(outputDir, { recursive: true });

  for (const color of palette) {
    assert.match(color.hex, /^#[0-9a-f]{6}$/);
    const png = color.png.replace('-logo-', '-dragonfly-low-resolution-');
    const svg = png.replace(/\.png$/, '.svg');
    // Preserve the approved geometry and the mask's named black/white colors.
    const artwork = source.replaceAll('#ffffff', color.hex);
    assert.equal(artwork.replaceAll(color.hex, '#ffffff'), source);
    await fs.writeFile(path.join(outputDir, svg), artwork);
    const rgb = [1, 3, 5].map(offset => parseInt(color.hex.slice(offset, offset + 2), 16));
    const pixels = Buffer.from(approved.data);
    // Reuse the approved alpha plane to avoid color rounding from SVG compositing.
    for (let i = 0; i < pixels.length; i += 4) {
      for (let channel = 0; channel < 3; channel++) {
        pixels[i + channel] = pixels[i + 3] === 0 ? 0 : rgb[channel];
      }
    }
    await sharp(pixels, { raw: {
      width: approved.info.width, height: approved.info.height, channels: 4,
    } }).withMetadata({ density: 300 }).png()
      .toFile(path.join(outputDir, png));

    const file = path.join(outputDir, png);
    const metadata = await sharp(file).metadata();
    const rendered = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    assert.equal(metadata.width, 2400);
    assert.equal(metadata.height, 1463);
    assert.equal(metadata.density, 300);
    assert.equal(metadata.hasAlpha, true);
    assert.deepEqual(rendered.info, approved.info);
    let opaquePixels = 0;
    for (let i = 0; i < rendered.data.length; i += 4) {
      assert.equal(rendered.data[i + 3], approved.data[i + 3], `${color.name}: alpha changed at ${i / 4}`);
      if (rendered.data[i + 3] === 255) {
        opaquePixels++;
        for (let channel = 0; channel < 3; channel++) {
          assert.equal(rendered.data[i + channel], rgb[channel], `${color.name}: incorrect opaque color`);
        }
      }
    }
    assert.ok(opaquePixels > 0);
    results.push({
      name: color.name, hex: color.hex, png, svg,
      width: metadata.width, height: metadata.height, dpi: metadata.density,
      alphaIdenticalToApproved: true, opaqueColorVerified: true,
      sha256: crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex'),
    });
  }
  await fs.writeFile(path.join(outputDir, 'manifest.json'), JSON.stringify({
    source: 'public/brand/printful/dragonfly-wing-cleanup-v3/dragonfly-wing-cleanup-white.svg',
    note: 'Low Resolution is the Printful folder name for simplified detail, not reduced pixel resolution. Approved geometry and canvas retained. Not embroidery-digitization tested.',
    colors: results,
  }, null, 2) + '\n');
  const previews = [];
  for (let i = 0; i < results.length; i++) {
    const color = results[i];
    const darkBackground = color.name === 'White' || color.name === 'Warm Cream';
    const background = darkBackground ? '#252a27' : '#f5f0e8';
    const labelColor = darkBackground ? '#f5f0e8' : '#252a27';
    const label = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="550" height="40"><text x="20" y="28" font-family="sans-serif" font-size="18" fill="${labelColor}">${color.name} ${color.hex}</text></svg>`);
    const thumbnail = await sharp(path.join(outputDir, color.png)).resize({ width: 500 }).png().toBuffer();
    const tile = await sharp({ create: { width: 550, height: 370, channels: 4, background } })
      .composite([{ input: label, top: 5, left: 0 }, { input: thumbnail, top: 55, left: 25 }])
      .png().toBuffer();
    previews.push({ input: tile, left: (i % 2) * 550, top: Math.floor(i / 2) * 370 });
  }
  await sharp({ create: { width: 1100, height: 1480, channels: 4, background: '#ffffff' } })
    .composite(previews).png().toFile(path.join(outputDir, 'palette-preview.png'));
  console.log(JSON.stringify({ outputDir, verifiedColors: results }, null, 2));
}

main().catch(error => { console.error(error); process.exitCode = 1; });
