import { useAppTheme } from "@/src/theme/useTheme";
import { useTranslation } from "react-i18next";
import { Image, Pressable, Text, View } from "react-native";
import { SettingsAccordion } from "./SettingsAccordion";

const moonImage = require("@/src/assets/images/dark.png");
const sunImage = require("@/src/assets/images/light.png");

export function ThemeSettingsCard() {
  const { colors, mode, toggleTheme } = useAppTheme();
  const { t } = useTranslation("tabs");

  return (
    <SettingsAccordion title={t("settings.theme.title")}>
      <View style={{ gap: 10 }}>
        <Pressable
          onPress={() => {
            if (mode !== "light") toggleTheme();
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            padding: 12,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: mode === "light" ? colors.primary : colors.border,
            backgroundColor: colors.background,
          }}
        >
          <Image source={sunImage} style={{ width: 26, height: 26 }} />

          <Text style={{ color: colors.text, fontWeight: "800" }}>
            {t("settings.theme.light")}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            if (mode !== "dark") toggleTheme();
          }}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            padding: 12,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: mode === "dark" ? colors.primary : colors.border,
            backgroundColor: colors.background,
          }}
        >
          <Image source={moonImage} style={{ width: 26, height: 26 }} />

          <Text style={{ color: colors.text, fontWeight: "800" }}>
            {t("settings.theme.dark")}
          </Text>
        </Pressable>
      </View>
    </SettingsAccordion>
  );
}