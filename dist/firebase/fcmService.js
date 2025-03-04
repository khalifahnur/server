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
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const serviceAccount = require("./swiftab.json");
// Initialize Firebase Admin SDK
if (!firebase_admin_1.default.apps.length) {
    firebase_admin_1.default.initializeApp({
        credential: firebase_admin_1.default.credential.cert(serviceAccount),
    });
}
/**
 * Sends a Firebase Notification.
 *
 * @param deviceToken - The target device token.
 * @param title - Notification title.
 * @param body - Notification body.
 * @param data - Additional data to include in the notification.
 */
const sendFirebaseNotification = (deviceToken, title, body, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Sending notification to deviceToken:", deviceToken);
        const message = {
            token: deviceToken,
            notification: {
                title,
                body,
            },
            android: {
                priority: "high",
                notification: {
                    sound: "default",
                },
            },
            apns: {
                headers: {
                    "apns-priority": "10",
                },
                payload: {
                    aps: {
                        alert: {
                            title,
                            body,
                        },
                        sound: "default",
                    },
                },
            },
            data,
        };
        console.log("Notification payload:", message);
        const response = yield firebase_admin_1.default.messaging().send(message);
        console.log("Notification sent successfully:", response);
    }
    catch (error) {
        console.error("Error sending notification:", error.message);
        console.error("Detailed error:", error);
    }
});
module.exports = sendFirebaseNotification;
