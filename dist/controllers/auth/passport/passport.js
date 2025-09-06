"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
function findOrCreateUser(_a) {
    return __awaiter(this, arguments, void 0, function* ({ provider, providerId, email, name, firstName, lastName, avatar, }) {
        let user = yield UserModel.findOne({ provider, providerId });
        if (user)
            return { user, isNew: false };
        if (email) {
            user = yield UserModel.findOne({ email });
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
                yield user.save();
                return { user, isNew: false, linked: true };
            }
        }
        const newUser = yield UserModel.create({
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
    });
}
// Serialize / Deserialize for session-based flows
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield UserModel.findById(id);
        done(null, user);
    }
    catch (err) {
        done(err);
    }
}));
/* Google Strategy */
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK || "http://server-production-2ee7.up.railway.app/swiftab/auth/admin/google-auth/callback",
}, (_accessToken, _refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const email = (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value;
        const name = profile.displayName;
        const firstName = (_c = profile.name) === null || _c === void 0 ? void 0 : _c.givenName;
        const lastName = (_d = profile.name) === null || _d === void 0 ? void 0 : _d.familyName;
        const avatar = (_f = (_e = profile.photos) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.value;
        const { user } = yield findOrCreateUser({
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
})));
/* Twitter (X) OAuth1.0A Strategy - Switched for email access */
passport_1.default.use(new passport_twitter_1.Strategy({
    consumerKey: process.env.X_CLIENT_ID, // Use consumerKey for OAuth 1.0A
    consumerSecret: process.env.X_CLIENT_SECRET,
    callbackURL: process.env.X_CALLBACK || "https://server-production-2ee7.up.railway.app/swiftab/auth/admin/x-auth",
    includeEmail: true, // Enables email if app configured
}, (_accessToken, _tokenSecret, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const email = (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value;
        const name = profile.displayName || profile.username;
        // Twitter profile doesn't have givenName/familyName; use full name or split if needed
        const firstName = (name === null || name === void 0 ? void 0 : name.split(" ")[0]) || "";
        const lastName = (name === null || name === void 0 ? void 0 : name.split(" ").slice(1).join(" ")) || "";
        const avatar = (_d = (_c = profile.photos) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value;
        const { user } = yield findOrCreateUser({
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
})));
exports.default = passport_1.default;
