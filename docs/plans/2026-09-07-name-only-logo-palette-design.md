# Name-Only Logo Palette Design

**Date:** 2026-09-07

## Goal

Create Printful-ready name-only logo assets from the existing `public/brand/logo-text.svg` vector. The artwork remains the existing stacked Sourdough House Bakery name mark; only the fill color and export size vary.

## Decisions

- Use the existing vector source rather than redrawing or raster tracing it.
- Export all eight established Printful colors: signature brown, black, white, warm cream, sage, rust, honey gold, and sky blue.
- Provide large and small variants at 3000px and 1500px nominal widths.
- Place SVG masters and transparent PNG previews together in `public/brand/printful/name-only-palette/`.
- Keep the source artwork and existing Printful assets unchanged.
- Include a README and machine-readable manifest documenting the palette, dimensions, and intended use.

## Constraints

- All variants must share the same geometry, viewBox, aspect ratio, and transparent padding.
- Color values must match `.qa/printful/export-palette.cjs` exactly.
- The assets are a design library only; they are not uploaded or published to Printful as part of this work.
