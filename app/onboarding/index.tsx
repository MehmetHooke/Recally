import { LanguageStep } from "@/src/components/onboarding/LanguageStep";
import { OnboardingButton } from "@/src/components/onboarding/OnboardingButton";
import { OnboardingDots } from "@/src/components/onboarding/OnboardingDots";
import { OnboardingSlide } from "@/src/components/onboarding/OnboardingSlide";
import { setOnboardingCompleted } from "@/src/services/onboarding";
import { useAppTheme } from "@/src/theme/useTheme";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Language = "tr" | "en";

export default function OnboardingScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation("onboarding");

  const [index, setIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    null
  );

  const slides = useMemo(
    () => [
      {
        title: t("slide1Title"),
        subtitle: t("slide1Subtitle"),
        visualType: "youtube" as const,
      },
      {
        title: t("slide2Title"),
        subtitle: t("slide2Subtitle"),
        visualType: "quiz" as const,
      },
      {
        title: t("slide3Title"),
        subtitle: t("slide3Subtitle"),
        visualType: "intelligence" as const,
      },
    ],
    [t]
  );

  const totalSteps = slides.length + 1;
  const isLanguageStep = index === 0;
  const isLastStep = index === totalSteps - 1;

  const handleNext = async () => {
    if (isLanguageStep && !selectedLanguage) {
      return;
    }

    if (isLastStep) {
      await setOnboardingCompleted();
      router.replace("/(auth)/login");
      return;
    }

    setIndex((prev) => prev + 1);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        padding: 24,
      }}
    >
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          {isLanguageStep ? (
            <LanguageStep
              selectedLanguage={selectedLanguage}
              onSelectLanguage={setSelectedLanguage}
            />
          ) : (
            <OnboardingSlide {...slides[index - 1]} />
          )}
        </View>

        <View style={{ gap: 18 }}>
          <OnboardingDots currentIndex={index} total={totalSteps} />

          <OnboardingButton
            label={isLastStep ? t("getStarted") : t("continue")}
            onPress={handleNext}
            disabled={isLanguageStep && !selectedLanguage}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}