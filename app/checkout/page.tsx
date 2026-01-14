"use client";

import { useEffect, useState, Suspense } from "react";
import { useUser } from "@clerk/nextjs";
import { useSearchParams, useRouter } from "next/navigation";
import apiClient from "@/libs/api";

function CheckoutContent() {
  const { isSignedIn, isLoaded, user } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const variantId = searchParams.get("variant");

  useEffect(() => {
    if (!isLoaded) return;

    // Not signed in - redirect to sign-in
    if (!isSignedIn) {
      router.push(
        `/sign-in?redirect_url=${encodeURIComponent(`/checkout?variant=${variantId}`)}`
      );
      return;
    }

    // No variant specified
    if (!variantId) {
      setError("No plan selected");
      return;
    }

    // User is signed in - proceed to checkout
    initiateCheckout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, variantId]);

  const initiateCheckout = async () => {
    try {
      const { url }: { url: string } = await apiClient.post(
        "/lemonsqueezy/create-checkout",
        {
          variantId,
          redirectUrl: "https://app.creatorcopilots.com/welcome",
        }
      );

      window.location.href = url;
    } catch (e) {
      console.error(e);
      setError("Failed to create checkout. Please try again.");
    }
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-error text-lg mb-4">{error}</div>
          <button
            onClick={() => router.push("/#pricing")}
            className="btn btn-primary"
          >
            Back to Pricing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center text-center">
        <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
        <p className="text-lg font-medium">
          {!isLoaded
            ? "Loading..."
            : isSignedIn
              ? `Welcome${user?.firstName ? `, ${user.firstName}` : ""}! Redirecting to checkout...`
              : "Redirecting to sign in..."}
        </p>
        <p className="text-base-content/60 mt-2">
          {isSignedIn && "You'll be able to complete your purchase securely."}
        </p>
      </div>
    </div>
  );
}

function CheckoutFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center text-center">
        <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
        <p className="text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutContent />
    </Suspense>
  );
}
