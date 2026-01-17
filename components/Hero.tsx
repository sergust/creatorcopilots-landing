"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import config from "@/config";

interface UserPublicMetadata {
  hasAccess?: boolean;
  [key: string]: unknown;
}

const Hero = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  const handleGetStarted = () => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      // Not logged in - go to pricing
      router.push("/#pricing");
      return;
    }

    // Check if user has subscription access
    const hasAccess = (user?.publicMetadata as UserPublicMetadata)?.hasAccess;

    if (hasAccess) {
      // Logged in and subscribed - go to app
      window.location.href = config.appUrl;
    } else {
      // Logged in but not subscribed - go to pricing
      router.push("/#pricing");
    }
  };

  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-base-100 px-8 py-20 lg:py-32">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8">
        {/* Badge/Tagline */}
        {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-base-200/50 border border-base-300 text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
          Your AI Creative Producer
        </div> */}

        {/* Main Headline */}
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

        {/* Description */}
        <p className="text-lg sm:text-xl text-base-content/70 leading-relaxed max-w-2xl">
          Analyze, test, hypothesize, and use only the best mechanics with your
          creative AI producer.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <button
            onClick={handleGetStarted}
            disabled={!isLoaded}
            className="btn btn-primary btn-lg px-8 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
          >
            {!isLoaded ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <>
                Get Started
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Social Proof */}
        {/* <div className="flex flex-col items-center gap-3 mt-8 pt-8 border-t border-base-300/50">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full bg-linear-to-br from-base-300 to-base-200 border-2 border-base-100 flex items-center justify-center text-xs font-bold text-base-content/60"
              >
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
          <p className="text-sm text-base-content/60">
            Trusted by{" "}
            <span className="font-semibold text-base-content">500+</span>{" "}
            content creators
          </p>
        </div> */}
      </div>
    </section>
  );
};

export default Hero;
