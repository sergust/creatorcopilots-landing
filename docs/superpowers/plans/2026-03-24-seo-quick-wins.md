# SEO Quick Wins Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the title tag, meta description, og/twitter tags, H1, hero subheading, sitemap priorities, and Logo aria-hidden to close the highest-ROI SEO gaps on creatorcopilots.com.

**Architecture:** Config-first — metadata flows from `config.ts` → `libs/seo.tsx` → `app/layout.tsx`. H1/subheading are plain JSX in `components/Hero.tsx`. Sitemap priorities are controlled by a `transform` function in `next-sitemap.config.js`. No new files are created.

**Tech Stack:** Next.js 16 App Router, TypeScript, `next-sitemap` package, TailwindCSS/DaisyUI

---

## File Map

| File | Change |
|---|---|
| `config.ts` | Update `appDescription` to include "Instagram Reels" |
| `app/layout.tsx` | Pass explicit `title` to `getSEOTags` |
| `libs/seo.tsx` | Fix og/twitter title fallback + fix siteName to always use brand |
| `components/Hero.tsx` | Rewrite H1 text + subheading; move SVG underline to "Reels" |
| `next-sitemap.config.js` | Add `transform` to demote /tos and /privacy-policy to priority 0.1 |
| `components/Logo.tsx` | Add `aria-hidden="true"` to decorative SVG |

---

## Pre-flight Check

- [ ] **Verify brand rename is complete**

```bash
grep -r 'Reels Copilot' --include='*.ts' --include='*.tsx' --include='*.js' .
```

Expected: no output (zero matches). If any matches appear, do not proceed — fix them first.

---

## Task 1: Meta Description (`config.ts`)

**Files:**
- Modify: `config.ts`

- [ ] **Edit `appDescription` in `config.ts`**

Find this exact string (lines 14–16):
```ts
appDescription:
  "Stop guessing why your reels underperform. AI analyzes your retention graph, pinpoints exactly where viewers drop off, and gives you the specific words to fix it.",
```

Replace with:
```ts
appDescription:
  "Stop guessing why your Instagram Reels underperform. AI syncs your retention graph to your video, shows the exact second viewers leave, and rewrites your hook.",
```

- [ ] **Verify TypeScript still compiles**

```bash
npm run build 2>&1 | head -30
```

Expected: build succeeds (exit 0). If it fails, fix the TypeScript error before continuing.

- [ ] **Commit**

```bash
git add config.ts
git commit -m "feat: add Instagram Reels keyword to meta description"
```

---

## Task 2: Page Title (`app/layout.tsx`)

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Edit the `getSEOTags` call in `app/layout.tsx`**

Find:
```ts
export const metadata = getSEOTags({ canonicalUrlRelative: "/" });
```

Replace with:
```ts
export const metadata = getSEOTags({
  canonicalUrlRelative: "/",
  title: "Instagram Reels Retention Analyzer | Creator Copilots",
});
```

- [ ] **Verify TypeScript still compiles**

```bash
npm run build 2>&1 | head -30
```

Expected: exit 0.

- [ ] **Commit**

```bash
git add app/layout.tsx
git commit -m "feat: set keyword-optimized title tag for homepage"
```

---

## Task 3: og/twitter Tag Fallbacks (`libs/seo.tsx`)

**Files:**
- Modify: `libs/seo.tsx`

This task fixes three lines inside `getSEOTags`. The `openGraph` and `twitter` blocks both have a `title` line — be careful to edit the correct block for each change.

- [ ] **Fix `openGraph.title` fallback (inside the `openGraph: { ... }` block)**

Find:
```ts
openGraph: {
  title: openGraph?.title || config.appName,
```

Replace with:
```ts
openGraph: {
  title: openGraph?.title || title || config.appName,
```

- [ ] **Fix `openGraph.siteName` (same block, 3 lines below)**

Find:
```ts
  siteName: openGraph?.title || config.appName,
```

Replace with:
```ts
  siteName: config.appName,
```

- [ ] **Fix `twitter.title` fallback (inside the `twitter: { ... }` block)**

Find:
```ts
twitter: {
  title: openGraph?.title || config.appName,
```

Replace with:
```ts
twitter: {
  title: openGraph?.title || title || config.appName,
```

- [ ] **Verify TypeScript still compiles**

```bash
npm run build 2>&1 | head -30
```

Expected: exit 0.

- [ ] **Spot-check the output**

After build, start the dev server and check the page source:

```bash
npm run dev &
sleep 3
curl -s http://localhost:3000 | grep -E 'og:title|og:site_name|twitter:title|<title'
```

Expected output should include:
- `<title>Instagram Reels Retention Analyzer | Creator Copilots</title>`
- `og:title` content = `"Instagram Reels Retention Analyzer | Creator Copilots"`
- `og:site_name` content = `"Creator Copilots"`
- `twitter:title` content = `"Instagram Reels Retention Analyzer | Creator Copilots"`

Kill dev server after checking: `kill %1`

- [ ] **Commit**

```bash
git add libs/seo.tsx
git commit -m "fix: cascade custom title to og:title and twitter:title; fix og:site_name to always use brand name"
```

---

## Task 4: H1 + Hero Subheading (`components/Hero.tsx`)

**Files:**
- Modify: `components/Hero.tsx`

- [ ] **Rewrite the H1 — change text and move SVG underline span from "viral" to "Reels"**

Replace the entire `<h1>` block:

```tsx
// BEFORE
<h1 className="font-extrabold text-4xl sm:text-5xl lg:text-7xl tracking-tight leading-[1.1]">
  Go{" "}
  <span className="relative inline-block">
    viral
    <svg
      className="absolute -bottom-2 left-0 w-full"
      viewBox="0 0 200 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        d="M2 8.5C20 3.5 50 10 80 6C110 2 140 9 170 5C185 3.5 195 6 198 7"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        className="text-primary stroke-3 [stroke-dasharray:300] [stroke-dashoffset:300] animate-draw"
      />
    </svg>
  </span>{" "}
  with proven tools and prediction
</h1>
```

```tsx
// AFTER
<h1 className="font-extrabold text-4xl sm:text-5xl lg:text-7xl tracking-tight leading-[1.1]">
  See exactly where viewers drop off on your Instagram{" "}
  <span className="relative inline-block">
    Reels
    <svg
      className="absolute -bottom-2 left-0 w-full"
      viewBox="0 0 200 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        d="M2 8.5C20 3.5 50 10 80 6C110 2 140 9 170 5C185 3.5 195 6 198 7"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        className="text-primary stroke-3 [stroke-dasharray:300] [stroke-dashoffset:300] animate-draw"
      />
    </svg>
  </span>
</h1>
```

- [ ] **Rewrite the subheading paragraph**

Find:
```tsx
<p className="text-lg sm:text-xl text-base-content/70 leading-relaxed max-w-2xl">
  Analyze, test, hypothesize, and use only the best mechanics with your
  creative AI producer.
</p>
```

Replace with:
```tsx
<p className="text-lg sm:text-xl text-base-content/70 leading-relaxed max-w-2xl">
  Upload your reel + retention screenshot. AI pinpoints the exact second
  viewers leave and rewrites your hook.
</p>
```

- [ ] **Verify TypeScript compiles and lint passes**

```bash
npm run build 2>&1 | head -30 && npm run lint 2>&1 | tail -10
```

Expected: both exit 0.

- [ ] **Visual check — confirm underline animation renders on "Reels"**

```bash
npm run dev &
sleep 3
open http://localhost:3000
```

Verify in browser:
- H1 reads "See exactly where viewers drop off on your Instagram Reels"
- The animated underline appears under "Reels"
- Subheading reads the new copy

Kill dev server: `kill %1`

- [ ] **Commit**

```bash
git add components/Hero.tsx
git commit -m "feat: rewrite H1 and subheading with Instagram Reels keyword"
```

---

## Task 5: Sitemap Priorities (`next-sitemap.config.js`)

**Files:**
- Modify: `next-sitemap.config.js`

The `transform` callback receives the next-sitemap config object (not the app's `config.ts`) as its first argument. It has a `siteUrl` property. The `loc` field must be a fully-qualified URL.

- [ ] **Add `transform` function to `next-sitemap.config.js`**

Replace the entire file content:

```js
module.exports = {
  siteUrl: process.env.SITE_URL || "https://creatorcopilots.com",
  generateRobotsTxt: true,
  exclude: [
    "/twitter-image.*",
    "/opengraph-image.*",
    "/icon.*",
    "/checkout",
    "/manual-checkout",
    "/dashboard",
    "/dashboard/**",
    "/sign-in",
    "/sign-in/**",
    "/sign-up",
    "/sign-up/**",
    "/blog",
    "/blog/**",
  ],
  transform: async (config, path) => {
    if (path === "/tos" || path === "/privacy-policy") {
      return {
        loc: `${config.siteUrl}${path}`,
        priority: 0.1,
        changefreq: "yearly",
        lastmod: "2026-03-24T00:00:00.000Z",
      };
    }
    return {
      loc: `${config.siteUrl}${path}`,
      priority: config.priority ?? 0.7,
      changefreq: config.changefreq ?? "daily",
      lastmod: "2026-03-24T00:00:00.000Z",
    };
  },
};
```

- [ ] **Verify sitemap generates correctly**

```bash
npm run build 2>&1 | tail -5
```

Expected: exit 0. After build, check the generated sitemap:

```bash
cat public/sitemap-0.xml
```

Expected: `/tos` and `/privacy-policy` entries show `<priority>0.1</priority>` and `<changefreq>yearly</changefreq>`. Homepage entry shows `<priority>0.7</priority>`. All `<loc>` values are fully-qualified URLs starting with `https://creatorcopilots.com`.

- [ ] **Commit**

```bash
git add next-sitemap.config.js public/sitemap.xml public/sitemap-0.xml
git commit -m "fix: demote /tos and /privacy-policy to priority 0.1 in sitemap"
```

---

## Task 6: Logo Accessibility (`components/Logo.tsx`)

**Files:**
- Modify: `components/Logo.tsx`

- [ ] **Add `aria-hidden="true"` to the SVG opening tag**

Find:
```tsx
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="32"
  height="32"
  viewBox="0 0 24 24"
```

Replace with:
```tsx
<svg
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
  width="32"
  height="32"
  viewBox="0 0 24 24"
```

- [ ] **Verify TypeScript compiles**

```bash
npm run build 2>&1 | head -30
```

Expected: exit 0.

- [ ] **Commit**

```bash
git add components/Logo.tsx
git commit -m "fix: add aria-hidden to decorative Logo SVG"
```

---

## Final Verification

- [ ] **Run full build and lint**

```bash
npm run build && npm run lint
```

Expected: both pass.

- [ ] **Spot-check all success criteria against view-source**

```bash
npm run dev &
sleep 3
curl -s http://localhost:3000 | grep -E '<title|og:title|og:site_name|twitter:title|meta name="description|<h1'
kill %1
```

Expected output includes:
- `<title>Instagram Reels Retention Analyzer | Creator Copilots</title>`
- `og:title` = `"Instagram Reels Retention Analyzer | Creator Copilots"`
- `og:site_name` = `"Creator Copilots"`
- `twitter:title` = `"Instagram Reels Retention Analyzer | Creator Copilots"`
- `meta name="description"` content contains "Instagram Reels"
- `<h1` text contains "Instagram Reels"

- [ ] **Confirm no Reels Copilot references remain**

```bash
grep -r 'Reels Copilot' --include='*.ts' --include='*.tsx' --include='*.js' .
```

Expected: no output.
