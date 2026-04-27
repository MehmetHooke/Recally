import { changeAppLanguage } from "@/src/i18n";
import { logout } from "@/src/services/auth";
import { useAppTheme } from "@/src/theme/useTheme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  Text,
  UIManager,
  View
} from "react-native";

const trFlag = require("@/src/assets/images/tr-flag.png");
const enFlag = require("@/src/assets/images/en-flag.png");
const moonImage = require("@/src/assets/images/dark.png");
const sunImage = require("@/src/assets/images/light.png");


function Accordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { colors } = useAppTheme();
  const [open, setOpen] = useState(false);


  const toggle = () => {
    LayoutAnimation.configureNext({
      duration: 420,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    });

    setOpen((prev) => !prev);
  };

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
        overflow: "hidden",
      }}
    >
      <Pressable
        onPress={toggle}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ color: colors.text, fontWeight: "800", fontSize: 16 }}>
          {title}
        </Text>

        <Text style={{ color: colors.mutedText, fontWeight: "900" }}>
          {open ? "−" : "+"}
        </Text>
      </Pressable>

      {open ? <View style={{ marginTop: 14 }}>{children}</View> : null}
    </View>
  );
}

export default function SettingsScreen() {
  const { colors, mode, toggleTheme } = useAppTheme();

  if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
  }
  const router = useRouter();
  const { t, i18n } = useTranslation("tabs");

  const currentLanguage = i18n.language === "tr" ? "tr" : "en";

  const handleLanguageChange = async (lang: "tr" | "en") => {
    await changeAppLanguage(lang);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/(auth)/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 20,
          paddingTop:40,
          paddingBottom: 120,
          gap: 20,
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "900",
            color: colors.text,
          }}
        >
          {t("settings.title")}
        </Text>

        <Accordion title={t("settings.theme.title")}>
          <View style={{ gap: 10 }}>
            <Pressable
              onPress={() => {
                if (mode !== "light") toggleTheme();
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
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
                padding: 12,
                gap: 5,
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
        </Accordion>

        <Accordion title={t("settings.language.title")}>
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
                borderColor:
                  currentLanguage === "tr" ? colors.primary : colors.border,
                backgroundColor: colors.background,
              }}
            >
              <Image source={trFlag} style={{ width: 26, height: 26 }} />
              <Text style={{ color: colors.text, fontWeight: "800" }}>
                {t("settings.language.turkish")}
              </Text>
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
                borderColor:
                  currentLanguage === "en" ? colors.primary : colors.border,
                backgroundColor: colors.background,
              }}
            >
              <Image source={enFlag} style={{ width: 26, height: 26 }} />
              <Text style={{ color: colors.text, fontWeight: "800" }}>
                {t("settings.language.english")}
              </Text>
            </Pressable>
          </View>
        </Accordion>

        <View
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 16,
            padding: 16,
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontWeight: "800",
              marginBottom: 10,
              fontSize: 16,
            }}
          >
            {t("settings.notifications.title")}
          </Text>

          <Text style={{ color: colors.mutedText }}>
            {t("settings.notifications.description")}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 16,
            padding: 16,
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontWeight: "800",
              marginBottom: 10,
              fontSize: 16,
            }}
          >
            {t("settings.premium.title")}
          </Text>

          <Text style={{ color: colors.mutedText }}>
            {t("settings.premium.description")}
          </Text>

          <Pressable
            style={{
              marginTop: 10,
              backgroundColor: colors.primary,
              padding: 12,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: colors.primaryForeground,
                fontWeight: "800",
              }}
            >
              {t("settings.premium.button")}
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={handleLogout}
          style={{
            marginTop: 20,
            backgroundColor: colors.primary,
            padding: 14,
            borderRadius: 14,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: colors.primaryForeground,
              fontWeight: "900",
            }}
          >
            {t("settings.logout")}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}