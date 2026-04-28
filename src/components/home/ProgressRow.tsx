import { useAppTheme } from "@/src/theme/useTheme";
import { Text, View } from "react-native";

export default function ProgressRow({
  title,
  value,
  label,
  height,
  color,
}: {
  title: string;
  value: number;
  label: string;
  height: number;
  color: string;
}) {
  const { colors } = useAppTheme();
  const safeValue = Number.isFinite(value) ? value : 0;

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ color: colors.text, fontWeight: "900", fontSize: 14 }}>
          {title}
        </Text>

        <Text style={{ color: colors.mutedText, fontWeight: "900", fontSize: 13 }}>
          %{safeValue}
        </Text>
      </View>

      <View
        style={{
          marginTop: 8,
          height,
          backgroundColor: colors.border,
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${safeValue}%`,
            height: "100%",
            backgroundColor: color,
            borderRadius: 999,
          }}
        />
      </View>

      <Text
        style={{
          color: colors.mutedText,
          marginTop: 5,
          fontSize: 12,
          fontWeight: "700",
        }}
      >
        {label}
      </Text>
    </View>
  );
}