"use client";

import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import config from "@/config";

interface UserPublicMetadata {
  hasAccess?: boolean;
  [key: string]: unknown;
}

const CTA = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  const handleClick = () => {
    // If auth is still loading or user not signed in, go to pricing
    if (!isLoaded || !isSignedIn) {
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
    <section
      className="relative hero overflow-hidden min-h-screen"
      data-fast-scroll="scroll_to_cta"
    >
      <Image
        src="https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        alt="Content creator background"
        className="object-cover w-full"
        fill
      />
      <div className="relative hero-overlay bg-neutral bg-opacity-70"></div>


      <div className="relative hero-content text-center text-neutral-content p-8">
        <div className="flex flex-col items-center max-w-xl p-8 md:p-0">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            Takes less than 60 seconds
          </div>

          <h2 className="font-bold text-4xl md:text-6xl tracking-tight mb-8 md:mb-12 leading-tight">
            Stop guessing. Start growing.
          </h2>
          <p className="text-lg opacity-80 mb-12 md:mb-16">
            Upload your reel. Get your diagnosis in 60 seconds. Know exactly
            what&apos;s holding you back.
          </p>

          <button
            onClick={handleClick}
            className="btn btn-gradient btn-lg px-10 group shadow-lg hover:shadow-xl transition-all"
            data-fast-goal="final_cta_click"
          >
            Upload Your Reel
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="size-[1.2em] group-hover:-translate-y-0.5 transition-transform"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
              />
            </svg>
          </button>

          {/* Social Proof */}
          {/* <div className="flex flex-col items-center gap-4 mt-10">
            <div className="avatar-group -space-x-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="avatar avatar-placeholder">
                  <div className="w-10 rounded-full bg-linear-to-br from-primary to-secondary text-white flex items-center justify-center">
                    <span className="text-sm font-semibold">
                      {String.fromCharCode(64 + i)}
                    </span>
                  </div>
                </div>
              ))}
              <div className="avatar avatar-placeholder">
                <div className="w-10 rounded-full bg-neutral text-neutral-content flex items-center justify-center">
                  <span className="text-xs">+2k</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-neutral-content/80">
              Join{" "}
              <span className="font-semibold text-white">2,000+</span> creators
              already growing
            </p>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default CTA;
