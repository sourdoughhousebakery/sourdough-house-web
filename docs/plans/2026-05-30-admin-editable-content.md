# Admin Editable Content Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add local-preview admin screens for the non-catalog content worth editing: announcement, contact settings, and testimonials.

**Architecture:** Keep the current localStorage preview model for this pass. Add typed helper functions for editable admin content, then render a new client admin editor below the existing catalog editor. The public site remains code-backed until a later Supabase persistence slice.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest, localStorage.

---

### Task 1: Add Admin Content Helper Tests

**Files:**
- Create: `lib/admin-content/content.test.ts`

**Steps:**
1. Write failing tests for default admin content state.
2. Write failing tests for creating/updating/deleting testimonials.
3. Write failing tests for hydrating persisted partial state over defaults.
4. Run `npm run test -- lib/admin-content/content.test.ts` and confirm it fails because helpers do not exist.

### Task 2: Implement Admin Content Helpers

**Files:**
- Create: `lib/admin-content/content.ts`

**Steps:**
1. Add serializable types for announcement, contact settings, testimonials, and full admin content state.
2. Add `getDefaultAdminContent()`.
3. Add `hydrateAdminContent(defaults, persisted)`.
4. Add `createEditableTestimonial`, `updateEditableTestimonial`, and `deleteEditableTestimonial`.
5. Run `npm run test -- lib/admin-content/content.test.ts` and confirm it passes.

### Task 3: Build Admin Content Editor

**Files:**
- Create: `components/admin-content-editor.tsx`
- Modify: `app/admin/page.tsx`

**Steps:**
1. Add a client component with tabs for Announcement, Contact, and Testimonials.
2. Save/load from `localStorage` with a clear “local preview only” message.
3. Wire the component into `/admin` under the catalog editor.
4. Run `npm run typecheck`.

### Task 4: Verify And Commit

**Steps:**
1. Run `npm run test`.
2. Run `npm run lint`.
3. Run `npm run typecheck`.
4. Run `npm run build`.
5. Remove generated `next-env.d.ts` churn if build flips it.
6. Commit the implementation.
