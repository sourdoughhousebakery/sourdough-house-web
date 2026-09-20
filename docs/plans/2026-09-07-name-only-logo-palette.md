# Name-Only Logo Palette Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Generate a verified library of large and small name-only logo assets in all eight established Printful colors.

**Architecture:** A Node.js script reads `public/brand/logo-text.svg`, substitutes only its source fill color, sets explicit nominal dimensions while preserving the original viewBox, and uses `sharp` to rasterize matching transparent PNGs. The script also writes a manifest and README so the asset set can be regenerated deterministically.

**Tech Stack:** Node.js, `sharp`, SVG, PNG.

---

### Task 1: Add the deterministic exporter

**Files:**
- Create `scripts/export-name-only-palette.cjs`

Implement the established eight-color palette, two width presets, SVG recoloring, PNG rasterization, and manifest/README generation. Fail if the source fill or expected output count is unexpected.

### Task 2: Generate the asset folder

**Files:**
- Create `public/brand/printful/name-only-palette/`

Run the exporter to create 16 SVG masters and 16 transparent PNG previews, plus the manifest and usage documentation.

### Task 3: Verify geometry and palette consistency

Verify that all SVGs retain the source viewBox and all PNGs have the expected dimensions, alpha channel, and color-specific pixels without geometry drift. Confirm the generated file count and inspect the git diff/status.
