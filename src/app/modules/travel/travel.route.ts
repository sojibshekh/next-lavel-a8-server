import { Router } from "express";
import { travelControllers } from "./travel.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "@prisma/client";




const router = Router();

router.post("/", checkAuth(Role.ADMIN, Role.USER), travelControllers.createdTravel)

router.get("/", travelControllers.getAllTravelPlans);

router.get("/match", travelControllers.matchTravelPlans);


router.get("/my", checkAuth(Role.USER, Role.ADMIN), travelControllers.getMyTravelPlans);

router.get("/:id", travelControllers.getSingleTravelPlan);

router.patch("/update/:id", checkAuth(Role.USER, Role.ADMIN), travelControllers.updateTravelPlan);

router.delete("/delete/:id", checkAuth(Role.USER, Role.ADMIN),travelControllers.deleteTravelPlan);



export const travelRoute = router;