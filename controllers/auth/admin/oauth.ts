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
  _id:string
}

const oauthSignin = (providerName: string) => {
  return async (req: Request, res: Response) => {
    try {
      const user = req.user as IUser;

      const email = user.email;

      if (!email) {
        return res.redirect(
          "http://localhost:3000/login?error=email_not_available"
        );
      }

      const secretKey = await getSecretKey(user._id.toString());
      const token = jwt.sign({ userId: user._id }, secretKey, {
        expiresIn: "24h",
      });

      const frontendURL =
        process.env.NODE_ENV === "production"
          ? "https://swiftab-web.vercel.app/home"
          : "http://localhost:3000/home";

      res
        .cookie("user_auth", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          path: "/",
          maxAge: 24 * 60 * 60 * 1000,
        })
        .redirect(frontendURL);
    } catch (err) {
      console.error(`${providerName} auth error:`, err);
      res.redirect("http://localhost:3000/login?error=auth_failed");
    }
  };
};

export default oauthSignin;