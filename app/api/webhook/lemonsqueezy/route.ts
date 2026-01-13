import config from "@/config";
import { clerkClient } from "@clerk/nextjs/server";
import crypto from "crypto";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface SubscriptionMetadata {
  lemonSqueezyCustomerId?: string;
  lemonSqueezyVariantId?: string;
  lemonSqueezySubscriptionId?: string;
  hasAccess?: boolean;
  subscriptionStatus?: string;
  planName?: string;
  createdFromPayment?: boolean;
  [key: string]: unknown;
}

// Helper function to find a Clerk user by Lemon Squeezy customer ID
async function findUserByLemonSqueezyCustomerId(customerId: string) {
  const client = await clerkClient();
  const users = await client.users.getUserList({ limit: 100 });
  return users.data.find(
    (user) =>
      (user.publicMetadata as SubscriptionMetadata)?.lemonSqueezyCustomerId ===
      customerId
  );
}

// Helper function to find or create a Clerk user
async function findOrCreateClerkUser(email: string, customerId: string) {
  const client = await clerkClient();

  // First, try to find by Lemon Squeezy customer ID
  const existingByCustomerId = await findUserByLemonSqueezyCustomerId(customerId);
  if (existingByCustomerId) {
    return existingByCustomerId;
  }

  // Second, try to find by email
  const usersByEmail = await client.users.getUserList({
    emailAddress: [email],
  });
  if (usersByEmail.data.length > 0) {
    return usersByEmail.data[0];
  }

  // User doesn't exist - create a new one
  // Generate a random password (user will need to reset it)
  const randomPassword = crypto.randomBytes(16).toString("hex") + "Aa1!";

  const newUser = await client.users.createUser({
    emailAddress: [email],
    password: randomPassword,
    skipPasswordRequirement: false,
    publicMetadata: {
      lemonSqueezyCustomerId: customerId,
      hasAccess: false,
      createdFromPayment: true,
    } as SubscriptionMetadata,
  });

  console.log(`Created new Clerk user ${newUser.id} for email ${email}`);
  return newUser;
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
        const subscriptionId =
          payload.data.attributes.first_order_item?.subscription_id?.toString();
        const plan = config.lemonsqueezy.plans.find(
          (p) => p.variantId === variantId
        );

        if (!plan) break;

        const client = await clerkClient();
        const subscriptionMetadata: SubscriptionMetadata = {
          lemonSqueezyCustomerId: customerId,
          lemonSqueezyVariantId: variantId,
          lemonSqueezySubscriptionId: subscriptionId,
          hasAccess: true,
          subscriptionStatus: "active",
          planName: plan.name,
        };

        if (userId) {
          // User was logged in during checkout - update their metadata
          await client.users.updateUser(userId, {
            publicMetadata: subscriptionMetadata,
          });
        } else if (email) {
          // User was not logged in - find or create user
          const user = await findOrCreateClerkUser(email, customerId!);
          await client.users.updateUser(user.id, {
            publicMetadata: {
              ...user.publicMetadata,
              ...subscriptionMetadata,
            },
          });
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
              subscriptionStatus: "active",
            },
          });
        }

        break;
      }

      case "subscription_updated": {
        // Subscription was updated (plan change, pause, resume, etc.)
        // ✅ Sync the subscription status with Clerk
        if (!customerId) break;

        const subscriptionStatus = payload.data.attributes.status;
        const variantId = payload.data.attributes.variant_id?.toString();
        const subscriptionId = payload.data.id?.toString();
        const plan = config.lemonsqueezy.plans.find(
          (p) => p.variantId === variantId
        );

        const user = await findUserByLemonSqueezyCustomerId(customerId);

        if (user) {
          const client = await clerkClient();
          // Determine access based on subscription status
          // Active, on_trial, paused (with grace period) = has access
          // Cancelled, expired, past_due, unpaid = no access
          const activeStatuses = ["active", "on_trial"];
          const hasAccess = activeStatuses.includes(subscriptionStatus);

          await client.users.updateUser(user.id, {
            publicMetadata: {
              ...user.publicMetadata,
              lemonSqueezyVariantId: variantId,
              lemonSqueezySubscriptionId: subscriptionId,
              hasAccess,
              subscriptionStatus,
              planName: plan?.name || (user.publicMetadata as SubscriptionMetadata)?.planName,
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
              subscriptionStatus: "cancelled",
            },
          });
        }

        break;
      }

      case "subscription_expired": {
        // The subscription has fully expired (after cancellation grace period)
        // ❌ Revoke access to the product
        if (!customerId) break;

        const user = await findUserByLemonSqueezyCustomerId(customerId);

        if (user) {
          const client = await clerkClient();
          await client.users.updateUser(user.id, {
            publicMetadata: {
              ...user.publicMetadata,
              hasAccess: false,
              subscriptionStatus: "expired",
            },
          });
        }

        break;
      }

      case "subscription_payment_failed": {
        // A recurring payment failed
        // Update status but don't revoke access yet (dunning process)
        if (!customerId) break;

        const user = await findUserByLemonSqueezyCustomerId(customerId);

        if (user) {
          const client = await clerkClient();
          await client.users.updateUser(user.id, {
            publicMetadata: {
              ...user.publicMetadata,
              subscriptionStatus: "past_due",
            },
          });
        }

        break;
      }

      case "subscription_paused": {
        // Subscription was paused
        if (!customerId) break;

        const user = await findUserByLemonSqueezyCustomerId(customerId);

        if (user) {
          const client = await clerkClient();
          await client.users.updateUser(user.id, {
            publicMetadata: {
              ...user.publicMetadata,
              hasAccess: false,
              subscriptionStatus: "paused",
            },
          });
        }

        break;
      }

      case "subscription_resumed": {
        // Subscription was resumed after being paused
        if (!customerId) break;

        const user = await findUserByLemonSqueezyCustomerId(customerId);

        if (user) {
          const client = await clerkClient();
          await client.users.updateUser(user.id, {
            publicMetadata: {
              ...user.publicMetadata,
              hasAccess: true,
              subscriptionStatus: "active",
            },
          });
        }

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
