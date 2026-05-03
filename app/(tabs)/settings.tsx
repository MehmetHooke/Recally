import { LanguageSettingsCard } from "@/src/components/settings/LanguageSettingsCard";
import { NotificationsSettingsCard } from "@/src/components/settings/NotificationsSettingsCard";
import { PremiumSettingsCard } from "@/src/components/settings/PremiumSettingsCard";
import { ProfileCard } from "@/src/components/settings/ProfileCard";
import { SettingsSectionAccordion } from "@/src/components/settings/SettingsAccordionCard";

import { ThemeSettingsCard } from "@/src/components/settings/ThemeSettingsCard";
import { logout } from "@/src/services/auth";
import { auth, db } from "@/src/services/firebase";
import { useAppTheme } from "@/src/theme/useTheme";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type UserPlan = "free" | "premium";

type SettingsUser = {
  firstName: string;
  lastName: string;
  email: string;
  plan: UserPlan;
  usedSets: number;
  maxFreeSets: number;
};

type ExpandedSetting = "theme" | "language" | null;

function alpha(hex: string, opacity: number) {
  const sanitized = hex.replace("#", "");

  if (sanitized.length !== 6) return hex;

  const r = parseInt(sanitized.slice(0, 2), 16);
  const g = parseInt(sanitized.slice(2, 4), 16);
  const b = parseInt(sanitized.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

const settingsLayoutTransition = LinearTransition.springify()
  .damping(45)
  .stiffness(200);

export default function SettingsScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation("tabs");

  const [userData, setUserData] = useState<SettingsUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSetting, setExpandedSetting] =
    useState<ExpandedSetting>("theme");

  const toggleSetting = (setting: Exclude<ExpandedSetting, null>) => {
    setExpandedSetting((prev) => (prev === setting ? null : setting));
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          setUserData(null);
          return;
        }

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          setUserData({
            firstName: user.displayName || "",
            lastName: "",
            email: user.email || "",
            plan: "free",
            usedSets: 0,
            maxFreeSets: 5,
          });
          return;
        }

        const data = userSnap.data();

        setUserData({
          firstName: data.firstName || user.displayName || "",
          lastName: data.lastName || "",
          email: data.email || user.email || "",
          plan: data.plan === "premium" ? "premium" : "free",
          usedSets: typeof data.usedSets === "number" ? data.usedSets : 0,
          maxFreeSets:
            typeof data.maxFreeSets === "number" ? data.maxFreeSets : 5,
        });
      } catch (err) {
        console.log("Settings user load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/(auth)/login");
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 20,
          paddingTop: 40,
          paddingBottom: Math.max(insets.bottom, 12) + 170,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View layout={settingsLayoutTransition}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "900",
              color: colors.text,
            }}
          >
            {t("settings.title")}
          </Text>
        </Animated.View>

        {userData ? (
          <>
            <Animated.View layout={settingsLayoutTransition}>
              <ProfileCard
                firstName={userData.firstName}
                lastName={userData.lastName}
                email={userData.email}
                plan={userData.plan}
              />
            </Animated.View>

            <SettingsSectionAccordion
              title={t("settings.theme.title")}
              description={t("settings.theme.description")}
              iconName="color-palette"
              iconColor={colors.primary}
              iconBackgroundColor={colors.primarySoft}
              iconBorderColor={alpha(colors.primary, 0.18)}
              expanded={expandedSetting === "theme"}
              onPress={() => toggleSetting("theme")}
              colors={colors}
            >
              <ThemeSettingsCard />
            </SettingsSectionAccordion>

            <SettingsSectionAccordion
              title={t("settings.language.title")}
              description={t("settings.language.description")}
              iconName="language"
              iconColor={colors.secondary}
              iconBackgroundColor={colors.secondarySoft}
              iconBorderColor={alpha(colors.secondary, 0.18)}
              expanded={expandedSetting === "language"}
              onPress={() => toggleSetting("language")}
              colors={colors}
            >
              <LanguageSettingsCard />
            </SettingsSectionAccordion>

            <Animated.View layout={settingsLayoutTransition}>
              <NotificationsSettingsCard />
            </Animated.View>

            <Animated.View layout={settingsLayoutTransition}>
              <PremiumSettingsCard
                plan={userData.plan}
                usedSets={userData.usedSets}
                maxFreeSets={userData.maxFreeSets}
                onUpgrade={() => {
                  console.log("Upgrade pressed");
                }}
              />
            </Animated.View>
          </>
        ) : null}

        <Animated.View layout={settingsLayoutTransition}>
          <Pressable
            onPress={handleLogout}
            style={{
              marginTop: 8,
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
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}