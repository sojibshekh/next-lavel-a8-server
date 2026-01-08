import express from 'express';
import { getAllUsersController, getUserByIdController, UserController } from './user.controller';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '@prisma/client';
import { multerUpload } from '../../helper/multer.config';


const router = express.Router();


router.get("/me", checkAuth(...Object.values(Role)), UserController.getMe);
router.get("/all-users", getAllUsersController);

router.get("/all-users/:id", getUserByIdController);



router.patch(
  "/update-my-profile",
  checkAuth(Role.USER, Role.ADMIN, Role.SUPERADMIN),
  multerUpload.single("file"), UserController.updateMyProfile         // handle file upload

);





export const UserRoute = router;