import { useAppTheme } from "@/src/theme/useTheme";
import { View } from "react-native";

type Props = {
  currentIndex: number;
  total: number;
};

export function OnboardingDots({ currentIndex, total }: Props) {
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
      }}
    >
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={{
            width: currentIndex === index ? 22 : 8,
            height: 8,
            borderRadius: 999,
            backgroundColor:
              currentIndex === index ? colors.primary : colors.border,
          }}
        />
      ))}
    </View>
  );
}