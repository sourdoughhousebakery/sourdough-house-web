# Content Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove placeholder public social links while keeping contact links centralized and test-covered.

**Architecture:** Centralize social/contact link shaping in `lib/site.ts`. UI components consume exported helper results instead of each building their own social arrays.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest.

---

### Task 1: Add Social Link Helper Tests

**Files:**
- Create: `lib/site.test.ts`
- Modify: none

**Step 1: Write the failing tests**

Add tests for `getSocialLinks` and `getContactLinks`:

```ts
import { describe, expect, it } from "vitest";
import { getContactLinks, getSocialLinks, siteConfig } from "./site";

describe("getSocialLinks", () => {
  it("omits placeholder platform URLs", () => {
    expect(getSocialLinks(siteConfig).map((link) => link.label)).toEqual([]);
  });

  it("keeps configured profile URLs", () => {
    expect(
      getSocialLinks({
        ...siteConfig,
        instagramUrl: "https://www.instagram.com/sourdoughhouse/"
      })
    ).toEqual([{ label: "Instagram", href: "https://www.instagram.com/sourdoughhouse/" }]);
  });
});

describe("getContactLinks", () => {
  it("always includes email when configured", () => {
    expect(getContactLinks(siteConfig)).toContainEqual({
      label: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
      kind: "email"
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- lib/site.test.ts`

Expected: fail because `getSocialLinks` and `getContactLinks` do not exist yet.

### Task 2: Implement Site Link Helpers

**Files:**
- Modify: `lib/site.ts`
- Test: `lib/site.test.ts`

**Step 1: Add types and helper functions**

Add helper functions that filter placeholder platform URLs and return normalized link objects.

**Step 2: Run tests**

Run: `npm run test -- lib/site.test.ts`

Expected: pass.

### Task 3: Use Shared Helpers In UI

**Files:**
- Modify: `components/site-footer.tsx`
- Modify: `app/contact/page.tsx`

**Step 1: Replace local social arrays**

Use `getSocialLinks()` and `getContactLinks()` from `lib/site.ts`.

**Step 2: Verify**

Run:

```bash
npm run test
npm run typecheck
npm run lint
```

Expected: all commands exit 0.
