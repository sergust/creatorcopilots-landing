"use client";

import { useRef, useState } from "react";
import type { JSX } from "react";

// <FAQ> component is a lsit of <Item> component
// Just import the FAQ & add your FAQ content to the const faqList arrayy below.

interface FAQItemProps {
  question: string;
  answer: JSX.Element;
}

const faqList: FAQItemProps[] = [
  {
    question: "What do I need to get started?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        Just two things: your reel video file and a screenshot of your Instagram
        retention graph from Insights. Upload both, and our AI does the rest.
      </div>
    ),
  },
  {
    question: "How is this different from ChatGPT or other AI tools?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        ChatGPT gives generic advice. Reels Copilot syncs YOUR video with YOUR
        retention data and diagnoses YOUR specific problems. We show you the
        exact second viewers leave and explain why—not vague tips, but precise
        analysis of your content.
      </div>
    ),
  },
  {
    question: "Will this work for my niche?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        Yes. Retention psychology works across all niches. Whether you&apos;re in
        fitness, finance, cooking, or lifestyle—viewers drop off for the same
        core reasons: weak hooks, early payoffs, pacing issues. We identify what
        applies to your specific content.
      </div>
    ),
  },
  {
    question: "How accurate is the analysis?",
    answer: (
      <div className="space-y-2 leading-relaxed">
        We use advanced AI to parse retention graphs with high accuracy. The
        synced diagnosis shows you exactly what happened at each drop-off
        point—you can verify it yourself by watching the video at that timestamp.
      </div>
    ),
  },
  {
    question: "Can I get a refund?",
    answer: (
      <p>
        Yes! We offer a 7-day refund policy, no questions asked. If Reels Copilot
        isn&apos;t helping you understand your content better, just reach out by
        email.
      </p>
    ),
  },
];

const FaqItem = ({ item }: { item: FAQItemProps }) => {
  const accordion = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li>
      <button
        className="relative flex gap-2 items-center w-full py-5 text-base font-semibold text-left border-t md:text-lg border-base-content/10"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        aria-expanded={isOpen}
        data-fast-goal="faq_expand"
      >
        <span
          className={`flex-1 text-base-content ${isOpen ? "text-primary" : ""}`}
        >
          {item?.question}
        </span>
        <svg
          className={`flex-shrink-0 w-4 h-4 ml-auto fill-current`}
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center transition duration-200 ease-out ${
              isOpen && "rotate-180"
            }`}
          />
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center rotate-90 transition duration-200 ease-out ${
              isOpen && "rotate-180 hidden"
            }`}
          />
        </svg>
      </button>

      <div
        ref={accordion}
        className={`transition-all duration-300 ease-in-out opacity-80 overflow-hidden`}
        style={
          isOpen
            ? { maxHeight: accordion?.current?.scrollHeight, opacity: 1 }
            : { maxHeight: 0, opacity: 0 }
        }
      >
        <div className="pb-5 leading-relaxed">{item?.answer}</div>
      </div>
    </li>
  );
};

const FAQ = () => {
  return (
    <section className="bg-base-200" id="faq" data-fast-scroll="scroll_to_faq">
      <div className="py-24 px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        <div className="flex flex-col text-left basis-1/2">
          <p className="inline-block font-semibold text-primary mb-4">FAQ</p>
          <p className="sm:text-4xl text-3xl font-extrabold text-base-content">
            Frequently Asked Questions
          </p>
        </div>

        <ul className="basis-1/2">
          {faqList.map((item, i) => (
            <FaqItem key={i} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FAQ;
