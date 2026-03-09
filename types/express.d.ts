// types/express.d.ts
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      adminId?: { id: string } & JwtPayload;
      user?: { id: string } & JwtPayload;
      restaurantId?: { id: string } & JwtPayload;
    }
  }
}
