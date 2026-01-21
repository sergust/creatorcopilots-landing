import { ReactNode } from "react";
import { Outfit } from "next/font/google";
import { Viewport } from "next";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import { getSEOTags } from "@/libs/seo";
import ClientLayout from "@/components/LayoutClient";
import config from "@/config";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  // Will use the primary color of your theme to show a nice theme color in the URL bar of supported browsers
  themeColor: config.colors.main,
  width: "device-width",
  initialScale: 1,
};

// This adds default SEO tags to all pages in our app.
// You can override them in each page passing params to getSOTags() function.
export const metadata = getSEOTags();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      allowedRedirectOrigins={[
        config.appUrl,
        "https://creatorcopilots.com",
        "http://localhost:3001", // For local development
        "http://localhost:3000", // For local development
      ]}
    >
      <html
        lang="en"
        data-theme={config.colors.theme}
        className={outfit.variable}
      >
        <head>
          {/* Datafast queue script - captures events before main script loads */}
          <Script id="datafast-queue" strategy="beforeInteractive">
            {`window.datafast = window.datafast || function() {
              window.datafast.q = window.datafast.q || [];
              window.datafast.q.push(arguments);
            };`}
          </Script>
          <Script
            defer
            data-website-id="dfid_NpQGvIxtvJX9l4KYrwAsi"
            data-domain="creatorcopilots.com"
            src="https://datafa.st/js/script.js"
            strategy="afterInteractive"
          />
        </head>
        <body className="antialiased">
          {/* ClientLayout contains all the client wrappers (Crisp chat support, toast messages, tooltips, etc.) */}
          <ClientLayout>{children}</ClientLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}
