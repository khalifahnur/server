"use strict";
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
const sendExpoNotification = async (deviceToken, title, body, data) => {
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
        const ticket = await expo.sendPushNotificationsAsync([message]);
        console.log("Notification sent successfully:", ticket);
    }
    catch (error) {
        console.error("Error sending notification:", error.message);
        console.error("Detailed error:", error);
    }
};
module.exports = sendExpoNotification;
//# sourceMappingURL=sendExpoNotification.js.map