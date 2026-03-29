import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

export async function createCheckoutSession(
  userId: string,
  userEmail: string,
  stripeCustomerId: string | null
): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId ?? undefined,
    customer_email: stripeCustomerId ? undefined : userEmail,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.STRIPE_PREMIUM_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/upgrade`,
    metadata: { userId },
    subscription_data: {
      metadata: { userId },
    },
  });

  return session.url!;
}

export async function cancelSubscription(subscriptionId: string) {
  return stripe.subscriptions.cancel(subscriptionId);
}
