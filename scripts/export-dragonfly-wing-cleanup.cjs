const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');
const { pathParts } = require('./dragonfly-path-parts.cjs');

const outputDir = path.resolve(__dirname, '../public/brand/printful/dragonfly-wing-cleanup-v3');
const format = n => Number(n.toFixed(8));
const svgRoot = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 128" width="2400" height="1463">';

async function main() {
  const source = await fs.readFile(path.resolve(__dirname, '../public/brand/logo-dragonfly.svg'), 'utf8');
  const parts = pathParts(source);
  const originalD = source.match(/\sd="([^"]+)"/)[1];
  const outer = parts[0];
  function perimeter(from, to) {
    const start = outer.segments[from - 1].values.slice(-2);
    return `M ${start.map(format).join(' ')} ` + outer.segments.slice(from, to + 1)
      .map(s => s.command + s.values.map(format).join(' ')).join(' ');
  }
  // Each region follows the original exterior Beziers, ending before the body.
  const wings = [
    perimeter(9, 29) + ' C98 29 99.1 35.5 98.2 40.1 C98 47 99.2 54 98.048588 60.581586 Z',
    perimeter(73, 93) + ' C109.5 53.5 110.3 46.3 111.2 40.1 C110.7 34.5 112 30 114.01 28.36 Z',
  ];
  const wingPaths = wings.map(d => `<path d="${d}"/>`).join('\n');
  const veins = [
    'M98 34.8 C85 31 80 25.2 67 23.1 C46 19.7 26 7.4 8 9.1',
    'M69 23.5 C56 24 44 30 32 34.1',
    'M44 16 C33 17.4 26 22.1 19.1 27.1',
    'M111.8 34.8 C125 31 131 25.2 143.5 23.1 C164 19.7 184 7.1 202.3 9.1',
    'M141 23.5 C154 24 166 30 178.5 34.3',
    'M166 16 C177 17.4 184 22.1 190.4 26.9',
    'M98 41.7 C87 48.2 67 46.8 49 49 C31 51.2 20 54.8 11.2 60.5',
    'M82 47 C65 55 49 64 39.5 74',
    'M93.5 43.8 C88.1 55 79.8 67 70.5 76.3',
    'M111.5 41.7 C123 48.2 143 46.8 161 49 C179 51.2 190 54.8 198.3 60.5',
    'M128 47 C145 55 161 64 170.5 74',
    'M116.5 43.8 C121.9 55 130.2 67 139.5 76.3',
  ];
  const svg = `${svgRoot}
<title>Sourdough House original dragonfly with simplified wing interiors</title>
<defs>
  <clipPath id="original-silhouette"><path d="${outer.raw}"/></clipPath>
  <clipPath id="wing-regions">${wingPaths}</clipPath>
  <mask id="retain-original" maskUnits="userSpaceOnUse" x="0" y="0" width="210" height="128">
    <rect width="210" height="128" fill="white"/><g fill="black">${wingPaths}</g>
  </mask>
</defs>
<g fill="#ffffff">
  <path id="unchanged-original" d="${originalD}" mask="url(#retain-original)"/>
  <g clip-path="url(#original-silhouette)"><g clip-path="url(#wing-regions)">
    <path d="${outer.raw}" fill="none" stroke="#ffffff" stroke-width="2.6"/>
    <g fill="none" stroke="#ffffff" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">
      ${veins.map(d => `<path d="${d}"/>`).join('\n')}
    </g>
  </g></g>
</g></svg>`;
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, 'dragonfly-wing-cleanup-white.svg'), svg);
  const brown = svg.replaceAll('#ffffff', '#5a4639');
  await fs.writeFile(path.join(outputDir, 'dragonfly-wing-cleanup-signature-brown.svg'), brown);
  for (const [name, content] of [['white', svg], ['signature-brown', brown]]) {
    await sharp(Buffer.from(content)).withMetadata({ density: 300 }).png()
      .toFile(path.join(outputDir, `dragonfly-wing-cleanup-${name}.png`));
  }

  const originalWhite = `${svgRoot}<path d="${originalD}" fill="#ffffff"/></svg>`;
  const original = await sharp(Buffer.from(originalWhite)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const edited = await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const regionSvg = `${svgRoot}<g fill="white">${wingPaths}</g></svg>`;
  const region = await sharp(Buffer.from(regionSvg)).ensureAlpha().raw().toBuffer();
  let outsideChanges = 0, changedPixels = 0, exteriorAdditions = 0, boundaryAntialiasPixels = 0, bodyChanges = 0;
  for (let i = 3; i < original.data.length; i += 4) {
    const delta = Math.abs(original.data[i] - edited.data[i]);
    if (delta > 2) {
      changedPixels++;
      if (region[i] === 0) {
        const pixel = (i - 3) / 4;
        const x = pixel % original.info.width, y = Math.floor(pixel / original.info.width);
        let neighbor = false;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          const n = ((y + dy) * original.info.width + x + dx) * 4 + 3;
          if (region[n] > 0) neighbor = true;
        }
        if (neighbor) boundaryAntialiasPixels++; else outsideChanges++;
      }
      const px = ((i - 3) / 4) % original.info.width;
      const py = Math.floor(((i - 3) / 4) / original.info.width);
      const ux = px * 210 / original.info.width, uy = py * 128 / original.info.height;
      if ((ux >= 99.5 && ux <= 109.4) || (uy < 24 && ux >= 88 && ux <= 121) || uy >= 78) bodyChanges++;
    }
    if (original.data[i] === 0 && edited.data[i] > 5 && region[i] === 0) exteriorAdditions++;
  }
  if (outsideChanges || exteriorAdditions || bodyChanges) throw new Error(`Outside wings: ${outsideChanges}; additions: ${exteriorAdditions}; body: ${bodyChanges}`);

  const originalPreview = await sharp(Buffer.from(originalWhite)).resize({ width: 610 }).png().toBuffer();
  const editedPreview = await sharp(Buffer.from(svg)).resize({ width: 610 }).png().toBuffer();
  const board = `<svg xmlns="http://www.w3.org/2000/svg" width="1340" height="545">
    <rect width="1340" height="545" fill="#202422"/>
    <g font-family="Helvetica, sans-serif" fill="#f6f3ec">
      <text x="40" y="45" font-size="24">Original</text>
      <text x="710" y="45" font-size="24">Wing interiors simplified</text>
      <image href="data:image/png;base64,${originalPreview.toString('base64')}" x="30" y="80" width="610" height="372"/>
      <image href="data:image/png;base64,${editedPreview.toString('base64')}" x="700" y="80" width="610" height="372"/>
      <text x="40" y="513" font-size="18">Original head, body, tail and exterior wing curves retained. Three veins per wing.</text>
    </g>
  </svg>`;
  await sharp(Buffer.from(board)).png().toFile(path.join(outputDir, 'original-vs-wing-cleanup.png'));
  await fs.writeFile(path.join(outputDir, 'verification.json'), JSON.stringify({
    source: 'public/brand/logo-dragonfly.svg', originalContours: parts.length,
    originalOuterContour: 'Unmodified Bezier geometry', outsideWingPixelsChanged: outsideChanges,
    boundaryAntialiasPixels, bodyPixelsChanged: bodyChanges, changedPixels, dimensions: [original.info.width, original.info.height],
    note: 'Design preview only; not tested in Printful embroidery digitization.'
  }, null, 2) + '\n');
  console.log(JSON.stringify({ outputDir, outsideChanges, changedPixels, dimensions: original.info }, null, 2));
}

main().catch(error => { console.error(error); process.exitCode = 1; });
