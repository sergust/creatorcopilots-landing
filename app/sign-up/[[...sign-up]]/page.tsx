"use client";

import { SignUp } from "@clerk/nextjs";
import { Suspense, useMemo } from "react";

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

function SignUpContent() {
  const unsafeMetadata = useMemo(() => {
    const datafastVisitorId = getCookie("datafast_visitor_id");
    return datafastVisitorId
      ? { datafast_visitor_id: datafastVisitorId }
      : {};
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp unsafeMetadata={unsafeMetadata} />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-base-100">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-base-content/70">Signing up...</p>
          </div>
        </div>
      }
    >
      <SignUpContent />
    </Suspense>
  );
}
