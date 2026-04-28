import { useAppTheme } from "@/src/theme/useTheme";
import { Text, View } from "react-native";

export default function SetProgressRow({
  title,
  value,
  label,
  height,
  variant = "review",
}: {
  title: string;
  value: number;
  label: string;
  height: number;
  variant?: "review" | "mastery";
}) {
  const { colors } = useAppTheme();
  const safeValue = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));

  const fillColor =
    variant === "mastery" ? colors.primary: colors.background;

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: colors.primaryForeground,
            fontSize: 13,
            fontWeight: "900",
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            color: colors.primaryForeground,
            opacity: 0.92,
            fontSize: 12,
            fontWeight: "900",
          }}
        >
          %{safeValue}
        </Text>
      </View>

      <View
        style={{
          marginTop: 7,
          height,
          backgroundColor: "rgba(255,255,255,0.25)",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${safeValue}%`,
            height: "100%",
            backgroundColor: fillColor,
            borderRadius: 999,
          }}
        />
      </View>

      <Text
        style={{
          color: colors.primaryForeground,
          opacity: 0.88,
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