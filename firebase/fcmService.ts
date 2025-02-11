import admin from "firebase-admin";

const serviceAccount = require("./swiftab.json");

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
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
const sendFirebaseNotification = async (
  deviceToken: string,
  title: string,
  body: string,
  data: Record<string, string>
) => {
  try {
    console.log("Sending notification to deviceToken:", deviceToken);

    const message: admin.messaging.TokenMessage = {
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

    const response = await admin.messaging().send(message);
    console.log("Notification sent successfully:", response);
  } catch (error: any) {
    console.error("Error sending notification:", error.message);
    console.error("Detailed error:", error);
  }
};

module.exports = sendFirebaseNotification;
