import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db/client";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.CheckoutSession;
      const userId = session.metadata?.userId;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            isPremium: true,
            premiumUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
          },
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const user = await prisma.user.findUnique({
        where: { stripeSubscriptionId: subscription.id },
      });

      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            isPremium: false,
            premiumUntil: null,
            stripeSubscriptionId: null,
          },
        });
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const user = await prisma.user.findUnique({
        where: { stripeSubscriptionId: subscription.id },
      });

      if (user) {
        const isActive = subscription.status === "active";
        await prisma.user.update({
          where: { id: user.id },
          data: {
            isPremium: isActive,
            premiumUntil: isActive
              ? new Date(subscription.current_period_end * 1000)
              : null,
          },
        });
      }
      break;
    }

    default:
      console.log(`Unhandled Stripe event: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
