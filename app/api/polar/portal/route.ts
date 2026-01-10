import { CustomerPortal } from "@polar-sh/nextjs";
import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export const GET = CustomerPortal({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: process.env.NODE_ENV === "development" ? "sandbox" : "production",
  getCustomerId: async (req: NextRequest) => {
    // Get the Clerk user and their Polar customer ID from metadata
    const { userId } = await auth();
    if (!userId) {
      return "";
    }
    // The Polar customer ID should be stored in Clerk user metadata after checkout
    // For now, return empty string - this will be populated by the webhook
    return "";
  },
});
