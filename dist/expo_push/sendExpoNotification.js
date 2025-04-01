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
Object.defineProperty(exports, "__esModule", { value: true });
const expo_server_sdk_1 = require("expo-server-sdk");
const expo = new expo_server_sdk_1.Expo();
/**
 * Sends an Expo Push Notification.
 *
 * @param deviceToken - The target device token.
 * @param title - Notification title.
 * @param body - Notification body.
 * @param data - Additional data to include in the notification.
 */
const sendExpoNotification = (deviceToken, title, body, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Sending notification to deviceToken:", deviceToken);
        if (!expo_server_sdk_1.Expo.isExpoPushToken(deviceToken)) {
            throw new Error("Invalid Expo Push Token");
        }
        const message = {
            to: deviceToken,
            sound: "default",
            title,
            body,
            data,
        };
        console.log("Notification payload:", message);
        const ticket = yield expo.sendPushNotificationsAsync([message]);
        console.log("Notification sent successfully:", ticket);
    }
    catch (error) {
        console.error("Error sending notification:", error.message);
        console.error("Detailed error:", error);
    }
});
module.exports = sendExpoNotification;
