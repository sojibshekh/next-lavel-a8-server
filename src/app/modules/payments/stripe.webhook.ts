import { Request, Response } from "express";
import Stripe from "stripe";

import config from "../../../config";
import { prisma } from "../../shared/db";

const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
  apiVersion: "2024-04-10" as any,
});

export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  if (!sig) return res.status(400).send("Missing stripe signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody!,       // <-- raw body from express.raw()
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session: any = event.data.object;

    // Update user to premium
    await prisma.user.update({
      where: { email: session.customer_email },
      data: { isPremium: true },  // <- make sure field exists in schema + migration done
    });
  }

  res.json({ received: true });
};
