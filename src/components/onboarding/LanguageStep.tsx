import { changeAppLanguage } from "@/src/i18n";
import { useAppTheme } from "@/src/theme/useTheme";
import { useTranslation } from "react-i18next";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from "react-native";

const trFlag = require("@/src/assets/images/tr-flag.png");
const enFlag = require("@/src/assets/images/en-flag.png");

type Language = "tr" | "en";

type Props = {
  selectedLanguage: Language | null;
  onSelectLanguage: (language: Language) => void;
};

export function LanguageStep({
  selectedLanguage,
  onSelectLanguage,
}: Props) {
  const { colors } = useAppTheme();
  const { t } = useTranslation("onboarding");

  const handleSelect = async (language: Language) => {
    await changeAppLanguage(language);
    onSelectLanguage(language);
  };

  return (
    <View style={{ gap: 20 }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: colors.text,
            fontSize: 32,
            fontWeight: "900",
            lineHeight: 38,
          }}
        >
          {t("languageTitle")}
        </Text>

        <Text
          style={{
            color: colors.mutedText,
            fontSize: 16,
            lineHeight: 23,
            marginTop: 10,
          }}
        >
          {t("languageSubtitle")}
        </Text>
      </View>

      <View style={{ gap: 12 }}>
        <LanguageOption
          label={t("turkish")}
          flag={trFlag}
          active={selectedLanguage === "tr"}
          onPress={() => handleSelect("tr")}
        />

        <LanguageOption
          label={t("english")}
          flag={enFlag}
          active={selectedLanguage === "en"}
          onPress={() => handleSelect("en")}
        />
      </View>
    </View>
  );
}

function LanguageOption({
  label,
  active,
  onPress,
  flag,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  flag: ImageSourcePropType;
}) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: active ? colors.primary : colors.card,
        borderColor: active ? colors.primary : colors.border,
        borderWidth: 1,
        borderRadius: 18,
        padding: 18,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
      }}
    >
      <Image
        source={flag}
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
        }}
        resizeMode="cover"
      />

      <Text
        style={{
          color: active ? colors.primaryForeground : colors.text,
          fontSize: 17,
          fontWeight: "900",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}