import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SHIRT_BACKGROUNDS = [
  { suffix: "white", color: "#FFFFFF" },
  { suffix: "black", color: "#000000" },
  { suffix: "gray", color: "#8A8A8A" }
];

async function makePreviews(inputPath) {
  const absoluteInput = path.resolve(inputPath);
  const source = sharp(absoluteInput).ensureAlpha();
  const meta = await source.metadata();

  if (!meta.width || !meta.height) {
    throw new Error(`Could not read dimensions for ${absoluteInput}`);
  }

  const parsed = path.parse(absoluteInput);
  const outDir = parsed.dir;

  for (const background of SHIRT_BACKGROUNDS) {
    const outPath = path.join(outDir, `${parsed.name}-${background.suffix}.png`);

    await sharp({
      create: {
        width: meta.width,
        height: meta.height,
        channels: 4,
        background: background.color
      }
    })
      .composite([{ input: await source.png().toBuffer(), left: 0, top: 0 }])
      .png({ compressionLevel: 9, adaptiveFiltering: true, effort: 6 })
      .toFile(outPath);

    console.log(outPath);
  }
}

async function main() {
  const inputs = process.argv.slice(2);
  if (inputs.length === 0) {
    throw new Error("Usage: node scripts/make-shirt-background-previews.mjs <transparent-png> [...more pngs]");
  }

  for (const input of inputs) {
    await makePreviews(input);
  }
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exitCode = 1;
});
