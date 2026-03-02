"use client";

import LandingHeroInput from './LandingHeroInput';

const Hero = () => {
  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-base-100 px-8 py-20 lg:py-32">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8">
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

        <p className="text-lg sm:text-xl text-base-content/70 leading-relaxed max-w-2xl">
          Analyze, test, hypothesize, and use only the best mechanics with your
          creative AI producer.
        </p>

        {/* URL input replaces the Get Started button */}
        <div className="w-full max-w-xl mt-4">
          <LandingHeroInput />
        </div>
      </div>
    </section>
  );
};

export default Hero;
