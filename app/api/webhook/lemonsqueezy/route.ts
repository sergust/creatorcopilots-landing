import config from "@/config";
import { clerkClient } from "@clerk/nextjs/server";
import crypto from "crypto";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Helper function to find a Clerk user by Lemon Squeezy customer ID
async function findUserByLemonSqueezyCustomerId(customerId: string) {
  const client = await clerkClient();
  const users = await client.users.getUserList({ limit: 100 });
  return users.data.find(
    (user) =>
      (user.publicMetadata as { lemonSqueezyCustomerId?: string })
        ?.lemonSqueezyCustomerId === customerId
  );
}

// This is where we receive Lemon Squeezy webhook events
// It's used to update user data, send emails, etc...
// User data is stored in Clerk metadata
// See more: https://shipfa.st/docs/features/payments
export async function POST(req: NextRequest) {
  const text = await req.text();

  const hmac = crypto.createHmac(
    "sha256",
    process.env.LEMONSQUEEZY_SIGNING_SECRET!
  );
  const digest = Buffer.from(hmac.update(text).digest("hex"), "utf8");
  const headersList = await headers();
  const signature = Buffer.from(headersList.get("x-signature") || "", "utf8");

  // Verify the signature
  if (!crypto.timingSafeEqual(digest, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  // Get the payload
  const payload = JSON.parse(text);

  const eventName = payload.meta.event_name;
  const customerId = payload.data.attributes.customer_id?.toString();

  try {
    switch (eventName) {
      case "order_created": {
        // First payment is successful
        // ✅ Grant access to the product
        const userId = payload.meta?.custom_data?.userId;
        const email = payload.data.attributes.user_email;
        const variantId =
          payload.data.attributes.first_order_item?.variant_id?.toString();
        const plan = config.lemonsqueezy.plans.find(
          (p) => p.variantId === variantId
        );

        if (!plan) break;

        const client = await clerkClient();

        if (userId) {
          // User was logged in during checkout - update their metadata
          await client.users.updateUser(userId, {
            publicMetadata: {
              lemonSqueezyCustomerId: customerId,
              lemonSqueezyVariantId: variantId,
              hasAccess: true,
            },
          });
        } else if (email) {
          // User was not logged in - try to find by email
          const users = await client.users.getUserList({
            emailAddress: [email],
          });
          if (users.data.length > 0) {
            await client.users.updateUser(users.data[0].id, {
              publicMetadata: {
                lemonSqueezyCustomerId: customerId,
                lemonSqueezyVariantId: variantId,
                hasAccess: true,
              },
            });
          }
          // If no user found, they'll need to sign up and we can match by email later
        }

        // Extra: send email with user link, product page, etc...
        // try {
        //   await sendEmail(...);
        // } catch (e) {
        //   console.error("Email issue:" + e?.message);
        // }

        break;
      }

      case "subscription_payment_success": {
        // Recurring payment succeeded
        // ✅ Ensure access is granted
        if (!customerId) break;

        const user = await findUserByLemonSqueezyCustomerId(customerId);

        if (user) {
          const client = await clerkClient();
          await client.users.updateUser(user.id, {
            publicMetadata: {
              ...user.publicMetadata,
              hasAccess: true,
            },
          });
        }

        break;
      }

      case "subscription_cancelled": {
        // The customer subscription was cancelled
        // ❌ Revoke access to the product
        if (!customerId) break;

        const user = await findUserByLemonSqueezyCustomerId(customerId);

        if (user) {
          const client = await clerkClient();
          await client.users.updateUser(user.id, {
            publicMetadata: {
              ...user.publicMetadata,
              hasAccess: false,
            },
          });
        }

        break;
      }

      case "subscription_payment_failed": {
        // A recurring payment failed
        // You can notify the user or wait for Lemon Squeezy's dunning
        // The subscription_cancelled event will fire if all retries fail
        break;
      }

      default:
      // Unhandled event type
    }
  } catch (e) {
    console.error("lemonsqueezy error: ", (e as Error).message);
  }

  return NextResponse.json({});
}
