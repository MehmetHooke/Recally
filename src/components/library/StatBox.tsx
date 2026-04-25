import { useAppTheme } from "@/src/theme/useTheme";
import { Text, View } from "react-native";

export function StatBox({ label, value }: { label: string; value: number }) {
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 14,
        padding: 12,
      }}
    >
      <Text style={{ color: colors.text, fontSize: 20, fontWeight: "900" }}>
        {value}
      </Text>

      <Text
        style={{
          marginTop: 4,
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