import { Request } from "express";

const premiumGuard = (req: Request, res: Response, next) => {
  if (!req.user.isPremium) {
    return res.status(403).json({ message: "Premium required" });
  }
  next();
};

export default premiumGuard;
