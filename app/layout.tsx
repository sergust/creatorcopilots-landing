import { ReactNode } from "react";
import { Outfit } from "next/font/google";
import { Viewport } from "next";
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
        "https://app.creatorcopilots.com",
        "http://localhost:3001", // For local development
        "http://localhost:3000", // For local development
      ]}
    >
      <html
        lang="en"
        data-theme={config.colors.theme}
        className={outfit.variable}
      >
        <body className="antialiased">
          {/* ClientLayout contains all the client wrappers (Crisp chat support, toast messages, tooltips, etc.) */}
          <ClientLayout>{children}</ClientLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}
