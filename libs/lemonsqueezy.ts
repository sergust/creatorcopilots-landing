import {
  createCheckout,
  getCustomer,
  lemonSqueezySetup,
  type NewCheckout,
} from "@lemonsqueezy/lemonsqueezy.js";

interface CreateLemonSqueezyCheckoutParams {
  variantId: string;
  redirectUrl: string;
  discountCode?: string;
  userId?: string;
  email?: string;
}

interface CreateCustomerPortalParams {
  customerId: string;
}

// This is used to create a Lemon Squeezy Checkout. It's usually triggered with the <ButtonCheckout /> component.
// Webhooks are used to update the user's state in Clerk metadata.
export const createLemonSqueezyCheckout = async ({
  userId,
  email,
  redirectUrl,
  variantId,
  discountCode,
}: CreateLemonSqueezyCheckoutParams): Promise<string | null> => {
  try {
    lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY! });

    const storeId = process.env.LEMONSQUEEZY_STORE_ID!;

    const newCheckout: NewCheckout = {
      productOptions: {
        redirectUrl,
      },
      checkoutData: {
        discountCode,
        email,
        custom: {
          userId,
        },
      },
    };

    const { data, error } = await createCheckout(
      storeId,
      variantId,
      newCheckout
    );

    if (error) {
      throw error;
    }

    return data.data.attributes.url;
  } catch (e) {
    console.error(e);
    return null;
  }
};

// This is used to create Customer Portal sessions, so users can manage their subscriptions (payment methods, cancel, etc..)
export const createCustomerPortal = async ({
  customerId,
}: CreateCustomerPortalParams): Promise<string | null> => {
  try {
    lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY! });

    const { data, error } = await getCustomer(customerId);

    if (error) {
      throw error;
    }

    return data.data.attributes.urls.customer_portal;
  } catch (error) {
    console.error(error);
    return null;
  }
};
