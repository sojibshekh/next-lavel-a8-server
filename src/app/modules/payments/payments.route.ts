// src/modules/payment/payment.route.ts

import express from "express";
import { paymentControllers } from "./payments.controller";
import { Role } from "@prisma/client";
import { checkAuth } from "../../middlewares/checkAuth";

const router = express.Router();

router.post(
  "/subscribe",
  checkAuth(Role.USER, Role.ADMIN), 
  paymentControllers.subscribeController
);

router.post("/success", paymentControllers.paymentSuccessController);
router.post("/fail", paymentControllers.paymentFailController);
router.post("/cancel", paymentControllers.paymentCancelController);

export const paymentRoute = router;
