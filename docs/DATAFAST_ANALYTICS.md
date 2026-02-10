# Datafast Analytics Events

This document lists all Datafast analytics events implemented on the landing page for funnel tracking.

## Setup

### Environment Variables

Add to `.env.local`:
```
DATAFAST_API_KEY=your_api_key_here
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret  # Optional, for user.created tracking
```

Get your Datafast API key from **Datafast Dashboard → Website Settings → API tab**.

### Scripts

The Datafast script is loaded in `app/layout.tsx`:
- Queue script (`beforeInteractive`) - captures events before main script loads
- Main script (`afterInteractive`) - `https://datafa.st/js/script.js`

---

## Client-Side Events

### Scroll Depth Goals

Tracked via `data-fast-scroll` attribute when section enters viewport.

| Goal Name | Section | File |
|-----------|---------|------|
| `scroll_to_problem` | Problem/Pain points | `components/Problem.tsx` |
| `scroll_to_features` | Features accordion | `components/FeaturesAccordion.tsx` |
| `scroll_to_pricing` | Pricing plans | `components/Pricing.tsx` |
| `scroll_to_faq` | FAQ section | `components/FAQ.tsx` |
| `scroll_to_cta` | Final CTA | `components/CTA.tsx` |

### Click Goals - CTAs

Tracked via `data-fast-goal` attribute on click.

| Goal Name | Element | File |
|-----------|---------|------|
| `hero_cta_click` | Hero "Get Started" button | `components/Hero.tsx` |
| `final_cta_click` | Final "Upload Your Reel" button | `components/CTA.tsx` |

### Click Goals - Checkout

| Goal Name | Element | File |
|-----------|---------|------|
| `checkout_starter` | Starter plan checkout button | `components/ButtonCheckout.tsx` |
| `checkout_pro` | Pro plan checkout button | `components/ButtonCheckout.tsx` |

### Click Goals - Navigation

| Goal Name | Element | File |
|-----------|---------|------|
| `nav_features_click` | "How It Works" nav link | `components/Header.tsx` |
| `nav_pricing_click` | "Pricing" nav link | `components/Header.tsx` |
| `nav_faq_click` | "FAQ" nav link | `components/Header.tsx` |
| `header_signin_click` | Sign in button | `components/ButtonSignin.tsx` |

### Click Goals - Footer

| Goal Name | Element | File |
|-----------|---------|------|
| `footer_support_click` | Support email link | `components/Footer.tsx` |
| `footer_pricing_click` | Pricing link | `components/Footer.tsx` |
| `footer_tos_click` | Terms of Service link | `components/Footer.tsx` |
| `footer_privacy_click` | Privacy Policy link | `components/Footer.tsx` |

### Engagement Goals

| Goal Name | Element | File |
|-----------|---------|------|
| `feature_select` | Feature accordion item click | `components/FeaturesAccordion.tsx` |
| `faq_expand` | FAQ item expand/collapse | `components/FAQ.tsx` |

---

## Server-Side Events

Tracked via Datafast API from webhook handlers. Requires `DATAFAST_API_KEY` environment variable.

### Clerk Webhook Setup (for user_signup)

1. Go to **Clerk Dashboard → Webhooks**
2. Add endpoint: `https://yourdomain.com/api/webhook/clerk`
3. Select `user.created` event
4. Copy the Signing Secret to `CLERK_WEBHOOK_SECRET` env var

### Events

| Goal Name | Trigger | File |
|-----------|---------|------|
| `user_signup` | New user created (Clerk webhook) | `app/api/webhook/clerk/route.ts` |
| `payment_success` | Successful payment (order_created) | `app/api/webhook/lemonsqueezy/route.ts` |
| `subscription_cancelled` | Subscription cancelled | `app/api/webhook/lemonsqueezy/route.ts` |
| `refund_processed` | Order refunded | `app/api/webhook/lemonsqueezy/route.ts` |

### Server Event Metadata

**payment_success:**
```json
{
  "plan": "starter" | "pro",
  "amount": "9" | "59",
  "currency": "USD",
  "email": "user@example.com"
}
```

**user_signup:**
```json
{
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe"
}
```

**subscription_cancelled / refund_processed:**
```json
{
  "plan": "starter" | "pro"
}
```

### Server-Side Helper

Location: `libs/datafast.ts`

```typescript
import { trackDatafastEvent, DatafastEvents } from "@/libs/datafast";

await trackDatafastEvent({
  visitorId: "datafast_visitor_id_from_cookie",
  name: DatafastEvents.PAYMENT_SUCCESS,
  metadata: {
    plan: "pro",
    amount: "59",
    currency: "USD"
  }
});
```

---

## Recommended Funnels

Create these in Datafast Dashboard → Funnels.

### 1. Primary Conversion Funnel (6 steps)
```
Page Visit → scroll_to_problem → scroll_to_features → scroll_to_pricing → checkout_pro → payment_success
```

### 2. CTA Engagement Funnel (5 steps)
```
Page Visit → hero_cta_click → scroll_to_pricing → checkout_pro → payment_success
```

### 3. Scroll Depth Funnel (6 steps)
```
Page Visit → scroll_to_problem → scroll_to_features → scroll_to_pricing → scroll_to_faq → scroll_to_cta
```

### 4. Feature Engagement Funnel (6 steps)
```
Page Visit → scroll_to_features → feature_select → scroll_to_pricing → checkout_pro → payment_success
```

### 5. Starter Plan Funnel (4 steps)
```
Page Visit → scroll_to_pricing → checkout_starter → payment_success
```

### 6. Pro Plan Funnel (4 steps)
```
Page Visit → scroll_to_pricing → checkout_pro → payment_success
```

---

## Testing

### Client-Side Events

1. Run `npm run dev`
2. Open browser DevTools → Network tab
3. Filter by `datafa.st`
4. Scroll through the page and click elements
5. Verify requests are sent with correct goal names

### Server-Side Events

1. Trigger a test payment via Lemon Squeezy sandbox
2. Check server logs for `[Datafast]` messages
3. Verify events appear in Datafast dashboard

---

## Files Modified

| File | Changes |
|------|---------|
| `app/layout.tsx` | Added Datafast queue script |
| `components/Problem.tsx` | Added `data-fast-scroll` |
| `components/FeaturesAccordion.tsx` | Added `data-fast-scroll` + `data-fast-goal` |
| `components/Pricing.tsx` | Added `data-fast-scroll` |
| `components/FAQ.tsx` | Added `data-fast-scroll` + `data-fast-goal` |
| `components/CTA.tsx` | Added `data-fast-scroll` + `data-fast-goal` |
| `components/Hero.tsx` | Added `data-fast-goal` |
| `components/Header.tsx` | Added `data-fast-goal` to nav links |
| `components/ButtonCheckout.tsx` | Added `data-fast-goal` with plan name |
| `components/ButtonSignin.tsx` | Added `data-fast-goal` |
| `components/Footer.tsx` | Added `data-fast-goal` to all links |
| `libs/datafast.ts` | Created server-side tracking helper |
| `app/api/webhook/clerk/route.ts` | Created Clerk webhook for user_signup |
| `app/api/webhook/lemonsqueezy/route.ts` | Added server event tracking |
