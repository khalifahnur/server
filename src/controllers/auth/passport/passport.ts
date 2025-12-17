import passport from "passport";
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from "passport-google-oauth20";
import { Strategy as TwitterStrategy } from "passport-twitter";
import dotenv from "dotenv";

dotenv.config();

import { Document, Model } from "mongoose";

const UserModel: Model<IUser> = require("../../../models/admin");

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
}

interface FindOrCreateArgs {
  provider: string;
  providerId: string;
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

async function findOrCreateUser({
  provider,
  providerId,
  email,
  name,
  firstName,
  lastName,
  avatar,
}: FindOrCreateArgs): Promise<{ user: IUser; isNew: boolean; linked?: boolean }> {
  let user = await UserModel.findOne({ provider, providerId });
  if (user) return { user, isNew: false };

  if (email) {
    user = await UserModel.findOne({ email });
    if (user) {
      user.provider = provider;
      user.providerId = providerId;
      if (!user.name && name) user.name = name;
      if (!user.firstName && firstName) user.firstName = firstName;
      if (!user.lastName && lastName) user.lastName = lastName;
      if (!user.avatar && avatar) user.avatar = avatar;
      await user.save();
      return { user, isNew: false, linked: true };
    }
  }

  const newUser = await UserModel.create({
    provider,
    providerId,
    email,
    name,
    firstName,
    lastName,
    avatar,
    password: undefined,
    phoneNumber: undefined,
  });
  return { user: newUser, isNew: true };
}

// Serialize / Deserialize for session-based flows
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

/* Google Strategy */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK || "http://server-production-2ee7.up.railway.app/swiftab/auth/admin/google-auth/callback",
    },
    async (_accessToken, _refreshToken, profile: GoogleProfile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const firstName = profile.name?.givenName;
        const lastName = profile.name?.familyName;
        const avatar = profile.photos?.[0]?.value;

        const { user } = await findOrCreateUser({
          provider: "google",
          providerId: profile.id,
          email,
          name,
          firstName,
          lastName,
          avatar,
        });

        return done(null, user);
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);

/* Twitter (X) OAuth1.0A Strategy - Switched for email access */
passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.X_CLIENT_ID!, // Use consumerKey for OAuth 1.0A
      consumerSecret: process.env.X_CLIENT_SECRET!,
      callbackURL: process.env.X_CALLBACK || "https://server-production-2ee7.up.railway.app/swiftab/auth/admin/x-auth",
      includeEmail: true, // Enables email if app configured
    },
    async (_accessToken, _tokenSecret, profile: any, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName || profile.username;
        // Twitter profile doesn't have givenName/familyName; use full name or split if needed
        const firstName = name?.split(" ")[0] || "";
        const lastName = name?.split(" ").slice(1).join(" ") || "";
        const avatar = profile.photos?.[0]?.value;

        const { user } = await findOrCreateUser({
          provider: "x",
          providerId: profile.id,
          email,
          name,
          firstName,
          lastName,
          avatar,
        });

        return done(null, user);
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);

export default passport;