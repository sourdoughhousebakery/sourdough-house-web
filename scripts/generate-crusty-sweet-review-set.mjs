import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OUT_DIR = path.join(
  process.cwd(),
  "public",
  "brand",
  "printful",
  "sayings-review",
  "a-little-crusty-mostly-sweet"
);

const W = 4500;
const H = 5400;

const colors = {
  espresso: "#2E1F1A",
  cream: "#F7E7C6",
  rust: "#C96E42",
  honey: "#D9A441",
  sage: "#5C7A5B",
  ink: "#1F1B1A"
};

const esc = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const textLayers = ({
  x,
  y,
  text,
  family,
  size,
  fill,
  stroke = colors.espresso,
  strokeWidth = 26,
  letterSpacing = 0,
  weight = 700,
  italic = false,
  transform = "",
  opacity = 1
}) => {
  const style = [
    `font-family:${family}`,
    `font-size:${size}px`,
    `font-weight:${weight}`,
    `fill:${fill}`,
    `stroke:${stroke}`,
    `stroke-width:${strokeWidth}px`,
    `letter-spacing:${letterSpacing}px`,
    `paint-order:stroke fill`,
    `dominant-baseline:middle`,
    `text-anchor:middle`,
    `opacity:${opacity}`,
    italic ? "font-style:italic" : ""
  ]
    .filter(Boolean)
    .join(";");

  return `
    <text x="${x}" y="${y}" style='${style}' transform="${transform}">${esc(text)}</text>
  `;
};

const borderRect = ({ x, y, width, height, radius = 90, stroke = colors.espresso, strokeWidth = 18 }) => `
  <rect
    x="${x}"
    y="${y}"
    width="${width}"
    height="${height}"
    rx="${radius}"
    ry="${radius}"
    fill="none"
    stroke="${stroke}"
    stroke-width="${strokeWidth}"
  />
`;

const line = ({ x1, y1, x2, y2, stroke = colors.espresso, strokeWidth = 12 }) => `
  <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" />
`;

const diamond = ({ cx, cy, size = 24, fill = colors.rust }) => `
  <path d="M ${cx} ${cy - size} L ${cx + size} ${cy} L ${cx} ${cy + size} L ${cx - size} ${cy} Z" fill="${fill}" />
`;

const outerFrame = () => `
  ${borderRect({ x: 240, y: 240, width: 4020, height: 4920, radius: 84, strokeWidth: 18 })}
  ${borderRect({ x: 320, y: 320, width: 3860, height: 4760, radius: 58, strokeWidth: 8, stroke: colors.cream })}
`;

const variantOne = () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="A Little Crusty Mostly Sweet variant one">
  ${outerFrame()}
  ${textLayers({
    x: 2250,
    y: 770,
    text: "A LITTLE",
    family: '"Avenir Next Condensed", "Arial Narrow", sans-serif',
    size: 260,
    fill: colors.rust,
    stroke: colors.cream,
    strokeWidth: 22,
    letterSpacing: 30,
    weight: 800
  })}
  ${line({ x1: 1130, y1: 1040, x2: 3370, y2: 1040, strokeWidth: 14, stroke: colors.espresso })}
  ${textLayers({
    x: 2250,
    y: 2320,
    text: "CRUSTY",
    family: '"Avenir Next Condensed", "Arial Narrow", sans-serif',
    size: 930,
    fill: colors.cream,
    stroke: colors.espresso,
    strokeWidth: 34,
    letterSpacing: 10,
    weight: 900
  })}
  ${textLayers({
    x: 2250,
    y: 3300,
    text: "MOSTLY",
    family: '"Avenir Next Condensed", "Arial Narrow", sans-serif',
    size: 280,
    fill: colors.sage,
    stroke: colors.cream,
    strokeWidth: 20,
    letterSpacing: 24,
    weight: 800
  })}
  ${textLayers({
    x: 2250,
    y: 4330,
    text: "SWEET",
    family: '"Brush Script MT", "Snell Roundhand", cursive',
    size: 860,
    fill: colors.honey,
    stroke: colors.espresso,
    strokeWidth: 20,
    italic: true,
    weight: 700,
    transform: "rotate(-2 2250 4330)"
  })}
  ${line({ x1: 1450, y1: 4670, x2: 3050, y2: 4670, strokeWidth: 10, stroke: colors.rust })}
</svg>
`;

const variantTwo = () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="A Little Crusty Mostly Sweet variant two">
  <ellipse cx="2250" cy="2700" rx="1840" ry="2380" fill="none" stroke="${colors.espresso}" stroke-width="18" />
  <ellipse cx="2250" cy="2700" rx="1760" ry="2300" fill="none" stroke="${colors.cream}" stroke-width="8" />
  ${diamond({ cx: 2250, cy: 400, size: 28, fill: colors.rust })}
  ${diamond({ cx: 2250, cy: 5000, size: 28, fill: colors.rust })}
  ${diamond({ cx: 700, cy: 2700, size: 24, fill: colors.honey })}
  ${diamond({ cx: 3800, cy: 2700, size: 24, fill: colors.honey })}
  ${textLayers({
    x: 2250,
    y: 1150,
    text: "A LITTLE",
    family: '"Avenir Next Condensed", "Arial Narrow", sans-serif',
    size: 240,
    fill: colors.honey,
    stroke: colors.espresso,
    strokeWidth: 20,
    letterSpacing: 34,
    weight: 800
  })}
  ${line({ x1: 1450, y1: 1450, x2: 3050, y2: 1450, strokeWidth: 14, stroke: colors.rust })}
  ${textLayers({
    x: 2250,
    y: 2480,
    text: "CRUSTY",
    family: '"Baskerville", Georgia, serif',
    size: 980,
    fill: colors.sage,
    stroke: colors.espresso,
    strokeWidth: 30,
    weight: 700,
    italic: false
  })}
  ${textLayers({
    x: 2250,
    y: 3520,
    text: "MOSTLY",
    family: '"Avenir Next Condensed", "Arial Narrow", sans-serif',
    size: 250,
    fill: colors.cream,
    stroke: colors.espresso,
    strokeWidth: 18,
    letterSpacing: 20,
    weight: 800
  })}
  ${textLayers({
    x: 2250,
    y: 4300,
    text: "SWEET",
    family: '"Brush Script MT", "Snell Roundhand", cursive',
    size: 780,
    fill: colors.rust,
    stroke: colors.cream,
    strokeWidth: 18,
    italic: true,
    weight: 700,
    transform: "rotate(1 2250 4300)"
  })}
</svg>
`;

const variantThree = () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="A Little Crusty Mostly Sweet variant three">
  ${borderRect({ x: 260, y: 260, width: 3980, height: 4880, radius: 28, strokeWidth: 16, stroke: colors.espresso })}
  ${borderRect({ x: 340, y: 340, width: 3820, height: 4720, radius: 20, strokeWidth: 8, stroke: colors.cream })}
  ${line({ x1: 710, y1: 1120, x2: 1260, y2: 1120, strokeWidth: 14, stroke: colors.rust })}
  ${line({ x1: 3240, y1: 1120, x2: 3790, y2: 1120, strokeWidth: 14, stroke: colors.rust })}
  ${textLayers({
    x: 710,
    y: 820,
    text: "A LITTLE",
    family: '"Avenir Next Condensed", "Arial Narrow", sans-serif',
    size: 220,
    fill: colors.cream,
    stroke: colors.espresso,
    strokeWidth: 20,
    letterSpacing: 26,
    weight: 800
  })}
  ${textLayers({
    x: 2520,
    y: 2230,
    text: "CRUSTY",
    family: '"Baskerville", Georgia, serif',
    size: 1000,
    fill: colors.cream,
    stroke: colors.espresso,
    strokeWidth: 34,
    weight: 700,
    transform: "skewX(-2)"
  })}
  ${textLayers({
    x: 1300,
    y: 3050,
    text: "MOSTLY",
    family: '"Avenir Next Condensed", "Arial Narrow", sans-serif',
    size: 270,
    fill: colors.rust,
    stroke: colors.cream,
    strokeWidth: 20,
    letterSpacing: 22,
    weight: 800
  })}
  ${line({ x1: 1160, y1: 3370, x2: 3340, y2: 3370, strokeWidth: 10, stroke: colors.espresso })}
  ${textLayers({
    x: 2510,
    y: 3950,
    text: "SWEET",
    family: '"Brush Script MT", "Snell Roundhand", cursive',
    size: 740,
    fill: colors.sage,
    stroke: colors.espresso,
    strokeWidth: 20,
    italic: true,
    weight: 700,
    transform: "rotate(-1 2510 3950)"
  })}
  ${textLayers({
    x: 1840,
    y: 4050,
    text: "mostly",
    family: '"Baskerville", Georgia, serif',
    size: 170,
    fill: colors.cream,
    stroke: colors.espresso,
    strokeWidth: 12,
    letterSpacing: 8,
    weight: 700
  })}
</svg>
`;

const variants = [
  {
    slug: "01-badge",
    label: "badge",
    svg: variantOne()
  },
  {
    slug: "02-oval",
    label: "oval",
    svg: variantTwo()
  },
  {
    slug: "03-editorial",
    label: "editorial",
    svg: variantThree()
  }
];

const main = async () => {
  await fs.mkdir(OUT_DIR, { recursive: true });

  for (const variant of variants) {
    const baseName = `a-little-crusty-mostly-sweet-${variant.slug}`;
    const svgPath = path.join(OUT_DIR, `${baseName}.svg`);
    const pngPath = path.join(OUT_DIR, `${baseName}.png`);

    await fs.writeFile(svgPath, variant.svg, "utf8");
    await sharp(Buffer.from(variant.svg))
      .png({ compressionLevel: 9, adaptiveFiltering: true, effort: 6 })
      .toFile(pngPath);
    console.log(`${variant.label}: ${svgPath}`);
    console.log(`${variant.label}: ${pngPath}`);
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
