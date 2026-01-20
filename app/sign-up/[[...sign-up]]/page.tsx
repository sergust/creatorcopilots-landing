"use client";

import { SignUp } from "@clerk/nextjs";
import { Suspense } from "react";

function SignUpContent() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp />
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
