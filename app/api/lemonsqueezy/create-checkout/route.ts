import { createLemonSqueezyCheckout } from "@/libs/lemonsqueezy";
import { auth, currentUser } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// This function is used to create a Lemon Squeezy Checkout Session (one-time payment or subscription)
// It's called by the <ButtonCheckout /> component
// By default, it doesn't force users to be authenticated. But if they are, it will prefill the Checkout data with their email
export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.variantId) {
    return NextResponse.json(
      { error: "Variant ID is required" },
      { status: 400 }
    );
  } else if (!body.redirectUrl) {
    return NextResponse.json(
      { error: "Redirect URL is required" },
      { status: 400 }
    );
  }

  try {
    const { userId } = await auth();
    const user = userId ? await currentUser() : null;

    // Get DataFast cookies for revenue attribution
    const cookieStore = await cookies();
    const datafastVisitorId = cookieStore.get("datafast_visitor_id")?.value;
    const datafastSessionId = cookieStore.get("datafast_session_id")?.value;

    const { variantId, redirectUrl } = body;

    const checkoutURL = await createLemonSqueezyCheckout({
      variantId,
      redirectUrl,
      // If user is logged in, this will automatically prefill Checkout data like email for faster checkout
      userId: userId || undefined,
      email: user?.emailAddresses?.[0]?.emailAddress,
      // DataFast revenue attribution
      datafastVisitorId,
      datafastSessionId,
      // If you send coupons from the frontend, you can pass it here
      // discountCode: body.discountCode,
    });

    if (!checkoutURL) {
      return NextResponse.json(
        { error: "Failed to create checkout" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: checkoutURL });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
