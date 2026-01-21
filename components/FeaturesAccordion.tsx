"use client";

import { useState, useRef } from "react";
import type { JSX } from "react";
import Image from "next/image";

interface Feature {
  title: string;
  description: string;
  type?: "video" | "image";
  path?: string;
  format?: string;
  alt?: string;
  svg?: JSX.Element;
}

// The features array is a list of features that will be displayed in the accordion.
const features = [
  {
    title: "See What Instagram Won't Show You",
    description:
      "Upload your Insights screenshot. AI parses the retention curve, identifies every drop-off point, and syncs it to the exact moment in your video. No more guessing.",
    type: "video",
    path: "https://k4t9lyhlmz.ufs.sh/f/h4tNWAuimNTfs8ezxedJAvKaSF8uzON6BQ05hpR3X9lxgbIG",
    format: "video/mp4",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
        />
      </svg>
    ),
  },
  {
    title: "Pinpoint the Problem Second",
    description:
      "Watch your video with the retention graph overlaid. When 30% of viewers leave at 0:08, see exactly what you said and showed at that moment.",
    type: "video",
    path: "https://k4t9lyhlmz.ufs.sh/f/h4tNWAuimNTf7KfAY18mBrbNZDvUlC5LWRA4uw7ixz6gnMdf",
    format: "video/mp4",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
        />
      </svg>
    ),
  },
  {
    title: "Not Tips—Exact Words",
    description:
      "No generic advice. Get specific rewrites: Replace 'Here's how to grow on Instagram' with 'Nobody talks about this, but I gained 50k followers by...' Ready to copy-paste.",
    type: "video",
    path: "https://k4t9lyhlmz.ufs.sh/f/h4tNWAuimNTftPgVkHpRhgG8y2k3cfwZbuINO9Ezxi5Rjneo",
    format: "video/mp4",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
        />
      </svg>
    ),
  },
  {
    title: "Ask Why, Get Real Answers",
    description:
      "Chat with AI about specific moments. 'Why did viewers leave at 0:15?' Get explanations like: 'You revealed the payoff too early—the mystery was gone.'",
    type: "video",
    path: "https://k4t9lyhlmz.ufs.sh/f/h4tNWAuimNTfotFrbJVSBZ5GJQfqHbugaLWjnURTyC1ecmxV",
    format: "video/mp4",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
        />
      </svg>
    ),
  },
] as Feature[];

// An SEO-friendly accordion component including the title and a description (when clicked.)
const Item = ({
  feature,
  isOpen,
  setFeatureSelected,
}: {
  feature: Feature;
  isOpen: boolean;
  setFeatureSelected: () => void;
}) => {
  const accordion = useRef<HTMLDivElement>(null);
  const { title, description, svg } = feature;

  return (
    <li>
      <button
        className="group relative flex items-start gap-4 w-full py-4 text-left"
        onClick={(e) => {
          e.preventDefault();
          setFeatureSelected();
        }}
        aria-expanded={isOpen}
        data-fast-goal="feature_select"
      >
        {/* Icon */}
        <div
          className={`shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            isOpen
              ? "border-primary bg-primary text-white"
              : "border-base-300 text-base-content/40 group-hover:border-base-content/40"
          }`}
        >
          {svg}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-1">
          <h3
            className={`font-semibold text-base md:text-lg transition-colors duration-200 ${
              isOpen
                ? "text-base-content"
                : "text-base-content/60 group-hover:text-base-content/80"
            }`}
          >
            {title}
          </h3>

          {/* Description expands */}
          <div
            ref={accordion}
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={
              isOpen
                ? { maxHeight: accordion?.current?.scrollHeight, opacity: 1 }
                : { maxHeight: 0, opacity: 0 }
            }
          >
            <p className="pt-2 text-sm md:text-base text-base-content/50 leading-relaxed pr-4">
              {description}
            </p>
          </div>
        </div>

        {/* Arrow */}
        <svg
          className={`shrink-0 w-5 h-5 mt-2 transition-all duration-200 ${
            isOpen
              ? "text-primary rotate-90"
              : "text-base-content/20 group-hover:text-base-content/40"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </li>
  );
};

// A component to display the media (video or image) of the feature. If the type is not specified, it will display an empty div.
// Video are set to autoplay for best UX.
const Media = ({ feature }: { feature: Feature }) => {
  const { type, path, format, alt } = feature;
  const style = "rounded-2xl aspect-square w-full sm:w-[26rem]";
  const size = {
    width: 500,
    height: 500,
  };

  if (type === "video") {
    return (
      <video
        className={style}
        autoPlay
        muted
        loop
        playsInline
        controls
        width={size.width}
        height={size.height}
      >
        <source src={path} type={format} />
      </video>
    );
  } else if (type === "image") {
    return (
      <Image
        src={path}
        alt={alt}
        className={`${style} object-cover object-center`}
        width={size.width}
        height={size.height}
      />
    );
  } else {
    return <div className={`${style} !border-none`}></div>;
  }
};

// A component to display 2 to 5 features in an accordion.
// By default, the first feature is selected. When a feature is clicked, the others are closed.
const FeaturesAccordion = () => {
  const [featureSelected, setFeatureSelected] = useState<number>(0);

  return (
    <section
      className="relative py-24 md:py-32 space-y-24 md:space-y-32 max-w-7xl mx-auto bg-base-100 overflow-hidden"
      id="features"
      data-fast-scroll="scroll_to_features"
    >
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/5 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-secondary/5 blur-3xl -z-10 pointer-events-none" />

      <div className="px-8">
        <h2 className="font-extrabold text-3xl sm:text-4xl lg:text-6xl tracking-tight mb-12 md:mb-24">
          Everything you need to
          <br className="sm:hidden" /> finally{" "}
          <span className="relative inline-block">
            understand
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-primary rounded-full" />
          </span>{" "}
          your audience
        </h2>
        <div className="flex flex-col md:flex-row gap-12 md:gap-24">
          <div className="grid grid-cols-1 items-stretch gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-20">
            <ul className="w-full">
              {features.map((feature, i) => (
                <Item
                  key={feature.title}
                  feature={feature}
                  isOpen={featureSelected === i}
                  setFeatureSelected={() => setFeatureSelected(i)}
                />
              ))}
            </ul>

            {/* Media with entrance animation */}
            <div className="animate-media-enter" key={featureSelected}>
              <Media feature={features[featureSelected]} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesAccordion;
