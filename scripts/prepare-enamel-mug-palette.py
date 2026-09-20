"""Prepare identical-position enamel mug print files from approved logo alpha.

Run only after authorization to use deterministic image processing.
The complete 8 x 2.4-inch print area is encoded in every PNG, eliminating
per-color dragging, transparent-padding differences, and rounding differences.
"""
from pathlib import Path
import hashlib
import json
from PIL import Image, ImageColor, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/brand/printful/alignment-v2-4500px-final/02-sourdough-house-logo-black-alignment-v2.png"
OUT = ROOT / "public/brand/printful/enamel-mug-aligned-v2"
MASTERS = ROOT / "public/brand/printful/full-logo-normalized-all-colors-v3"
COLORS = {"brown": "#5a4738", "black": "#000000", "white": "#ffffff", "warm-cream": "#fff7ea", "sage": "#637f4f", "rust": "#bd553d", "honey-gold": "#e6a33b", "blue": "#5f93b5"}
DPI = 600

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    MASTERS.mkdir(parents=True, exist_ok=True)
    source = Image.open(SOURCE).convert("RGBA")
    master_alpha = Image.new("L", (4590, 3926), 0)
    master_alpha.paste(source.getchannel("A"), (45, 45))
    master_hash = hashlib.sha256(master_alpha.tobytes()).hexdigest()
    logo_alpha = source.getchannel("A").resize((1224, 1043), Image.Resampling.LANCZOS)
    alpha = Image.new("L", (4800, 1440), 0)
    alpha.paste(logo_alpha, (3288, 271))
    expected_hash = hashlib.sha256(alpha.tobytes()).hexdigest()
    manifest = []
    master_manifest = []
    review = Image.new("RGB", (1010, 740), "#f4f1eb")
    draw = ImageDraw.Draw(review)
    for i, (name, color) in enumerate(COLORS.items()):
        master = Image.new("RGBA", master_alpha.size, ImageColor.getrgb(color) + (0,))
        master.putalpha(master_alpha)
        master_name = f"shb-full-logo-{name}-normalized-v3.png"
        master.save(MASTERS / master_name, dpi=(300, 300))
        check_master = Image.open(MASTERS / master_name).convert("RGBA")
        assert hashlib.sha256(check_master.getchannel("A").tobytes()).hexdigest() == master_hash
        master_manifest.append({"color": name, "hex": color, "file": master_name, "pixels": list(master.size), "dpi": 300, "max_canvas_inches_at_300dpi": [15.3, 3926/300], "visible_art_inches_at_300dpi": [15, 3836/300], "alpha_bounds": list(master_alpha.getbbox()), "alpha_sha256": master_hash, "transparent_margin_px": 45})
        im = Image.new("RGBA", alpha.size, ImageColor.getrgb(color) + (0,))
        im.putalpha(alpha)
        filename = f"shb-enamel-mug-{name}-aligned-v2-600dpi.png"
        im.save(OUT / filename, dpi=(DPI, DPI))
        check = Image.open(OUT / filename).convert("RGBA")
        assert hashlib.sha256(check.getchannel("A").tobytes()).hexdigest() == expected_hash
        manifest.append({"color": name, "hex": color, "file": filename, "pixels": list(im.size), "dpi": DPI, "print_inches": [8, 2.4], "logo_pixels": [1224, 1043], "logo_top_left_pixels": [3288, 271], "alpha_bounds": list(alpha.getbbox()), "alpha_sha256": expected_hash})
        tile = Image.new("RGBA", (232, 260), "#292727" if name in ("white", "warm-cream") else "white")
        logo = Image.new("RGBA", logo_alpha.size, ImageColor.getrgb(color) + (0,))
        logo.putalpha(logo_alpha)
        logo.thumbnail((204, 174), Image.Resampling.LANCZOS)
        tile.alpha_composite(logo, ((232-logo.width)//2, 35))
        col, row = i % 4, i // 4
        review.paste(tile.convert("RGB"), (10+col*248, 20+row*320))
        draw.text((25+col*248, 292+row*320), name.replace("-", " ").title(), fill="#262626")
    draw.text((20, 670), "Eight reusable masters: identical alpha, dimensions, and 45 px transparent margins. 4590 x 3926 px.", fill="#262626")
    draw.text((20, 695), "Separate enamel-mug print files encode the same placement at 600 DPI. Artwork previews, not product mockups.", fill="#262626")
    review.save(OUT / "palette-review.jpg", quality=95)
    review.save(MASTERS / "palette-review.jpg", quality=95)
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    (MASTERS / "manifest.json").write_text(json.dumps(master_manifest, indent=2) + "\n")
    print(f"Verified {len(master_manifest)} reusable masters: shared alpha SHA256 {master_hash}")
    print(f"Verified {len(manifest)} enamel print files: shared alpha SHA256 {expected_hash}")

if __name__ == "__main__":
    main()
