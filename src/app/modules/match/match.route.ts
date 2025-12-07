import { Router } from 'express';
import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '@prisma/client';
import { matchControllers } from './match.controller';

const router = Router();

router.post('/request', checkAuth(Role.USER, Role.ADMIN), matchControllers.requestMatchController);

router.patch('/:id/respond', checkAuth(Role.USER, Role.ADMIN), matchControllers.respondMatchController);

router.get('/my', checkAuth(Role.USER, Role.ADMIN), matchControllers.getMyMatchesController);


export const matchesRoute = router;
