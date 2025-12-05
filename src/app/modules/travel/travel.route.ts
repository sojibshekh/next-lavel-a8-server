import { Router } from "express";
import { travelControllers } from "./travel.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "@prisma/client";




const router = Router();

router.post("/", checkAuth(Role.ADMIN, Role.USER), travelControllers.createdTravel)

router.get("/", travelControllers.getAllTravelPlans);



router.get("/my", checkAuth(Role.USER, Role.ADMIN), travelControllers.getMyTravelPlans);

router.get("/:id", travelControllers.getSingleTravelPlan);

export const travelRoute = router;