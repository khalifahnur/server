const sendExpoNotification = async (
  deviceToken: string,
  title: string,
  body: string,
  data: Record<string, string>
): Promise<void> => {
  try {
    // 1. Dynamic Import: This works in both CommonJS and ESM
    const { Expo } = await import("expo-server-sdk");
    const expo = new Expo();

    if (!Expo.isExpoPushToken(deviceToken)) {
      console.error(`Push token ${deviceToken} is not a valid Expo push token`);
      return;
    }

    const messages = [{
      to: deviceToken,
      sound: "default" as const,
      title,
      body,
      data,
    }];

    const tickets = await expo.sendPushNotificationsAsync(messages);
    console.log("Notification ticket:", tickets);

  } catch (error: any) {
    console.error("Error sending notification:", error.message);
  }
};

export default sendExpoNotification;