import AsyncStorage from "@react-native-async-storage/async-storage";

const ONBOARDING_COMPLETED_KEY = "recallly-onboarding-completed";

export async function getOnboardingCompleted() {
  //   const value = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
  //   return value === "true";
  return false;
}

export async function setOnboardingCompleted() {
  await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
}

export async function resetOnboardingCompleted() {
  await AsyncStorage.removeItem(ONBOARDING_COMPLETED_KEY);
}
