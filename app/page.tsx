import { Suspense } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import FeaturesAccordion from "@/components/FeaturesAccordion";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { renderSchemaTags } from "@/libs/seo";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What do I need to get started?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Just two things: your reel video file and a screenshot of your Instagram retention graph from Insights. Upload both, and our AI does the rest.",
      },
    },
    {
      "@type": "Question",
      name: "How is this different from ChatGPT or other AI tools?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ChatGPT gives generic advice. Reels Copilot syncs YOUR video with YOUR retention data and diagnoses YOUR specific problems. We show you the exact second viewers leave and explain why—not vague tips, but precise analysis of your content.",
      },
    },
    {
      "@type": "Question",
      name: "Will this work for my niche?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Retention psychology works across all niches. Whether you're in fitness, finance, cooking, or lifestyle—viewers drop off for the same core reasons: weak hooks, early payoffs, pacing issues. We identify what applies to your specific content.",
      },
    },
    {
      "@type": "Question",
      name: "How accurate is the analysis?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We use advanced AI to parse retention graphs with high accuracy. The synced diagnosis shows you exactly what happened at each drop-off point—you can verify it yourself by watching the video at that timestamp.",
      },
    },
    {
      "@type": "Question",
      name: "Can I get a refund?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! We offer a 7-day refund policy, no questions asked. If Reels Copilot isn't helping you understand your content better, just reach out by email.",
      },
    },
  ],
};

export default function Page() {
  return (
    <>
      {renderSchemaTags()}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Suspense>
        <Header />
      </Suspense>
      <main>
        <Hero />
        <Problem />
        <FeaturesAccordion />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
