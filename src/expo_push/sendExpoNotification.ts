import { Expo } from "expo-server-sdk";

const expo = new Expo();

/**
 * Sends an Expo Push Notification.
 *
 * @param deviceToken - The target device token.
 * @param title - Notification title.
 * @param body - Notification body.
 * @param data - Additional data to include in the notification.
 */
const sendExpoNotification = async (
  deviceToken: string,
  title: string,
  body: string,
  data: Record<string, string>
): Promise<void> => {
  try {
    console.log("Sending notification to deviceToken:", deviceToken);

    if (!Expo.isExpoPushToken(deviceToken)) {
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
  } catch (error: any) {
    console.error("Error sending notification:", error.message);
    console.error("Detailed error:", error);
  }
};

module.exports = sendExpoNotification;
