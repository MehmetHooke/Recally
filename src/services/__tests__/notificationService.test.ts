import * as Notifications from "expo-notifications";
import { notifySetReady } from "../notificationService";

jest.mock("expo-notifications", () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  AndroidImportance: {
    DEFAULT: 3,
  },
}));

describe("notificationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("permission zaten varsa notification gönderir", async () => {
    jest.mocked(Notifications.getPermissionsAsync).mockResolvedValue({
      granted: true,
    } as any);

    const result = await notifySetReady({
      title: "Kartların hazır",
      body: "React Hooks",
      setId: "set-123",
    });

    expect(result).toBe(true);

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
      content: {
        title: "Kartların hazır",
        body: "React Hooks",
        data: {
          type: "set-ready",
          setId: "set-123",
        },
      },
      trigger: null,
    });
  });

  it("permission yoksa izin ister ve izin verilirse notification gönderir", async () => {
    jest.mocked(Notifications.getPermissionsAsync).mockResolvedValue({
      granted: false,
    } as any);

    jest.mocked(Notifications.requestPermissionsAsync).mockResolvedValue({
      granted: true,
    } as any);

    const result = await notifySetReady({
      title: "Your cards are ready",
      body: "You can start reviewing now.",
      setId: "set-456",
    });

    expect(result).toBe(true);
    expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled();
  });

  it("permission reddedilirse notification göndermez", async () => {
    jest.mocked(Notifications.getPermissionsAsync).mockResolvedValue({
      granted: false,
    } as any);

    jest.mocked(Notifications.requestPermissionsAsync).mockResolvedValue({
      granted: false,
    } as any);

    const result = await notifySetReady({
      title: "Kartların hazır",
      body: "React Hooks",
      setId: "set-789",
    });

    expect(result).toBe(false);
    expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });
});
