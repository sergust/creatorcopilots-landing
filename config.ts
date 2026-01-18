import { ConfigProps } from "./types/config";

// DaisyUI v5 theme colors - cupcake theme with custom primary (indigo/purple)
const themes = {
  cupcake: {
    primary: "#6366f1", // indigo-500 (matches oklch(55% 0.2 270))
  },
};

const config = {
  // REQUIRED
  appName: "Reels Copilot",
  // REQUIRED: a short description of your app for SEO tags (can be overwritten)
  appDescription:
    "Stop guessing why your reels underperform. AI analyzes your retention graph, pinpoints exactly where viewers drop off, and gives you the specific words to fix it.",
  // REQUIRED (no https://, not trailing slash at the end, just the naked domain)
  domainName: "creatorcopilots.com",
  // REQUIRED — The URL to the main application
  appUrl: "https://app.creatorcopilots.com",
  // Payment processing mode: "auto" (Lemon Squeezy) or "manual" (email notifications)
  paymentProcessing: "manual",
  crisp: {
    // Crisp website ID. IF YOU DON'T USE CRISP: just remove this => Then add a support email in this config file (resend.supportEmail) otherwise customer support won't work.
    id: "",
    // Hide Crisp by default, except on route "/". Crisp is toggled with <ButtonSupport/>. If you want to show Crisp on every routes, just remove this below
    onlyShowOnRoutes: ["/"],
  },
  lemonsqueezy: {
    // Create a product and add multiple variants via your Lemon Squeezy dashboard, then add them here. You can add as many plans as you want, just make sure to add the variantId.
    plans: [
      {
        // REQUIRED — we use this to find the plan in the webhook (for instance if you want to update the user's credits based on the plan)
        variantId:
          process.env.NODE_ENV === "development"
            ? "1213979" // Replace with your sandbox variant ID
            : "1213979", // Replace with your production variant ID
        //  REQUIRED - Name of the plan, displayed on the pricing page
        name: "Starter",
        // A friendly description of the plan, displayed on the pricing page. Tip: explain why this plan and not others
        description: "Try it out with 1 reel analysis",
        // The price you want to display, the one user will be charged on Lemon Squeezy.
        price: 9,
        // If you have an anchor price (i.e. $29) that you want to display crossed out, put it here. Otherwise, leave it empty
        priceAnchor: 19,
        features: [
          { name: "1 reel analysis per month" },
          { name: "Retention graph parsing" },
          { name: "Drop-off diagnosis" },
          { name: "Basic rewrite suggestions" },
        ],
      },
      {
        variantId:
          process.env.NODE_ENV === "development"
            ? "1213975" // Replace with your sandbox variant ID
            : "1213975", // Replace with your production variant ID
        // This plan will look different on the pricing page, it will be highlighted. You can only have one plan with isFeatured: true
        isFeatured: true,
        name: "Pro",
        description: "For serious creators",
        price: 59,
        priceAnchor: 99,
        features: [
          { name: "Everything in Starter" },
          { name: "Advanced AI chat analysis" },
          { name: "Exact script rewrites" },
          { name: "Priority support" },
        ],
      },
    ],
  },
  aws: {
    // If you use AWS S3/Cloudfront, put values in here
    bucket: "bucket-name",
    bucketUrl: `https://bucket-name.s3.amazonaws.com/`,
    cdn: "https://cdn-id.cloudfront.net/",
  },
  resend: {
    // REQUIRED — Email 'From' field to be used when sending magic login links
    fromNoReply: `Reels Copilot <noreply@creatorcopilots.com>`,
    // REQUIRED — Email 'From' field to be used when sending other emails, like abandoned carts, updates etc..
    fromAdmin: `Reels Copilot <hello@creatorcopilots.com>`,
    // Email shown to customer if they need support. Leave empty if not needed => if empty, set up Crisp above, otherwise you won't be able to offer customer support."
    supportEmail: "support@creatorcopilots.com",
  },
  colors: {
    // REQUIRED — The DaisyUI theme to use (added to the main layout.js). Using cupcake theme with custom colors defined in globals.css.
    theme: "cupcake",
    // REQUIRED — This color will be reflected on the whole app outside of the document (loading bar, Chrome tabs, etc..). By default it takes the primary color from your DaisyUI theme (make sure to update your the theme name after "data-theme=")
    // OR you can just do this to use a custom color: main: "#f37055". HEX only.
    main: themes["cupcake"]["primary"],
  },
  auth: {
    // REQUIRED — the path to log in users. It's use to protect private routes (like /dashboard). It's used in apiClient (/libs/api.js) upon 401 errors from our API
    loginUrl: "/sign-in",
    // REQUIRED — the path you want to redirect users to after a successful login (i.e. /dashboard, /private). This is normally a private page for users to manage their accounts. It's used in apiClient (/libs/api.js) upon 401 errors from our API & in ButtonSignin.js
    callbackUrl: "/dashboard",
  },
} as ConfigProps;

export default config;
