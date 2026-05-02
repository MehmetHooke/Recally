import { LanguageStep } from "@/src/components/onboarding/LanguageStep";
import { OnboardingButton } from "@/src/components/onboarding/OnboardingButton";
import { OnboardingDots } from "@/src/components/onboarding/OnboardingDots";
import { OnboardingSlide } from "@/src/components/onboarding/OnboardingSlide";
import { setOnboardingCompleted } from "@/src/services/onboarding";
import { useAppTheme } from "@/src/theme/useTheme";
import { router } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ImageSourcePropType } from "react-native";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Language = "tr" | "en";

type OnboardingItem =
  | { type: "language" }
  | {
      type: "slide";
      title: string;
      subtitle: string;
      image: ImageSourcePropType;
    };

const onboardingImages: Record<
  Language,
  {
    onboarding2: ImageSourcePropType;
    onboarding3: ImageSourcePropType;
    onboarding4: ImageSourcePropType;
  }
> = {
  en: {
    onboarding2: require("@/src/assets/images/onboarding/onboarding2EN.png"),
    onboarding3: require("@/src/assets/images/onboarding/onboarding3EN.png"),
    onboarding4: require("@/src/assets/images/onboarding/onboarding4EN.png"),
  },
  tr: {
    onboarding2: require("@/src/assets/images/onboarding/onboarding2TR.png"),
    onboarding3: require("@/src/assets/images/onboarding/onboarding3TR.png"),
    onboarding4: require("@/src/assets/images/onboarding/onboarding4TR.png"),
  },
};

export default function OnboardingScreen() {
  const { colors } = useAppTheme();
  const { t, i18n } = useTranslation("onboarding");
  const { width } = useWindowDimensions();

  const listRef = useRef<FlatList<OnboardingItem>>(null);

  const [index, setIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    null
  );

  const selectedImageLanguage: Language =
    selectedLanguage ?? (i18n.language.startsWith("en") ? "en" : "tr");

  const onboardingItems = useMemo<OnboardingItem[]>(
    () => [
      { type: "language" },
      {
        type: "slide",
        title: t("slide1Title"),
        subtitle: t("slide1Subtitle"),
        image: onboardingImages[selectedImageLanguage].onboarding2,
      },
      {
        type: "slide",
        title: t("slide2Title"),
        subtitle: t("slide2Subtitle"),
        image: onboardingImages[selectedImageLanguage].onboarding3,
      },
      {
        type: "slide",
        title: t("slide3Title"),
        subtitle: t("slide3Subtitle"),
        image: onboardingImages[selectedImageLanguage].onboarding4,
      },
    ],
    [t, selectedImageLanguage]
  );

  const isLanguageStep = index === 0;
  const isLastStep = index === onboardingItems.length - 1;

  const handleNext = async () => {
    if (isLanguageStep && !selectedLanguage) {
      return;
    }

    if (isLastStep) {
      await setOnboardingCompleted();
      router.replace("/(auth)/login");
      return;
    }

    listRef.current?.scrollToIndex({
      index: index + 1,
      animated: true,
    });
  };

  const handleMomentumEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setIndex(nextIndex);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <View style={{ flex: 1 }}>
        <FlatList
          ref={listRef}
          data={onboardingItems}
          keyExtractor={(_, itemIndex) => String(itemIndex)}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={!isLanguageStep || !!selectedLanguage}
          bounces={false}
          onMomentumScrollEnd={handleMomentumEnd}
          renderItem={({ item }) => (
            <View
              style={{
                width,
                flex: 1,
                paddingHorizontal: 24,
                paddingTop: 24,
              }}
            >
              {item.type === "language" ? (
                <LanguageStep
                  selectedLanguage={selectedLanguage}
                  onSelectLanguage={setSelectedLanguage}
                />
              ) : (
                <OnboardingSlide
                  title={item.title}
                  subtitle={item.subtitle}
                  image={item.image}
                />
              )}
            </View>
          )}
        />

        <View
          style={{
            paddingHorizontal: 24,
            paddingBottom: 24,
            gap: 18,
          }}
        >
          <OnboardingDots
            currentIndex={index}
            total={onboardingItems.length}
          />

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