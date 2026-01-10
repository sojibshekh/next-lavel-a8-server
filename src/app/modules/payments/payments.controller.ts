// payments.controller.ts
import Stripe from "stripe";
import { Request, Response } from "express";
import config from '../../../config';

const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
  apiVersion: "2025-12-15.clover",
});

export const createCheckoutSession = async (req: Request, res: Response) => {
  const { priceId } = req.body;
  const user = req.user;
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${config.FRONTEND_URL}/dashboard/payment-success`,
    cancel_url: `${config.FRONTEND_URL}/dashboard/payment-cancel`,
  });

  res.status(200).json({ url: session.url });
};
