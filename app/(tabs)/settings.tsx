import { LanguageSettingsCard } from "@/src/components/settings/LanguageSettingsCard";
import { NotificationsSettingsCard } from "@/src/components/settings/NotificationsSettingsCard";
import { PremiumSettingsCard } from "@/src/components/settings/PremiumSettingsCard";
import { ProfileCard } from "@/src/components/settings/ProfileCard";
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

type UserPlan = "free" | "premium";

type SettingsUser = {
  firstName: string;
  lastName: string;
  email: string;
  plan: UserPlan;
  usedSets: number;
  maxFreeSets: number;
};

export default function SettingsScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const { t } = useTranslation("tabs");

  const [userData, setUserData] = useState<SettingsUser | null>(null);
  const [loading, setLoading] = useState(true);

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

        {userData ? (
          <>
            <ProfileCard
              firstName={userData.firstName}
              lastName={userData.lastName}
              email={userData.email}
              plan={userData.plan}
            />

            <ThemeSettingsCard />

            <LanguageSettingsCard />

            <NotificationsSettingsCard />

            <PremiumSettingsCard
              plan={userData.plan}
              usedSets={userData.usedSets}
              maxFreeSets={userData.maxFreeSets}
              onUpgrade={() => {
                console.log("Upgrade pressed");
              }}
            />
          </>
        ) : null}

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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}