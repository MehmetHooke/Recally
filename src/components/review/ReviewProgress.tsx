import { useAppTheme } from "@/src/theme/useTheme";
import { Text, View } from "react-native";

type Props = {
  currentIndex: number;
  totalCards: number;
};

export function ReviewProgress({ currentIndex, totalCards }: Props) {
  const { colors } = useAppTheme();
  const progress = totalCards > 0 ? ((currentIndex + 1) / totalCards) * 100 : 0;

  return (
    <View>
      <Text style={{ color: colors.mutedText, fontWeight: "800" }}>
        Card {currentIndex + 1} / {totalCards}
      </Text>

      <View
        style={{
          marginTop: 10,
          height: 9,
          backgroundColor: colors.border,
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: colors.primary,
          }}
        />
      </View>
    </View>
  );
}