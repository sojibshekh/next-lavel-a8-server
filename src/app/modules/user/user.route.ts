import express from 'express';
import { getAllUsersController, getUserByIdController, UserController } from './user.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '@prisma/client';


const router = express.Router();


router.get("/me", checkAuth(...Object.values(Role)), UserController.getMe);
router.get("/all-users", getAllUsersController);

router.get("/all-users/:id", getUserByIdController);





export const UserRoute = router;