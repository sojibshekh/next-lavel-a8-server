import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import config from './config';
import envVars from './config/index';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';

import router from './app/routes';

const app: Application = express();

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(cookieParser());
app.use(cors({
    origin: envVars.frontend_url,
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