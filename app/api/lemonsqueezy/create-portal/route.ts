import { NextResponse } from "next/server";
import { createCustomerPortal } from "@/libs/lemonsqueezy";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  try {
    const user = await currentUser();
    const lemonSqueezyCustomerId = (
      user?.publicMetadata as { lemonSqueezyCustomerId?: string }
    )?.lemonSqueezyCustomerId;

    if (!lemonSqueezyCustomerId) {
      return NextResponse.json(
        {
          error:
            "You don't have a billing account yet. Make a purchase first.",
        },
        { status: 400 }
      );
    }

    const url = await createCustomerPortal({
      customerId: lemonSqueezyCustomerId,
    });

    if (!url) {
      return NextResponse.json(
        { error: "Failed to create portal session" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
