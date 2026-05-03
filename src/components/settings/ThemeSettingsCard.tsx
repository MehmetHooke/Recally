import { useAppTheme } from "@/src/theme/useTheme";
import { useTranslation } from "react-i18next";
import { Image, Pressable, Text, View } from "react-native";

const moonImage = require("@/src/assets/images/dark.png");
const sunImage = require("@/src/assets/images/light.png");

export function ThemeSettingsCard() {
  const { colors, mode, toggleTheme } = useAppTheme();
  const { t } = useTranslation("tabs");

  return (
    <View style={{ gap: 10 }}>
      <Pressable
        onPress={() => {
          if (mode !== "light") toggleTheme();
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          padding: 12,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: mode === "light" ? colors.primary : colors.border,
          backgroundColor: colors.background,
        }}
      >
        <Image source={sunImage} style={{ width: 26, height: 26 }} />

        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontWeight: "900" }}>
            {t("settings.theme.light")}
          </Text>
        </View>

        {mode === "light" ? (
          <Text style={{ color: colors.primary, fontWeight: "900" }}>✓</Text>
        ) : null}
      </Pressable>

      <Pressable
        onPress={() => {
          if (mode !== "dark") toggleTheme();
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          padding: 12,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: mode === "dark" ? colors.primary : colors.border,
          backgroundColor: colors.background,
        }}
      >
        <Image source={moonImage} style={{ width: 26, height: 26 }} />

        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontWeight: "900" }}>
            {t("settings.theme.dark")}
          </Text>
        </View>

        {mode === "dark" ? (
          <Text style={{ color: colors.primary, fontWeight: "900" }}>✓</Text>
        ) : null}
      </Pressable>
    </View>
  );
}