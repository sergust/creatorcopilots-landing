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
