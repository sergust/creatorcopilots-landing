/* eslint-disable @next/next/no-img-element */
"use client";

import { SignInButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";
import config from "@/config";

// A simple button to sign in with Clerk.
// It automatically redirects user to callbackUrl (config.auth.callbackUrl) after login, which is normally a private page for users to manage their accounts.
// If the user is already logged in, it will show their profile picture & redirect them to callbackUrl immediately.
const ButtonSignin = ({
  text = "Get started",
  extraStyle,
}: {
  text?: string;
  extraStyle?: string;
}) => {
  const { user } = useUser();

  return (
    <>
      <SignedIn>
        <Link
          href={config.auth.callbackUrl}
          className={`btn ${extraStyle ? extraStyle : ""}`}
        >
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt={user.firstName || "Account"}
              className="w-6 h-6 rounded-full shrink-0"
              referrerPolicy="no-referrer"
              width={24}
              height={24}
            />
          ) : (
            <span className="w-6 h-6 bg-base-300 flex justify-center items-center rounded-full shrink-0">
              {user?.firstName?.charAt(0) || user?.emailAddresses?.[0]?.emailAddress?.charAt(0)}
            </span>
          )}
          {user?.firstName || user?.emailAddresses?.[0]?.emailAddress || "Account"}
        </Link>
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal" forceRedirectUrl={config.auth.callbackUrl}>
          <button className={`btn ${extraStyle ? extraStyle : ""}`}>
            {text}
          </button>
        </SignInButton>
      </SignedOut>
    </>
  );
};

export default ButtonSignin;
