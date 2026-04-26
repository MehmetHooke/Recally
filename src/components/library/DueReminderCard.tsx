import { useAppTheme } from "@/src/theme/useTheme";
import { useTranslation } from "react-i18next";
import { Pressable, Text } from "react-native";

type Props = {
  dueCards: number;
  onPress: () => void;
};

export function DueReminderCard({ dueCards, onPress }: Props) {
  const { colors } = useAppTheme();
  const { t } = useTranslation("tabs");

  if (dueCards <= 0) return null;

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: colors.primary,
        borderRadius: 20,
        padding: 16,
        gap: 8,
      }}
    >
      <Text
        style={{
          color: colors.primaryForeground,
          fontSize: 18,
          fontWeight: "900",
        }}
      >
        {t("library.dueReminder.title", { count: dueCards })}
      </Text>

      <Text
        style={{
          color: colors.primaryForeground,
          opacity: 0.9,
          lineHeight: 20,
        }}
      >
        {t("library.dueReminder.description")}
      </Text>
    </Pressable>
  );
}