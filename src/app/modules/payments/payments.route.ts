import { Router } from "express";
import { createCheckoutSession } from "./payments.controller";
import { checkAuth } from "../../middlewares/checkAuth";


const router = Router();

router.post("/checkout", checkAuth("USER"), createCheckoutSession);

export const paymentsRoute = router;