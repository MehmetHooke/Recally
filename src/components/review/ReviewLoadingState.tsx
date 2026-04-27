import { useAppTheme } from "@/src/theme/useTheme";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text, View } from "react-native";

export function ReviewLoadingState() {
  const { colors } = useAppTheme();
  const { t } = useTranslation("set");
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
        {t("review.reviewLoading.loading")}
      </Text>
    </View>
  );
}