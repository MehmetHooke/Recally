import { useAuth } from "@/src/context/AuthContext";
import { getOnboardingCompleted } from "@/src/services/onboarding";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

function AppLoading() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

export default function IndexScreen() {
  const { user, loading } = useAuth();
  const [onboardingReady, setOnboardingReady] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    getOnboardingCompleted()
      .then(setOnboardingCompleted)
      .finally(() => setOnboardingReady(true));
  }, []);

  if (loading || !onboardingReady) {
    return <AppLoading />;
  }

  if (!onboardingCompleted) {
    return <Redirect href="/onboarding" />;
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(tabs)" />;
}
