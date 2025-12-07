


import { PaymentInitInput } from "./payment.interface";
import { config } from "dotenv";
import { prisma } from "../../shared/db";
import { PaymentStatus } from "@prisma/client";
import envVars from "../../../config/index";

const SSLCommerz = require("sslcommerz-lts");

const storeId = envVars.SSL_COMMERZ_STORE_ID;
const storePass = envVars.SSL_COMMERZ_SECRET_KEY;
const isLive = false; // sandbox



const initSubscriptionPayment = async (payload: PaymentInitInput) => {
  const { userId, plan } = payload;

  const amount = plan === "MONTHLY" ? 500 : 5000;
  const tranId = `sub_${Date.now()}`;

  const sslcz = new SSLCommerz(storeId, storePass, isLive);

  const paymentData = {
    total_amount: amount,
    currency: "BDT",
    tran_id: tranId,
    success_url: `${envVars.BACKEND_URL}/api/payment/success?tranId=${tranId}`,
    fail_url:    `${envVars.BACKEND_URL}/api/payment/fail`,
    cancel_url:  `${envVars.BACKEND_URL}/api/payment/cancel`,
    ipn_url:     `${envVars.BACKEND_URL}/api/payment/ipn`,
    product_name: "Subscription",
    product_category: "Travel Buddy",
    product_profile: "general",
    cus_name: "User",
    cus_email: "nur@mail.com",
    cus_add1: "Dhaka",
    cus_city: "Dhaka",
    cus_country: "Bangladesh",
    cus_phone: "01700000000",
  };

  const response = await sslcz.init(paymentData);

  if (!response?.GatewayPageURL) {
    throw new Error("SSLCommerz payment init failed");
  }

  await prisma.payment.create({
    data: {
      userId,
      amount,
      tranId,
      plan,
      status: "PENDING",
      currency: "BDT"
    },
  });

  return { url: response.GatewayPageURL };
};



const confirmPayment = async (tranId: string) => {
  if (!tranId) throw new Error("tranId is required");

  return await prisma.payment.update({
    where: { tranId }, // ✅ ensure tranId exists in DB
    data: {
      status: PaymentStatus.COMPLETED
    },
  });
};


export const paymentService = {
  initSubscriptionPayment,
  confirmPayment,
};
