// src/modules/payments/payment.service.ts
import SSLCommerz from 'sslcommerz-lts'

import { PaymentInitPayload } from "./payment.interface"

const store_id = config .ssl.storeId
const store_passwd = config.ssl.storePass
const is_live = false // sandbox

export const PaymentService = {
  async initPayment(data: PaymentInitPayload) {
    
    const amount = data.plan === "MONTHLY" ? 500 : 5000

    const transactionId = `sub_${Date.now()}`

    const paymentInfo = {
      total_amount: amount,
      currency: "BDT",
      tran_id: transactionId,
      success_url: `${config.backend_url}/api/payments/success?transId=${transactionId}`,
      fail_url: `${config.backend_url}/api/payments/fail`,
      cancel_url: `${config.backend_url}/api/payments/cancel`,
      ipn_url: `${config.backend_url}/api/payments/ipn`,
      product_name: "Travel Buddy Subscription",
      product_category: "Subscription",
      product_profile: "general",
      cus_name: "User",
      cus_email: "user@mail.com",
      cus_add1: "Dhaka",
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      cus_phone: "01700000000",
    }

    const sslcz = new SSLCommerz(store_id, store_passwd, is_live)
    const apiResponse = await sslcz.init(paymentInfo)

    if (apiResponse?.GatewayPageURL) {

      // save payment request into DB
      await prisma.payment.create({
        data: {
          userId: data.userId,
          amount,
          tranId: transactionId,
          plan: data.plan,
          status: "PENDING",
        },
      })

      return { url: apiResponse.GatewayPageURL }
    }

    throw new Error("SSLCommerz initialization failed")
  },

  async confirmPayment(transId: string) {
    return await prisma.payment.update({
      where: { tranId: transId },
      data: {
        status: "SUCCESS",
      },
    })
  },
}
