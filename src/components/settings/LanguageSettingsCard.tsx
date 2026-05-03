import { changeAppLanguage } from "@/src/i18n";
import { useAppTheme } from "@/src/theme/useTheme";
import { useTranslation } from "react-i18next";
import { Image, Pressable, Text, View } from "react-native";

const trFlag = require("@/src/assets/images/tr-flag.png");
const enFlag = require("@/src/assets/images/en-flag.png");

export function LanguageSettingsCard() {
  const { colors } = useAppTheme();
  const { t, i18n } = useTranslation("tabs");

  const currentLanguage = i18n.language === "tr" ? "tr" : "en";

  const handleLanguageChange = async (lang: "tr" | "en") => {
    await changeAppLanguage(lang);
  };

  return (
    <View style={{ gap: 10 }}>
      <Pressable
        onPress={() => handleLanguageChange("tr")}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          padding: 12,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: currentLanguage === "tr" ? colors.primary : colors.border,
          backgroundColor: colors.background,
        }}
      >
        <Image source={trFlag} style={{ width: 26, height: 26 }} />

        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontWeight: "900" }}>
            {t("settings.language.turkish")}
          </Text>
        </View>

        {currentLanguage === "tr" ? (
          <Text style={{ color: colors.primary, fontWeight: "900" }}>✓</Text>
        ) : null}
      </Pressable>

      <Pressable
        onPress={() => handleLanguageChange("en")}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          padding: 12,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: currentLanguage === "en" ? colors.primary : colors.border,
          backgroundColor: colors.background,
        }}
      >
        <Image source={enFlag} style={{ width: 26, height: 26 }} />

        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.text, fontWeight: "900" }}>
            {t("settings.language.english")}
          </Text>
        </View>

        {currentLanguage === "en" ? (
          <Text style={{ color: colors.primary, fontWeight: "900" }}>✓</Text>
        ) : null}
      </Pressable>
    </View>
  );
}