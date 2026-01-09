import Stripe from "stripe";
import { prisma } from "../../shared/db";
import { Prisma } from "@prisma/client";

export const recordPayment = async (stripeEvent: Stripe.Event) => {
  try {
    if (stripeEvent.type !== "checkout.session.completed") return;

    const session = stripeEvent.data.object as Stripe.Checkout.Session;

    const userEmail = session.customer_email!;
    const subscriptionId = session.subscription as string;
    const transactionId = session.payment_intent as string;
    const amount = Number(session.amount_total) / 100;
    const currency = session.currency?.toUpperCase() || "USD";

    // Find user
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) throw new Error("User not found");

    // Fetch latest invoice URL
    let invoiceUrl: string | null = null;
    if (subscriptionId) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2025-12-15.clover",
      });
      const invoices = await stripe.invoices.list({ subscription: subscriptionId, limit: 1 });
      if (invoices.data.length > 0) {
        invoiceUrl = invoices.data[0].hosted_invoice_url || null;
      }
    }

    // 💾 Save Payment
    await prisma.payment.create({
      data: {
        userId: user.id,
        subscriptionId,
        transactionId,
        amount,
        status: "PAID",
        invoiceUrl,
        paymentGatewayData: session as unknown as Prisma.JsonObject,
      },
    });

    // 💾 Save Subscription
    const plan = session.metadata?.plan || "MONTHLY";
    await prisma.subscription.create({
      data: {
        userId: user.id,
        plan,
        price: amount,
        currency,
        status: "ACTIVE",
        startAt: new Date(),
        endAt: new Date(new Date().setMonth(new Date().getMonth() + 1)), // monthly example
      },
    });

    // 💾 Update User
    await prisma.user.update({
      where: { id: user.id },
      data: { isPremium: true },
    });

    console.log(`Payment & subscription saved for user: ${user.email}`);
  } catch (err) {
    console.error("Error recording payment:", err);
    throw err;
  }
};
