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

Brand rename also applied in this pass: "Reels Copilot" → "Creator Copilots" across all files.

---

## Files to Change

### 1. `config.ts`
- `appName`: already updated to `"Creator Copilots"`
- `appDescription`: update to include "Instagram Reels" explicitly

**New value:**
```
"Stop guessing why your Instagram Reels underperform. AI syncs your retention graph to your video, shows the exact second viewers leave, and rewrites your hook."
```

### 2. `app/layout.tsx`
Pass an explicit `title` to `getSEOTags` so the page title is keyword-optimized without touching `config.appName` (which is used for emails, nav, structured data).

**New call:**
```ts
export const metadata = getSEOTags({
  canonicalUrlRelative: "/",
  title: "Instagram Reels Retention Analyzer | Creator Copilots",
});
```

### 3. `libs/seo.tsx`
Fix the og/twitter title fallback chain so a custom `title` param cascades to `og:title` automatically.

**Change line ~43:**
```ts
// before
title: openGraph?.title || config.appName,

// after
title: openGraph?.title || title || config.appName,
```

Apply the same fix to the `twitter` block on the equivalent line.

### 4. `components/Hero.tsx`
Rewrite H1 text and subheading. Move the SVG underline animation from "viral" to "Reels".

**H1 (new):**
```
See exactly where viewers drop off on your Instagram Reels
```
Underline animates under **"Reels"**.

**Subheading (new):**
```
Upload your reel + retention screenshot. AI pinpoints the exact second viewers leave and rewrites your hook.
```

### 5. `next-sitemap.config.js`
Add a `transform` function to demote legal pages to priority `0.1` / changefreq `yearly`.

```js
transform: async (config, path) => {
  if (path === '/tos' || path === '/privacy-policy') {
    return {
      loc: path,
      priority: 0.1,
      changefreq: 'yearly',
      lastmod: new Date().toISOString(),
    };
  }
  return {
    loc: path,
    priority: config.priority,
    changefreq: config.changefreq,
    lastmod: new Date().toISOString(),
  };
},
```

### 6. `components/Logo.tsx`
Add `aria-hidden="true"` to the SVG — it is decorative (text label "Creator Copilots" sits immediately next to it in the DOM).

---

## Out of Scope

- Blog / content infrastructure (Phase 2, separate spec)
- Real testimonials / social proof
- Competitor comparison pages
- Alt text audit beyond Logo.tsx (no other meaningful missing alt text found)

---

## Success Criteria

- `<title>` on homepage renders as `"Instagram Reels Retention Analyzer | Creator Copilots"`
- `og:title` matches the page title
- `meta description` includes the phrase "Instagram Reels"
- H1 contains "Instagram Reels"
- `/tos` and `/privacy-policy` have priority `0.1` in generated sitemap
- No brand reference to "Reels Copilot" remains in any live code file
