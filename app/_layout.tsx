import "@/global.css";
import { AppAlertProvider } from "@/src/context/AppAlertContext";
import { AuthProvider, useAuth } from "@/src/context/AuthContext";
import { initI18n } from "@/src/i18n";
import { getOnboardingCompleted } from "@/src/services/onboarding";
import { ThemeProvider } from "@/src/theme/ThemeProvider";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

function AppLoading() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

function RootLayoutInner() {
  const { user, loading } = useAuth();
  const [onboardingReady, setOnboardingReady] = useState(false);
  const [onboardingCompleted, setOnboardingCompletedState] = useState(false);

  useEffect(() => {
    getOnboardingCompleted()
      .then(setOnboardingCompletedState)
      .finally(() => setOnboardingReady(true));
  }, []);

  if (loading || !onboardingReady) {
    return <AppLoading />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!onboardingCompleted ? (
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      ) : !user ? (
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  const [i18nReady, setI18nReady] = useState(false);

  useEffect(() => {
    initI18n()
      .catch((error) => {
        console.log("i18n init error:", error);
      })
      .finally(() => {
        setI18nReady(true);
      });
  }, []);

  if (!i18nReady) {
    return <AppLoading />;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppAlertProvider>
            <RootLayoutInner />
          </AppAlertProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}