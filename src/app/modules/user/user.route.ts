import express from 'express';
import { UserController } from './user.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '@prisma/client';


const router = express.Router();


router.get("/me", checkAuth(...Object.values(Role)), UserController.getMe);


export const UserRoute = router;