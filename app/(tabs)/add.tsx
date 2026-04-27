import { createYoutubeSetJob } from "@/src/services/functions";
import { useAppTheme } from "@/src/theme/useTheme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function AddContentScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { t } = useTranslation("tabs");

  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidYoutubeUrl = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const handleGenerateFromYoutube = async () => {
    const trimmedUrl = youtubeUrl.trim();

    if (!trimmedUrl) {
      Alert.alert(t("add.alerts.errorTitle"), t("add.alerts.emptyYoutubeUrl"));
      return;
    }

    if (!isValidYoutubeUrl(trimmedUrl)) {
      Alert.alert(t("add.alerts.errorTitle"), t("add.alerts.invalidYoutubeUrl"));
      return;
    }

    try {
      setLoading(true);

      const result = await createYoutubeSetJob(trimmedUrl);

      if (!result.ok || !result.setId) {
        throw new Error(t("add.errors.setCreateFailed"));
      }

      router.push(`/set/${result.setId}`);
    } catch (error) {
      console.error("YouTube create job error:", error);

      Alert.alert(
        t("add.alerts.errorTitle"),
        error instanceof Error
          ? error.message
          : t("add.errors.videoProcessingFailed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background, paddingTop: 40 }}
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 120,
        gap: 18,
      }}
    >
      <View>
        <Text
          style={{
            color: colors.text,
            fontSize: 30,
            fontWeight: "900",
          }}
        >
          {t("add.title")}
        </Text>

        <Text
          style={{
            color: colors.mutedText,
            marginTop: 6,
            fontSize: 15,
            lineHeight: 21,
          }}
        >
          {t("add.subtitle")}
        </Text>
      </View>

      <View
        style={{
          backgroundColor: colors.primary,
          borderRadius: 26,
          padding: 22,
          gap: 14,
        }}
      >
        <Text
          style={{
            color: colors.primaryForeground,
            fontSize: 25,
            fontWeight: "900",
            lineHeight: 31,
          }}
        >
          {t("add.youtubeCard.title")}
        </Text>

        <Text
          style={{
            color: colors.primaryForeground,
            opacity: 0.9,
            fontSize: 15,
            lineHeight: 22,
          }}
        >
          {t("add.youtubeCard.description")}
        </Text>

        <View
          style={{
            backgroundColor: colors.card,
            borderRadius: 18,
            padding: 14,
            gap: 12,
          }}
        >
          <TextInput
            value={youtubeUrl}
            onChangeText={setYoutubeUrl}
            placeholder={t("add.youtubeCard.placeholder")}
            placeholderTextColor={colors.mutedText}
            autoCapitalize="none"
            autoCorrect={false}
            style={{
              color: colors.text,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 14,
              padding: 14,
              fontSize: 15,
            }}
          />

          <Pressable
            onPress={handleGenerateFromYoutube}
            disabled={loading}
            style={{
              backgroundColor: colors.primary,
              paddingVertical: 15,
              borderRadius: 15,
              alignItems: "center",
              opacity: loading ? 0.6 : 1,
            }}
          >
            <Text
              style={{
                color: colors.primaryForeground,
                fontWeight: "900",
                fontSize: 15,
              }}
            >
              {loading
                ? t("add.youtubeCard.loadingButton")
                : t("add.youtubeCard.submitButton")}
            </Text>
          </Pressable>
        </View>
      </View>

      <View
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 20,
          padding: 16,
          gap: 10,
        }}
      >
        <Text
          style={{
            color: colors.text,
            fontSize: 17,
            fontWeight: "900",
          }}
        >
          {t("add.otherSources.title")}
        </Text>

        <Pressable
          onPress={() =>
            Alert.alert(
              t("add.alerts.comingSoonTitle"),
              t("add.otherSources.textModeComingSoonMessage")
            )
          }
          style={{
            backgroundColor: colors.background,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 14,
            padding: 14,
          }}
        >
          <Text style={{ color: colors.text, fontWeight: "800" }}>
            {t("add.otherSources.pasteText")}
          </Text>
        </Pressable>

        <Pressable
          onPress={() =>
            Alert.alert(
              t("add.alerts.comingSoonTitle"),
              t("add.otherSources.pdfComingSoonMessage")
            )
          }
          style={{
            backgroundColor: colors.background,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 14,
            padding: 14,
          }}
        >
          <Text style={{ color: colors.mutedText, fontWeight: "800" }}>
            {t("add.otherSources.pdfUpload")}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}