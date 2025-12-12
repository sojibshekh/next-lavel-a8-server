// src/modules/payment/payment.controller.ts

import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatusCode from "http-status-codes";
import { paymentService } from "./payments.service";


const subscribeController = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as { userId: string };
  const { plan } = req.body;
  

  if (!plan) {
    throw new Error("Subscription plan is required");
  }

  const paymentUrl = await paymentService.initSubscriptionPayment({
    userId: user.userId,
    plan,
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatusCode.OK,
    message: "Subscription payment initialized",
    data: paymentUrl,
  });
});

const paymentSuccessController = catchAsync(async (req: Request, res: Response) => {
  const tranId = req.query.tranId as string;

  await paymentService.confirmPayment(tranId);

  res.send(`<h2>Payment Successful!</h2>`);
});

const paymentFailController = catchAsync(async (req: Request, res: Response) => {
  res.send(`<h2>Payment Failed!</h2>`);
});

const paymentCancelController = catchAsync(async (req: Request, res: Response) => {
  res.send(`<h2>Payment Cancelled!</h2>`);
});

export const paymentControllers = {
  subscribeController,
  paymentSuccessController,
  paymentFailController,
  paymentCancelController,
};
