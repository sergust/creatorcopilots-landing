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
};
