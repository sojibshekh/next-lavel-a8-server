import { Request, Response } from "express";
import Stripe from "stripe";
import config from "../../../config";
import { recordPayment } from "./payments.service";

const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
  apiVersion: "2024-04-10" as any,
});

export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  console.log("✅ Stripe webhook received");

  if (!sig) return res.status(400).send("Missing stripe signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody!,
      sig,
      config.STRIPE_WEBHOOK_SECRET // 🔥 FIXED
    );
  } catch (err: any) {
    console.error("❌ Webhook verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    await recordPayment(event);
  }

  res.json({ received: true });
};
