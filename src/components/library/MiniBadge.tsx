import { useAppTheme } from "@/src/theme/useTheme";
import { Text, View } from "react-native";

export function MiniBadge({ label }: { label: string }) {
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        backgroundColor: colors.background,
        borderColor: colors.border,
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
      }}
    >
      <Text
        style={{
          color: colors.mutedText,
          fontSize: 12,
          fontWeight: "700",
        }}
      >
        {label}
      </Text>
    </View>
  );
}