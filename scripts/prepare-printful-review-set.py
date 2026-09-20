#!/usr/bin/env python3
"""Prepare transparent, print-sized review files without changing source artwork."""

from __future__ import annotations

import json
from collections import deque
from pathlib import Path

from PIL import Image, ImageCms


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "output" / "printful-upload" / "v2-design"
OUTPUT_DIR = ROOT / "output" / "printful-review" / "v2-design-4500x5400-300dpi"
CANVAS = (4500, 5400)
MAX_ART = (4400, 5300)
MARGIN = 50


def remove_checkerboard(image: Image.Image) -> Image.Image:
    """Remove a light grayscale checkerboard connected to the image edge."""
    rgb = image.convert("RGB")
    width, height = rgb.size
    pixels = rgb.load()
    candidate = bytearray(width * height)

    for y in range(height):
        for x in range(width):
            r, g, b = pixels[x, y]
            value = (r + g + b) // 3
            if max(r, g, b) - min(r, g, b) <= 4 and 232 <= value <= 255:
                candidate[y * width + x] = 1

    background = bytearray(width * height)
    queue: deque[tuple[int, int]] = deque()

    for x in range(width):
        if candidate[x]:
            queue.append((x, 0))
        if candidate[(height - 1) * width + x]:
            queue.append((x, height - 1))
    for y in range(height):
        if candidate[y * width]:
            queue.append((0, y))
        if candidate[y * width + width - 1]:
            queue.append((width - 1, y))

    while queue:
        x, y = queue.popleft()
        index = y * width + x
        if background[index]:
            continue
        background[index] = 1
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < width and 0 <= ny < height:
                neighbor = ny * width + nx
                if candidate[neighbor] and not background[neighbor]:
                    queue.append((nx, ny))

    alpha = Image.new("L", (width, height), 255)
    alpha_pixels = alpha.load()
    for index, is_background in enumerate(background):
        if is_background:
            alpha_pixels[index % width, index // width] = 0

    rgba = rgb.convert("RGBA")
    rgba.putalpha(alpha)
    return rgba


def trim_transparent(image: Image.Image) -> Image.Image:
    bbox = image.getchannel("A").getbbox()
    if bbox is None:
        raise ValueError("image has no visible pixels")
    return image.crop(bbox)


def prepare(source: Path, destination: Path, s_rgb: bytes) -> dict:
    image = Image.open(source)
    if image.mode != "RGBA":
        image = remove_checkerboard(image)
    else:
        image = image.copy()

    image = trim_transparent(image)
    target_width, target_height = MAX_ART
    scale = min(target_width / image.width, target_height / image.height)
    resized = image.resize(
        (round(image.width * scale), round(image.height * scale)),
        Image.Resampling.LANCZOS,
    )

    canvas = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
    x = (CANVAS[0] - resized.width) // 2
    y = (CANVAS[1] - resized.height) // 2
    canvas.alpha_composite(resized, (x, y))
    canvas.save(destination, format="PNG", dpi=(300, 300), icc_profile=s_rgb)

    alpha_bbox = canvas.getchannel("A").getbbox()
    if alpha_bbox is None:
        raise ValueError(f"{source.name}: output has no visible pixels")
    return {
        "file": destination.name,
        "source": source.name,
        "pixel_dimensions": list(CANVAS),
        "dpi": [300, 300],
        "mode": canvas.mode,
        "alpha": True,
        "visible_bounds": list(alpha_bbox),
        "maximum_print_size_inches_at_300_dpi": [15, 18],
        "suggested_garment_coverage": "front chest, centered; keep within the standard 15 x 18 in print area",
    }


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    s_rgb = ImageCms.ImageCmsProfile(ImageCms.createProfile("sRGB")).tobytes()
    records = []
    for source in sorted(SOURCE_DIR.glob("*.png")):
        destination = OUTPUT_DIR / source.name
        records.append(prepare(source, destination, s_rgb))

    manifest = {
        "set": "v2 design review set",
        "canvas": "4500 x 5400 px",
        "resolution": "300 DPI",
        "format": "PNG RGBA with true transparency",
        "source_count": len(records),
        "files": records,
    }
    (OUTPUT_DIR / "review-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    print(f"Prepared {len(records)} review files in {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
