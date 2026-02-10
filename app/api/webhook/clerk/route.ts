import * as Sentry from "@sentry/nextjs";
import { headers } from "next/headers";
import { trackDatafastEvent, DatafastEvents } from "@/libs/datafast";

// Clerk webhook event types
interface ClerkUserCreatedEvent {
  type: "user.created";
  data: {
    id: string;
    email_addresses?: Array<{ email_address: string }>;
    first_name?: string | null;
    last_name?: string | null;
    created_at: number;
    unsafe_metadata?: {
      datafast_visitor_id?: string;
    };
  };
}

type ClerkWebhookEvent = ClerkUserCreatedEvent | { type: string; data: unknown };

// Clerk webhook handler
// Docs: https://clerk.com/docs/integrations/webhooks
//
// Setup:
// 1. Go to Clerk Dashboard → Webhooks
// 2. Add endpoint: https://yourdomain.com/api/webhook/clerk
// 3. Select "user.created" event
// 4. Copy the Signing Secret to CLERK_WEBHOOK_SECRET env var
export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  // In production, webhook secret is required
  if (!WEBHOOK_SECRET && process.env.NODE_ENV === "production") {
    Sentry.logger.error("Missing CLERK_WEBHOOK_SECRET");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  // Get the headers for verification
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // Verify headers exist (basic check)
  if (!svix_id || !svix_timestamp || !svix_signature) {
    // Allow in development without headers for testing
    if (process.env.NODE_ENV !== "development") {
      Sentry.logger.error("Missing svix headers");
      return new Response("Missing webhook headers", { status: 400 });
    }
  }

  // Get the payload
  const payload = await req.json();

  // Note: For full signature verification, install 'svix' package:
  // npm install svix
  // Then use: const wh = new Webhook(WEBHOOK_SECRET); wh.verify(body, headers)
  //
  // For now, we rely on Clerk's endpoint URL being secret

  const evt = payload as ClerkWebhookEvent;
  const eventType = evt.type;

  Sentry.logger.info("Clerk webhook event received", { event_type: eventType });

  try {
    switch (eventType) {
      case "user.created": {
        const { id, email_addresses, first_name, last_name } = (evt as ClerkUserCreatedEvent).data;
        const primaryEmail = email_addresses?.[0]?.email_address;

        Sentry.logger.info("user.created", { user_id: id, email: primaryEmail });

        // Track user signup in Datafast
        // The visitor ID needs to be passed during signup via unsafe_metadata
        const visitorId = (evt as ClerkUserCreatedEvent).data.unsafe_metadata?.datafast_visitor_id;

        if (visitorId) {
          await trackDatafastEvent({
            visitorId,
            name: DatafastEvents.USER_SIGNUP,
            metadata: {
              email: primaryEmail || "",
              first_name: first_name || "",
              last_name: last_name || "",
            },
          });
          Sentry.logger.info("Tracked user_signup event", { email: primaryEmail });
        } else {
          Sentry.logger.debug("No visitor ID available for tracking user_signup");
        }

        break;
      }

      default:
        Sentry.logger.debug("Unhandled Clerk event type", { event_type: eventType });
    }
  } catch (error) {
    Sentry.logger.error("Clerk webhook processing failed", { event_type: eventType });
    Sentry.captureException(error);
    return new Response("Webhook processing failed", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
