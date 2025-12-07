import express from 'express';
import path from 'path';
import { UserRoute } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.route';
import { travelRoute } from '../modules/travel/travel.route';
import { paymentsRoute } from '../modules/payments/payments.route';
import { reviewlRoute } from '../modules/reviews/reviews.route';
import { matchesRoute } from '../modules/match/match.route';


const router = express.Router();

const moduleRoutes = [

     {
        path: "/auth",
        route: authRoutes
    },

    {
        path: '/users',
        route: UserRoute
    },
    {
        path: '/travel-plans',
        route:  travelRoute
    },
    {
        path: '/reviews',
        route:  reviewlRoute
    },
    {
        path:'/matches',
        route: matchesRoute
    },
     {
        path: '/payments',
        route:  paymentsRoute
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;