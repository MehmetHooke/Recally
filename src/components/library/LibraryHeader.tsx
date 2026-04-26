import { useAppTheme } from "@/src/theme/useTheme";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export function LibraryHeader() {
  const { colors } = useAppTheme();
  const { t } = useTranslation("tabs");

  return (
    <View>
      <Text
        style={{
          fontSize: 28,
          fontWeight: "900",
          color: colors.text,
        }}
      >
        {t("library.header.title")}
      </Text>

      <Text
        style={{
          marginTop: 6,
          fontSize: 15,
          color: colors.mutedText,
          lineHeight: 21,
        }}
      >
        {t("library.header.description")}
      </Text>
    </View>
  );
}