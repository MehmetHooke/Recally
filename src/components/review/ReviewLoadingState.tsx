import { useAppTheme } from "@/src/theme/useTheme";
import { ActivityIndicator, Text, View } from "react-native";

export function ReviewLoadingState() {
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator color={colors.primary} />
      <Text style={{ marginTop: 12, color: colors.mutedText }}>
        Review yükleniyor...
      </Text>
    </View>
  );
}