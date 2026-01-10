import { Webhooks } from "@polar-sh/nextjs";
import { clerkClient } from "@clerk/nextjs/server";

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onPayload: async (payload) => {
    // Handle all Polar webhook events
    const eventType = payload.type;

    switch (eventType) {
      case "checkout.updated": {
        // Checkout was updated - check if it succeeded
        const checkout = payload.data;
        if (checkout.status === "succeeded") {
          const customerEmail = checkout.customerEmail;
          const customerId = checkout.customerId;
          const userId = checkout.metadata?.userId as string | undefined;

          if (userId) {
            // Update Clerk user metadata with Polar customer info
            const client = await clerkClient();
            await client.users.updateUser(userId, {
              publicMetadata: {
                polarCustomerId: customerId,
                hasAccess: true,
              },
            });
          }
        }
        break;
      }

      case "subscription.created":
      case "subscription.active": {
        // Subscription is now active
        const subscription = payload.data;
        const customerId = subscription.customerId;
        const userId = subscription.metadata?.userId as string | undefined;

        if (userId) {
          const client = await clerkClient();
          await client.users.updateUser(userId, {
            publicMetadata: {
              polarCustomerId: customerId,
              polarSubscriptionId: subscription.id,
              hasAccess: true,
            },
          });
        }
        break;
      }

      case "subscription.canceled":
      case "subscription.revoked": {
        // Subscription was canceled or revoked
        const subscription = payload.data;
        const userId = subscription.metadata?.userId as string | undefined;

        if (userId) {
          const client = await clerkClient();
          await client.users.updateUser(userId, {
            publicMetadata: {
              hasAccess: false,
            },
          });
        }
        break;
      }

      default:
        console.log(`Unhandled Polar webhook event: ${eventType}`);
    }
  },
});
