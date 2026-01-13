import config from "@/config";
import { clerkClient } from "@clerk/nextjs/server";
import crypto from "crypto";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Public metadata - safe for frontend access (UI, access control)
interface PublicSubscriptionMetadata {
  hasAccess?: boolean;
  planName?: string;
  subscriptionStatus?: string;
  [key: string]: unknown;
}

// Private metadata - backend-only, contains sensitive billing data
interface PrivateSubscriptionMetadata {
  lemonSqueezyCustomerId?: string;
  lemonSqueezySubscriptionId?: string;
  lemonSqueezyVariantId?: string;
  lemonSqueezyOrderId?: string;
  lemonSqueezyProductId?: string;
  renewsAt?: string | null;
  endsAt?: string | null;
  trialEndsAt?: string | null;
  billingAnchor?: number;
  cardBrand?: string;
  cardLastFour?: string;
  customerPortalUrl?: string;
  createdFromPayment?: boolean;
  [key: string]: unknown;
}

// Helper function to find a Clerk user by Lemon Squeezy customer ID
async function findUserByLemonSqueezyCustomerId(customerId: string) {
  const client = await clerkClient();
  const users = await client.users.getUserList({ limit: 100 });
  return users.data.find(
    (user) =>
      (user.privateMetadata as PrivateSubscriptionMetadata)?.lemonSqueezyCustomerId ===
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
      hasAccess: false,
    } as PublicSubscriptionMetadata,
    privateMetadata: {
      lemonSqueezyCustomerId: customerId,
      createdFromPayment: true,
    } as PrivateSubscriptionMetadata,
  });

  console.log(`[LemonSqueezy Webhook] Created new Clerk user ${newUser.id} for email ${email}`);
  return newUser;
}

// This is where we receive Lemon Squeezy webhook events
// It's used to update user data, send emails, etc...
// User data is stored in Clerk metadata (public for access, private for billing)
// See more: https://docs.lemonsqueezy.com/guides/developer-guide/webhooks
export async function POST(req: NextRequest) {
  const text = await req.text();

  const hmac = crypto.createHmac(
    "sha256",
    process.env.LEMONSQUEEZY_SIGNING_SECRET!
  );
  const digest = Buffer.from(hmac.update(text).digest("hex"), "hex");
  const headersList = await headers();
  const signature = Buffer.from(headersList.get("x-signature") || "", "hex");

  // Verify the signature
  if (signature.length === 0 || !crypto.timingSafeEqual(digest, signature)) {
    console.error("[LemonSqueezy Webhook] Invalid signature");
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  // Get the payload
  const payload = JSON.parse(text);

  const eventName = payload.meta.event_name;
  const attributes = payload.data.attributes;
  const customerId = attributes.customer_id?.toString();

  console.log(`[LemonSqueezy Webhook] Received event: ${eventName}, customerId: ${customerId}`);

  try {
    switch (eventName) {
      case "order_created": {
        // First payment is successful
        // ✅ Grant access to the product
        const userId = payload.meta?.custom_data?.userId;
        const email = attributes.user_email;
        const orderId = payload.data.id?.toString();
        const variantId = attributes.first_order_item?.variant_id?.toString();
        const productId = attributes.first_order_item?.product_id?.toString();
        const subscriptionId = attributes.first_order_item?.subscription_id?.toString();
        const plan = config.lemonsqueezy.plans.find(
          (p) => p.variantId === variantId
        );

        if (!plan) {
          console.log(`[LemonSqueezy Webhook] order_created: No matching plan for variantId ${variantId}`);
          break;
        }

        const client = await clerkClient();

        const publicMetadata: PublicSubscriptionMetadata = {
          hasAccess: true,
          subscriptionStatus: "active",
          planName: plan.name,
        };

        const privateMetadata: PrivateSubscriptionMetadata = {
          lemonSqueezyCustomerId: customerId,
          lemonSqueezyVariantId: variantId,
          lemonSqueezySubscriptionId: subscriptionId,
          lemonSqueezyOrderId: orderId,
          lemonSqueezyProductId: productId,
        };

        if (userId) {
          // User was logged in during checkout - update their metadata
          console.log(`[LemonSqueezy Webhook] order_created: Updating existing user ${userId}`);
          await client.users.updateUser(userId, {
            publicMetadata: { ...publicMetadata },
            privateMetadata: { ...privateMetadata },
          });
        } else if (email) {
          // User was not logged in - find or create user
          const user = await findOrCreateClerkUser(email, customerId!);
          console.log(`[LemonSqueezy Webhook] order_created: Updating user ${user.id} found by email ${email}`);
          await client.users.updateUser(user.id, {
            publicMetadata: {
              ...user.publicMetadata,
              ...publicMetadata,
            },
            privateMetadata: {
              ...user.privateMetadata,
              ...privateMetadata,
            },
          });
        }

        break;
      }

      case "subscription_created": {
        // New subscription created - contains full subscription details
        // ✅ Grant access and store comprehensive subscription data
        if (!customerId) break;

        const userId = payload.meta?.custom_data?.userId;
        const email = attributes.user_email;
        const subscriptionId = payload.data.id?.toString();
        const variantId = attributes.variant_id?.toString();
        const productId = attributes.product_id?.toString();
        const orderId = attributes.order_id?.toString();
        const subscriptionStatus = attributes.status;
        const plan = config.lemonsqueezy.plans.find(
          (p) => p.variantId === variantId
        );

        const activeStatuses = ["active", "on_trial"];
        const hasAccess = activeStatuses.includes(subscriptionStatus);

        const client = await clerkClient();

        const publicMetadata: PublicSubscriptionMetadata = {
          hasAccess,
          subscriptionStatus,
          planName: plan?.name,
        };

        const privateMetadata: PrivateSubscriptionMetadata = {
          lemonSqueezyCustomerId: customerId,
          lemonSqueezySubscriptionId: subscriptionId,
          lemonSqueezyVariantId: variantId,
          lemonSqueezyProductId: productId,
          lemonSqueezyOrderId: orderId,
          renewsAt: attributes.renews_at,
          endsAt: attributes.ends_at,
          trialEndsAt: attributes.trial_ends_at,
          billingAnchor: attributes.billing_anchor,
          cardBrand: attributes.card_brand,
          cardLastFour: attributes.card_last_four,
          customerPortalUrl: attributes.urls?.customer_portal,
        };

        if (userId) {
          console.log(`[LemonSqueezy Webhook] subscription_created: Updating user ${userId}`);
          await client.users.updateUser(userId, {
            publicMetadata: { ...publicMetadata },
            privateMetadata: { ...privateMetadata },
          });
        } else if (email) {
          const user = await findOrCreateClerkUser(email, customerId);
          console.log(`[LemonSqueezy Webhook] subscription_created: Updating user ${user.id} found by email`);
          await client.users.updateUser(user.id, {
            publicMetadata: {
              ...user.publicMetadata,
              ...publicMetadata,
            },
            privateMetadata: {
              ...user.privateMetadata,
              ...privateMetadata,
            },
          });
        }

        break;
      }

      case "subscription_payment_success": {
        // Recurring payment succeeded
        // ✅ Ensure access is granted and update renewal date
        if (!customerId) break;

        const user = await findUserByLemonSqueezyCustomerId(customerId);

        if (user) {
          console.log(`[LemonSqueezy Webhook] subscription_payment_success: Updating user ${user.id}`);
          const client = await clerkClient();
          await client.users.updateUser(user.id, {
            publicMetadata: {
              ...user.publicMetadata,
              hasAccess: true,
              subscriptionStatus: "active",
            },
            privateMetadata: {
              ...user.privateMetadata,
              renewsAt: attributes.renews_at,
              cardBrand: attributes.card_brand,
              cardLastFour: attributes.card_last_four,
            },
          });
        } else {
          console.log(`[LemonSqueezy Webhook] subscription_payment_success: No user found for customerId ${customerId}`);
        }

        break;
      }

      case "subscription_updated": {
        // Subscription was updated (plan change, pause, resume, etc.)
        // ✅ Sync the subscription status with Clerk
        if (!customerId) break;

        const subscriptionStatus = attributes.status;
        const variantId = attributes.variant_id?.toString();
        const subscriptionId = payload.data.id?.toString();
        const plan = config.lemonsqueezy.plans.find(
          (p) => p.variantId === variantId
        );

        const user = await findUserByLemonSqueezyCustomerId(customerId);

        if (user) {
          console.log(`[LemonSqueezy Webhook] subscription_updated: Updating user ${user.id}, status: ${subscriptionStatus}`);
          const client = await clerkClient();
          // Determine access based on subscription status
          // Active, on_trial = has access
          // Cancelled, expired, past_due, unpaid, paused = no access
          const activeStatuses = ["active", "on_trial"];
          const hasAccess = activeStatuses.includes(subscriptionStatus);

          await client.users.updateUser(user.id, {
            publicMetadata: {
              ...user.publicMetadata,
              hasAccess,
              subscriptionStatus,
              planName: plan?.name || (user.publicMetadata as PublicSubscriptionMetadata)?.planName,
            },
            privateMetadata: {
              ...user.privateMetadata,
              lemonSqueezyVariantId: variantId,
              lemonSqueezySubscriptionId: subscriptionId,
              renewsAt: attributes.renews_at,
              endsAt: attributes.ends_at,
              trialEndsAt: attributes.trial_ends_at,
              billingAnchor: attributes.billing_anchor,
              cardBrand: attributes.card_brand,
              cardLastFour: attributes.card_last_four,
              customerPortalUrl: attributes.urls?.customer_portal,
            },
          });
        } else {
          console.log(`[LemonSqueezy Webhook] subscription_updated: No user found for customerId ${customerId}`);
        }

        break;
      }

      case "subscription_cancelled": {
        // The customer subscription was cancelled
        // ❌ Revoke access to the product (or keep until ends_at)
        if (!customerId) break;

        const user = await findUserByLemonSqueezyCustomerId(customerId);

        if (user) {
          console.log(`[LemonSqueezy Webhook] subscription_cancelled: Updating user ${user.id}`);
          const client = await clerkClient();
          await client.users.updateUser(user.id, {
            publicMetadata: {
              ...user.publicMetadata,
              hasAccess: false,
              subscriptionStatus: "cancelled",
            },
            privateMetadata: {
              ...user.privateMetadata,
              endsAt: attributes.ends_at,
            },
          });
        } else {
          console.log(`[LemonSqueezy Webhook] subscription_cancelled: No user found for customerId ${customerId}`);
        }

        break;
      }

      case "subscription_expired": {
        // The subscription has fully expired (after cancellation grace period)
        // ❌ Revoke access to the product
        if (!customerId) break;

        const user = await findUserByLemonSqueezyCustomerId(customerId);

        if (user) {
          console.log(`[LemonSqueezy Webhook] subscription_expired: Updating user ${user.id}`);
          const client = await clerkClient();
          await client.users.updateUser(user.id, {
            publicMetadata: {
              ...user.publicMetadata,
              hasAccess: false,
              subscriptionStatus: "expired",
            },
            privateMetadata: {
              ...user.privateMetadata,
              endsAt: attributes.ends_at,
              renewsAt: null,
            },
          });
        } else {
          console.log(`[LemonSqueezy Webhook] subscription_expired: No user found for customerId ${customerId}`);
        }

        break;
      }

      case "subscription_payment_failed": {
        // A recurring payment failed
        // Update status but don't revoke access yet (dunning process)
        if (!customerId) break;

        const user = await findUserByLemonSqueezyCustomerId(customerId);

        if (user) {
          console.log(`[LemonSqueezy Webhook] subscription_payment_failed: Updating user ${user.id}`);
          const client = await clerkClient();
          await client.users.updateUser(user.id, {
            publicMetadata: {
              ...user.publicMetadata,
              subscriptionStatus: "past_due",
            },
          });
        } else {
          console.log(`[LemonSqueezy Webhook] subscription_payment_failed: No user found for customerId ${customerId}`);
        }

        break;
      }

      case "subscription_paused": {
        // Subscription was paused
        if (!customerId) break;

        const user = await findUserByLemonSqueezyCustomerId(customerId);

        if (user) {
          console.log(`[LemonSqueezy Webhook] subscription_paused: Updating user ${user.id}`);
          const client = await clerkClient();
          await client.users.updateUser(user.id, {
            publicMetadata: {
              ...user.publicMetadata,
              hasAccess: false,
              subscriptionStatus: "paused",
            },
            privateMetadata: {
              ...user.privateMetadata,
              // Store pause info if available
              renewsAt: attributes.pause?.resumes_at || null,
            },
          });
        } else {
          console.log(`[LemonSqueezy Webhook] subscription_paused: No user found for customerId ${customerId}`);
        }

        break;
      }

      case "subscription_resumed": {
        // Subscription was resumed after being paused
        if (!customerId) break;

        const user = await findUserByLemonSqueezyCustomerId(customerId);

        if (user) {
          console.log(`[LemonSqueezy Webhook] subscription_resumed: Updating user ${user.id}`);
          const client = await clerkClient();
          await client.users.updateUser(user.id, {
            publicMetadata: {
              ...user.publicMetadata,
              hasAccess: true,
              subscriptionStatus: "active",
            },
            privateMetadata: {
              ...user.privateMetadata,
              renewsAt: attributes.renews_at,
            },
          });
        } else {
          console.log(`[LemonSqueezy Webhook] subscription_resumed: No user found for customerId ${customerId}`);
        }

        break;
      }

      default:
        console.log(`[LemonSqueezy Webhook] Unhandled event type: ${eventName}`);
    }
  } catch (e) {
    console.error(`[LemonSqueezy Webhook] Error processing ${eventName}:`, (e as Error).message);
  }

  return NextResponse.json({ received: true });
}
