import { useAppTheme } from "@/src/theme/useTheme";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export function NotificationsSettingsCard() {
  const { colors } = useAppTheme();
  const { t } = useTranslation("tabs");

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
      }}
    >
      <Text
        style={{
          color: colors.text,
          fontWeight: "800",
          marginBottom: 10,
          fontSize: 16,
        }}
      >
        {t("settings.notifications.title")}
      </Text>

      <Text style={{ color: colors.mutedText }}>
        {t("settings.notifications.description")}
      </Text>
    </View>
  );
}