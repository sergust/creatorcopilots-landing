# SEO Quick Wins — Design Spec

**Date:** 2026-03-24
**Scope:** On-page metadata fixes + H1/hero copy rewrite for creatorcopilots.com landing
**Approach:** Config-first (Option A) — all metadata flows through existing `config.ts` / `libs/seo.tsx` / `app/layout.tsx`; copy changes in `Hero.tsx`; sitemap priorities in `next-sitemap.config.js`

---

## Context

SEO roast of https://creatorcopilots.com identified the following high-ROI quick wins:

- Title tag is just `"Creator Copilots"` — no keyword, no value prop
- og:title inherits the same weak title
- `appDescription` omits "Instagram Reels" — the core keyword
- H1 `"Go viral with proven tools and prediction"` contains no searchable terms
- Hero subheading is vague ("creative AI producer")
- `/tos` and `/privacy-policy` have the same sitemap priority (0.7) as the homepage
- Logo SVG has no `aria-hidden` (decorative, but exposed to accessibility tree)

Brand rename was already applied separately: "Reels Copilot" → "Creator Copilots" across all live code files. Verify with `grep -r 'Reels Copilot' --include='*.ts' --include='*.tsx' --include='*.js'` — expect zero results.

---

## Files to Change

### 1. `config.ts`

`appName` is already `"Creator Copilots"` — no change needed, confirm and move on.

`appDescription` must be updated to include "Instagram Reels" explicitly.

**Before:**
```ts
appDescription:
  "Stop guessing why your reels underperform. AI analyzes your retention graph, pinpoints exactly where viewers drop off, and gives you the specific words to fix it.",
```

**After:**
```ts
appDescription:
  "Stop guessing why your Instagram Reels underperform. AI syncs your retention graph to your video, shows the exact second viewers leave, and rewrites your hook.",
```

### 2. `app/layout.tsx`

Pass an explicit `title` to `getSEOTags` so the page title is keyword-optimized without touching `config.appName` (which is also used for emails, nav, and structured data).

**Before:**
```ts
export const metadata = getSEOTags({ canonicalUrlRelative: "/" });
```

**After:**
```ts
export const metadata = getSEOTags({
  canonicalUrlRelative: "/",
  title: "Instagram Reels Retention Analyzer | Creator Copilots",
});
```

### 3. `libs/seo.tsx`

Fix two fallback chains so a custom `title` param cascades to `og:title` and `twitter:title` automatically. Both currently fall back directly to `config.appName`, bypassing any `title` passed to `getSEOTags`.

Also fix `openGraph.siteName` — currently it incorrectly falls back to `openGraph?.title`, which would make `og:site_name` equal the page-specific OG title rather than the brand name. Fix it to always use `config.appName`.

Apply the three changes below in context. The `openGraph` and `twitter` blocks both contain a `title` line with the same value — use the block name to identify which to edit.

**Inside the `openGraph: { ... }` block — two changes:**
```ts
// before
openGraph: {
  title: openGraph?.title || config.appName,          // <-- add || title ||
  description: openGraph?.description || config.appDescription,
  url: openGraph?.url || `https://${config.domainName}/`,
  siteName: openGraph?.title || config.appName,       // <-- change to config.appName

// after
openGraph: {
  title: openGraph?.title || title || config.appName,
  description: openGraph?.description || config.appDescription,
  url: openGraph?.url || `https://${config.domainName}/`,
  siteName: config.appName,
```

**Inside the `twitter: { ... }` block — one change:**
```ts
// before
twitter: {
  title: openGraph?.title || config.appName,

// after
twitter: {
  title: openGraph?.title || title || config.appName,
```

### 4. `components/Hero.tsx`

Rewrite H1 text and subheading. Move the SVG underline animation from the word "viral" to the single word **"Reels"** (not "Instagram Reels" — the SVG viewBox and stroke-dasharray are tuned for a short word; wrapping a two-word phrase would break the animation visually without additional SVG changes).

**H1 (new):**
```
See exactly where viewers drop off on your Instagram Reels
```

Wrap only `"Reels"` in the `<span>` that contains the SVG underline path. Carry the existing `<svg>` block (viewBox, path d, stroke-dasharray, animate-draw class) unchanged — the word "Reels" is similar in length to "viral" so no geometry adjustments are needed.

**Subheading (new):**
```
Upload your reel + retention screenshot. AI pinpoints the exact second viewers leave and rewrites your hook.
```

### 5. `next-sitemap.config.js`

Add a `transform` function.

> **Important:** The `config` parameter in the transform callback is the **next-sitemap config object** (the one exported from `next-sitemap.config.js`). It is NOT the app's `config.ts`. It has a `siteUrl` property. Do not import or reference the app's `config.ts` here.

The `loc` field must be an absolute URL — use `config.siteUrl` to construct it. Since this project does not set `priority` or `changefreq` in `module.exports`, use `?? 0.7` and `?? 'daily'` as fallbacks (matching next-sitemap's own defaults). `lastmod` uses a static ISO string to avoid spurious last-modified changes on every deploy.

```js
transform: async (config, path) => {
  if (path === '/tos' || path === '/privacy-policy') {
    return {
      loc: `${config.siteUrl}${path}`,
      priority: 0.1,
      changefreq: 'yearly',
      lastmod: '2026-03-24T00:00:00.000Z',
    };
  }
  return {
    loc: `${config.siteUrl}${path}`,
    priority: config.priority ?? 0.7,
    changefreq: config.changefreq ?? 'daily',
    lastmod: '2026-03-24T00:00:00.000Z',
  };
},
```

### 6. `components/Logo.tsx`

Add `aria-hidden="true"` to the `<svg>` opening tag. It is decorative — the text label "Creator Copilots" sits immediately adjacent in the DOM and provides the accessible name for the link.

```tsx
// before
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="32"
  height="32"
  ...
>

// after
<svg
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
  width="32"
  height="32"
  ...
>
```

---

## Out of Scope

- Blog / content infrastructure (Phase 2, separate spec)
- Real testimonials / social proof
- Competitor comparison pages
- Alt text audit beyond Logo.tsx (no other meaningful missing alt text found in components)

---

## Success Criteria

- `<title>` on homepage renders as `"Instagram Reels Retention Analyzer | Creator Copilots"`
- `og:title` and `twitter:title` render as `"Instagram Reels Retention Analyzer | Creator Copilots"`
- `og:site_name` renders as `"Creator Copilots"` (brand name)
- `meta description` contains the phrase "Instagram Reels"
- H1 contains the phrase "Instagram Reels"
- `/tos` and `/privacy-policy` have priority `0.1` in the generated sitemap XML with fully-qualified `loc` URLs
- `grep -r 'Reels Copilot'` across `*.ts`, `*.tsx`, `*.js` returns zero results
