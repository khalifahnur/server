"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_twitter_1 = require("passport-twitter");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const UserModel = require("../../../models/admin");
async function findOrCreateUser({ provider, providerId, email, name, firstName, lastName, avatar, }) {
    let user = await UserModel.findOne({ provider, providerId });
    if (user)
        return { user, isNew: false };
    if (email) {
        user = await UserModel.findOne({ email });
        if (user) {
            user.provider = provider;
            user.providerId = providerId;
            if (!user.name && name)
                user.name = name;
            if (!user.firstName && firstName)
                user.firstName = firstName;
            if (!user.lastName && lastName)
                user.lastName = lastName;
            if (!user.avatar && avatar)
                user.avatar = avatar;
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
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await UserModel.findById(id);
        done(null, user);
    }
    catch (err) {
        done(err);
    }
});
/* Google Strategy */
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK || "http://server-production-2ee7.up.railway.app/swiftab/auth/admin/google-auth/callback",
}, async (_accessToken, _refreshToken, profile, done) => {
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
    }
    catch (err) {
        return done(err);
    }
}));
/* Twitter (X) OAuth1.0A Strategy - Switched for email access */
passport_1.default.use(new passport_twitter_1.Strategy({
    consumerKey: process.env.X_CLIENT_ID, // Use consumerKey for OAuth 1.0A
    consumerSecret: process.env.X_CLIENT_SECRET,
    callbackURL: process.env.X_CALLBACK || "https://server-production-2ee7.up.railway.app/swiftab/auth/admin/x-auth",
    includeEmail: true, // Enables email if app configured
}, async (_accessToken, _tokenSecret, profile, done) => {
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
    }
    catch (err) {
        return done(err);
    }
}));
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map