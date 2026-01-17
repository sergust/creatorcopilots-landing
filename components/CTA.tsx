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
    <section className="relative hero overflow-hidden min-h-screen">
      <Image
        src="https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        alt="Content creator background"
        className="object-cover w-full"
        fill
      />
      <div className="relative hero-overlay bg-neutral bg-opacity-70"></div>
      <div className="relative hero-content text-center text-neutral-content p-8">
        <div className="flex flex-col items-center max-w-xl p-8 md:p-0">
          <h2 className="font-bold text-3xl md:text-5xl tracking-tight mb-8 md:mb-12">
            Stop guessing. Start knowing.
          </h2>
          <p className="text-lg opacity-80 mb-12 md:mb-16">
            Your next viral reel is one diagnosis away. Upload your reel and see
            exactly what&apos;s holding you back.
          </p>

          <button
            onClick={handleClick}
            disabled={!isLoaded}
            className="btn btn-primary btn-wide"
          >
            {!isLoaded ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Upload Your Reel"
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
