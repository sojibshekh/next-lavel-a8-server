
import { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user: JwtPayload
        }
    }
};


declare global {
  namespace Express {
    interface Request {
      rawBody?: Buffer;  // Add rawBody property
      user?: any;        // Also your custom user
    }
  }
}