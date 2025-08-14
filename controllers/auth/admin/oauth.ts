import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import getSecretKey from "../../../lib/getSecretKey";

interface IUser extends Document {
  provider: string;
  providerId: string;
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  password?: string;
  phoneNumber?: string;
  _id: string;
}

const oauthSignin = (providerName: string) => {
  return async (req: Request, res: Response) => {
    try {
      const user = req.user as IUser;

      if (!user.email) {
        return res.redirect(
          "http://localhost:3000/login?error=email_not_available"
        );
      }

      const secretKey = await getSecretKey(user._id.toString());
      const token = jwt.sign({ userId: user._id }, secretKey, {
        expiresIn: "24h",
      });

      const isProduction = process.env.NODE_ENV === "production";
      const frontendURL = isProduction
        ? "https://swiftab-web.vercel.app/dash"
        : "http://127.0.0.1:3000/dash";

      res.cookie("token", token ,{
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
      } 
    );

      res.redirect(frontendURL);
    } catch (err) {
      console.error(`${providerName} auth error:`, err);
      res.redirect("http://localhost:3000/login?error=auth_failed");
    }
  };
};

module.exports = oauthSignin;
