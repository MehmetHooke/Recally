import { useAppTheme } from "@/src/theme/useTheme";
import { Pressable, Text } from "react-native";

type Props = {
  dueCards: number;
  onPress: () => void;
};

export function DueReminderCard({ dueCards, onPress }: Props) {
  const { colors } = useAppTheme();

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
        {dueCards} kart unutma riskinde
      </Text>

      <Text
        style={{
          color: colors.primaryForeground,
          opacity: 0.9,
          lineHeight: 20,
        }}
      >
        Bu kartları şimdi tekrar edersen bilgiyi daha kalıcı hale getirirsin.
      </Text>
    </Pressable>
  );
}