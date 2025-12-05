import { Router } from "express";
import { paymentsControllers } from "./payments.controller";




const router = Router();

router.post("/create-intent", paymentsControllers.createdPaymentIntent);



export const paymentsRoute = router;