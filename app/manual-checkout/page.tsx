"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useSearchParams, useRouter } from "next/navigation";
import apiClient from "@/libs/api";
import config from "@/config";
import Link from "next/link";

interface NotifyResponse {
  success: boolean;
  plan: {
    name: string;
    price: number;
  };
}

function ManualCheckoutContent() {
  const { isSignedIn, isLoaded, user } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [error, setError] = useState<string | null>(null);
  const [planInfo, setPlanInfo] = useState<{
    name: string;
    price: number;
  } | null>(null);
  const hasCalledApi = useRef(false);

  const variantId = searchParams.get("variant");

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      const returnUrl = `/manual-checkout?variant=${variantId}`;
      router.push(`/sign-in?redirect_url=${encodeURIComponent(returnUrl)}`);
      return;
    }

    if (!variantId) {
      setError("No plan selected");
      setStatus("error");
      return;
    }

    // Prevent multiple API calls on re-renders
    if (hasCalledApi.current) return;
    hasCalledApi.current = true;

    sendNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, variantId]);

  const sendNotifications = async () => {
    try {
      const response: NotifyResponse = await apiClient.post(
        "/manual-checkout/notify",
        { variantId }
      );

      if (response.success) {
        setPlanInfo(response.plan);
        setStatus("success");
      } else {
        throw new Error("Failed to process request");
      }
    } catch (e) {
      console.error(e);
      setError(
        "Failed to process your request. Please try again or contact support."
      );
      setStatus("error");
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
          <p className="text-lg font-medium">
            {!isLoaded
              ? "Loading..."
              : isSignedIn
                ? "Processing your request..."
                : "Redirecting to sign in..."}
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <svg
              className="w-16 h-16 mx-auto text-error"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-base-content/70 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/#pricing")}
              className="btn btn-primary"
            >
              Back to Pricing
            </button>
            {config.resend.supportEmail && (
              <a
                href={`mailto:${config.resend.supportEmail}`}
                className="btn btn-outline"
              >
                Contact Support
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="mb-6">
          <svg
            className="w-20 h-20 mx-auto text-success"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold mb-4">
          Thank you{user?.firstName ? `, ${user.firstName}` : ""}!
        </h1>

        <p className="text-lg text-base-content/80 mb-2">
          Your interest in the <strong>{planInfo?.name}</strong> plan has been
          received.
        </p>

        <p className="text-base-content/60 mb-8">
          We&apos;ve sent a confirmation to{" "}
          <strong>{user?.emailAddresses?.[0]?.emailAddress}</strong>.
          <br />
          Our team will reach out shortly to complete your purchase.
        </p>

        <div className="bg-base-200 rounded-lg p-6 mb-8">
          <h2 className="font-semibold mb-2">What happens next?</h2>
          <ol className="text-left text-base-content/70 space-y-2 list-decimal list-inside">
            <li>Check your email for confirmation</li>
            <li>Our team will contact you within 24 hours</li>
            <li>Complete your payment securely</li>
            <li>Get instant access to {config.appName}</li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn btn-primary">
            Back to Home
          </Link>
          {config.resend.supportEmail && (
            <a
              href={`mailto:${config.resend.supportEmail}`}
              className="btn btn-outline"
            >
              Contact Us
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function ManualCheckoutFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center text-center">
        <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
        <p className="text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
}

export default function ManualCheckoutPage() {
  return (
    <Suspense fallback={<ManualCheckoutFallback />}>
      <ManualCheckoutContent />
    </Suspense>
  );
}
