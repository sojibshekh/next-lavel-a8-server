import { Router } from "express";

import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "@prisma/client";
import { reviewController } from "./reviews.controller";





const router = Router();

router.post("/", checkAuth(Role.ADMIN, Role.USER), reviewController.createReviews)


// router.get("/single/:id", checkAuth(Role.USER, Role.ADMIN), reviewController.getSingleReview);

router.get("/single/:id", reviewController.getSingleReview);

router.get("/my", checkAuth(Role.USER, Role.ADMIN), reviewController.getMyReviews);
router.get("/:id", reviewController.getReviewsByTravelPlan);
router.patch("/update/:id", checkAuth(Role.USER, Role.ADMIN), reviewController.updateReview);
router.delete("/delete/:id", checkAuth(Role.USER, Role.ADMIN), reviewController.deleteReview);






export const reviewlRoute = router;