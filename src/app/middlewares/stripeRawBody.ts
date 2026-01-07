import { Request, Response, NextFunction } from "express";

export const stripeRawBodyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.rawBody = Buffer.from([]);
  req.on("data", (chunk) => {
    req.rawBody = Buffer.concat([req.rawBody!, chunk]);
  });
  req.on("end", () => {
    next();
  });
};
