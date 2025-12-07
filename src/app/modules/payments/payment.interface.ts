// src/modules/payment/payment.interface.ts

export type SubscriptionPlan = "MONTHLY" | "YEARLY";

export interface PaymentInitInput {
  userId: string;
  plan: SubscriptionPlan;
}

export interface SSLInitResponse {
  GatewayPageURL: string;
}
