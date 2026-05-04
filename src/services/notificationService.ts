// src/services/notificationService.ts

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function configureNotifications() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("set-processing", {
      name: "Set processing",
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: undefined,
    });
  }
}

export async function requestNotificationPermission() {
  const currentPermission = await Notifications.getPermissionsAsync();

  if (currentPermission.granted) {
    return true;
  }

  const requestedPermission = await Notifications.requestPermissionsAsync();

  return requestedPermission.granted;
}

type NotifySetReadyInput = {
  title: string;
  body: string;
  setId?: string;
};

export async function notifySetReady({
  title,
  body,
  setId,
}: NotifySetReadyInput) {
  const hasPermission = await requestNotificationPermission();

  if (!hasPermission) {
    return false;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: {
        type: "set-ready",
        setId,
      },
    },
    trigger: null,
  });

  return true;
}
