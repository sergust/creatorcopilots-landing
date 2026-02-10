/**
 * Datafast Server-Side Event Tracking
 *
 * This module provides server-side event tracking for Datafast analytics.
 * Use this for accurate tracking that bypasses ad blockers.
 *
 * API Documentation: https://datafa.st/docs/api-create-goal
 */

import * as Sentry from "@sentry/nextjs";

const DATAFAST_API_URL = "https://datafa.st/api/v1/goals";
const DATAFAST_API_KEY = process.env.DATAFAST_API_KEY;

interface DatafastMetadata {
  [key: string]: string | number | undefined;
}

interface TrackEventOptions {
  visitorId?: string;
  name: string;
  metadata?: DatafastMetadata;
}

interface DatafastResponse {
  status: "success" | "error";
  data?: {
    message: string;
    eventId: string;
  };
  error?: string;
}

/**
 * Track a server-side event to Datafast
 *
 * @param options - Event tracking options
 * @param options.visitorId - The Datafast visitor ID from cookie (datafast_visitor_id)
 * @param options.name - Event name (lowercase, numbers, underscores, hyphens, max 64 chars)
 * @param options.metadata - Optional custom parameters (max 10 params, values max 255 chars)
 *
 * @returns Promise with the API response or null if tracking fails
 *
 * @example
 * // Track a payment event
 * await trackDatafastEvent({
 *   visitorId: req.cookies.datafast_visitor_id,
 *   name: "payment_success",
 *   metadata: {
 *     plan: "pro",
 *     amount: "59",
 *     currency: "USD"
 *   }
 * });
 */
export async function trackDatafastEvent(
  options: TrackEventOptions
): Promise<DatafastResponse | null> {
  const { visitorId, name, metadata } = options;

  // Skip if API key is not configured
  if (!DATAFAST_API_KEY) {
    Sentry.logger.warn("Datafast API key not configured, skipping event tracking");
    return null;
  }

  // Skip if visitor ID is not provided (visitor hasn't had a pageview yet)
  if (!visitorId) {
    Sentry.logger.warn("No Datafast visitor ID, skipping event tracking", { event_name: name });
    return null;
  }

  try {
    const response = await fetch(DATAFAST_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DATAFAST_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        datafast_visitor_id: visitorId,
        name,
        ...(metadata && { metadata }),
      }),
    });

    const data = (await response.json()) as DatafastResponse;

    if (!response.ok) {
      Sentry.logger.error("Datafast event tracking failed", { event_name: name, status: response.status });
      return data;
    }

    return data;
  } catch (error) {
    Sentry.logger.error("Datafast request failed", { event_name: name, error_message: (error as Error).message });
    Sentry.captureException(error);
    return null;
  }
}

/**
 * Pre-defined event names for consistency
 */
export const DatafastEvents = {
  USER_SIGNUP: "user_signup",
  PAYMENT_SUCCESS: "payment_success",
  SUBSCRIPTION_CREATED: "subscription_created",
  SUBSCRIPTION_CANCELLED: "subscription_cancelled",
  REFUND_PROCESSED: "refund_processed",
} as const;
