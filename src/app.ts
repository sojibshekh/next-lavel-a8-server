import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import config from './config';
import envVars from './config/index';
import cookieParser from 'cookie-parser';

import 'module-alias/register';

import router from './app/routes';
import { stripeWebhook } from './app/modules/payments/stripe.webhook';


const app: Application = express();

app.set("trust proxy", 1);
app.post(
  "/api/v1/payments/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);


//parser
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))



app.use(cors({
     origin: [
    'http://localhost:3000',                 // dev frontend
    'https://tourmateassignment8.vercel.app',
    
  ].filter(Boolean) as string[],
   
    credentials: true,
    
}));

app.use('/api/v1', router)
app.get('/', (req: Request, res: Response) => {
    res.send({
        message: "Server is running..",
        environment: config.node_env,
        uptime: process.uptime().toFixed(2) + " sec",
        timeStamp: new Date().toISOString()
    })
});



app.use(globalErrorHandler);

app.use(notFound);

export default app;