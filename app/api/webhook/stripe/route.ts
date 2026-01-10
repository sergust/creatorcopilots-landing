import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { clerkClient } from "@clerk/nextjs/server";
import configFile from "@/config";
import { findCheckoutSession } from "@/libs/stripe";

const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
  typescript: true,
});

// Helper function to find a Clerk user by Stripe customer ID
async function findUserByStripeCustomerId(customerId: string) {
  const client = await clerkClient();
  // Search through users to find one with matching stripeCustomerId in metadata
  // Note: For production, you might want to maintain a separate mapping or use Clerk's user search
  const users = await client.users.getUserList({ limit: 100 });
  return users.data.find(
    (user) => (user.publicMetadata as { stripeCustomerId?: string })?.stripeCustomerId === customerId
  );
}

// This is where we receive Stripe webhook events
// It's used to update user data, send emails, etc...
// User data is stored in Clerk metadata
// See more: https://shipfa.st/docs/features/payments
export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const body = await req.text();

  const signature = (await headers()).get("stripe-signature");

  let eventType;
  let event;

  // verify Stripe event is legit
  try {
    event = stripe.webhooks.constructEvent(body, signature!, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed. ${message}`);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  eventType = event.type;

  try {
    switch (eventType) {
      case "checkout.session.completed": {
        // First payment is successful and a subscription is created (if mode was set to "subscription" in ButtonCheckout)
        // ✅ Grant access to the product
        const stripeObject: Stripe.Checkout.Session = event.data
          .object as Stripe.Checkout.Session;

        const session = await findCheckoutSession(stripeObject.id);

        const customerId = session?.customer as string;
        const priceId = session?.line_items?.data[0]?.price?.id;
        const userId = stripeObject.client_reference_id;
        const plan = configFile.stripe.plans.find((p) => p.priceId === priceId);

        if (!plan) break;

        // userId is the Clerk user ID passed in the checkout session (clientReferenceID)
        if (userId) {
          const client = await clerkClient();
          await client.users.updateUser(userId, {
            publicMetadata: {
              stripeCustomerId: customerId,
              stripePriceId: priceId,
              hasAccess: true,
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

      case "checkout.session.expired": {
        // User didn't complete the transaction
        // You don't need to do anything here, but you can send an email to the user to remind them to complete the transaction, for instance
        break;
      }

      case "customer.subscription.updated": {
        // The customer might have changed the plan (higher or lower plan, cancel soon etc...)
        // You don't need to do anything here, because Stripe will let us know when the subscription is canceled for good (at the end of the billing cycle) in the "customer.subscription.deleted" event
        // You can update the user data to show a "Subscription ending soon" badge for instance
        break;
      }

      case "customer.subscription.deleted": {
        // The customer subscription stopped
        // ❌ Revoke access to the product
        const stripeObject: Stripe.Subscription = event.data
          .object as Stripe.Subscription;

        const subscription = await stripe.subscriptions.retrieve(
          stripeObject.id
        );

        const user = await findUserByStripeCustomerId(subscription.customer as string);

        if (user) {
          const client = await clerkClient();
          // Revoke access to your product
          await client.users.updateUser(user.id, {
            publicMetadata: {
              ...user.publicMetadata,
              hasAccess: false,
            },
          });
        }

        break;
      }

      case "invoice.paid": {
        // Customer just paid an invoice (for instance, a recurring payment for a subscription)
        // ✅ Grant access to the product

        const stripeObject: Stripe.Invoice = event.data
          .object as Stripe.Invoice;

        const lineItem = stripeObject.lines.data[0];
        const priceId = typeof lineItem.pricing?.price_details?.price === 'string'
          ? lineItem.pricing.price_details.price
          : lineItem.pricing?.price_details?.price?.id;
        const customerId = stripeObject.customer as string;

        const user = await findUserByStripeCustomerId(customerId);

        if (user) {
          const userPriceId = (user.publicMetadata as { stripePriceId?: string })?.stripePriceId;
          // Make sure the invoice is for the same plan (priceId) the user subscribed to
          if (userPriceId !== priceId) break;

          const client = await clerkClient();
          // Grant user access to your product
          await client.users.updateUser(user.id, {
            publicMetadata: {
              ...user.publicMetadata,
              hasAccess: true,
            },
          });
        }

        break;
      }

      case "invoice.payment_failed":
        // A payment failed (for instance the customer does not have a valid payment method)
        // ❌ Revoke access to the product
        // ⏳ OR wait for the customer to pay (more friendly):
        //      - Stripe will automatically email the customer (Smart Retries)
        //      - We will receive a "customer.subscription.deleted" when all retries were made and the subscription has expired

        break;

      default:
      // Unhandled event type
    }
  } catch (e) {
    console.error("stripe error: ", (e as Error).message);
  }

  return NextResponse.json({});
}
