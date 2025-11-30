import express from 'express';
import path from 'path';
import { UserRoute } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.route';


const router = express.Router();

const moduleRoutes = [

     {
        path: "/auth",
        route: authRoutes
    },

    {
        path: '/users',
        route: UserRoute
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;