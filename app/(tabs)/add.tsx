import SourceAccordionCard from "@/src/components/common/AccordionComponent";
import { useAppAlert } from "@/src/hooks/useAppAlert";
import { createTextSetJob, createYoutubeSetJob } from "@/src/services/functions";
import { useAppTheme } from "@/src/theme/useTheme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


type CreateSubmitButtonProps = {
  label: string;
  loadingLabel?: string;
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
  colors: any;
};

function CreateSubmitButton({
  label,
  loadingLabel,
  loading = false,
  disabled = false,
  onPress,
  colors,
}: CreateSubmitButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={{
        marginTop: 2,
        backgroundColor: colors.primary,
        paddingVertical: 15,
        paddingHorizontal: 14,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 50,
        opacity: isDisabled ? 0.55 : 1,
      }}
    >
      <Text
        style={{
          color: colors.primaryForeground,
          fontWeight: "900",
          fontSize: 14,
        }}
      >
        {loading ? loadingLabel || label : label}
      </Text>
    </Pressable>
  );
}

type ExpandedSource = "youtube" | "text" | "pdf" | null;
type LoadingSource = "youtube" | "text" | null;

function alpha(hex: string, opacity: number) {
  const sanitized = hex.replace("#", "");

  if (sanitized.length !== 6) return hex;

  const r = parseInt(sanitized.slice(0, 2), 16);
  const g = parseInt(sanitized.slice(2, 4), 16);
  const b = parseInt(sanitized.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export default function AddContentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { t } = useTranslation("tabs");
  const { showAlert } = useAppAlert();

  const [expandedSource, setExpandedSource] =
    useState<ExpandedSource>("youtube");

  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [textContent, setTextContent] = useState("");
  const [loadingSource, setLoadingSource] = useState<LoadingSource>(null);

  const textLength = textContent.trim().length;
  const isLoading = loadingSource !== null;
  const canGenerateText = textLength >= 80 && !isLoading;

  const toggleSource = (source: ExpandedSource) => {
    setExpandedSource((prev) => (prev === source ? null : source));
  };

  const isValidYoutubeUrl = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const handleGenerateFromYoutube = async () => {
    const trimmedUrl = youtubeUrl.trim();

    if (!trimmedUrl) {
      showAlert({
        type: "error",
        title: t("add.alerts.errorTitle"),
        message: t("add.alerts.emptyYoutubeUrl"),
      });
      return;
    }

    if (!isValidYoutubeUrl(trimmedUrl)) {
      showAlert({
        type: "error",
        title: t("add.alerts.errorTitle"),
        message: t("add.alerts.invalidYoutubeUrl"),
      });
      return;
    }

    try {
      setLoadingSource("youtube");

      const result = await createYoutubeSetJob(trimmedUrl);

      if (!result.ok || !result.setId) {
        throw new Error(t("add.errors.setCreateFailed"));
      }

      setYoutubeUrl("");
      router.push(`/set/${result.setId}`);
    } catch (error) {
      console.error("YouTube create job error:", error);

      showAlert({
        type: "error",
        title: t("add.alerts.errorTitle"),
        message:
          error instanceof Error
            ? error.message
            : t("add.errors.videoProcessingFailed"),
      });
    } finally {
      setLoadingSource(null);
    }
  };

  const handleGenerateFromText = async () => {
    const trimmedText = textContent.trim();

    if (!trimmedText) {
      showAlert({
        type: "error",
        title: t("add.alerts.errorTitle"),
        message: t("add.textCard.emptyMessage"),
      });
      return;
    }

    if (trimmedText.length < 80) {
      showAlert({
        type: "error",
        title: t("add.alerts.errorTitle"),
        message: t("add.textCard.tooShortMessage"),
      });
      return;
    }

    try {
      setLoadingSource("text");

      const result = await createTextSetJob(trimmedText);

      if (!result.ok || !result.setId) {
        throw new Error(t("add.errors.setCreateFailed"));
      }

      setTextContent("");
      router.push(`/set/${result.setId}`);
    } catch (error) {
      console.error("Text create job error:", error);

      showAlert({
        type: "error",
        title: t("add.alerts.errorTitle"),
        message:
          error instanceof Error
            ? error.message
            : t("add.textCard.processingFailed"),
      });
    } finally {
      setLoadingSource(null);
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: 40,
      }}
      contentContainerStyle={{
        padding: 20,
        paddingBottom: Math.max(insets.bottom, 12) + 170,
        gap: 16,
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View>
        <Text
          style={{
            color: colors.text,
            fontSize: 28,
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

      <SourceAccordionCard
        title={t("add.youtubeCard.title")}
        description={t("add.youtubeCard.description")}
        iconSource={require("@/src/assets/images/youtube.png")}
        iconBackgroundColor={colors.dangerSoft}
        iconBorderColor={alpha(colors.danger, 0.22)}
        expanded={expandedSource === "youtube"}
        onPress={() => toggleSource("youtube")}
        colors={colors}
      >
        <View style={{ gap: 12 }}>
          <TextInput
            value={youtubeUrl}
            onChangeText={setYoutubeUrl}
            placeholder={t("add.youtubeCard.placeholder")}
            placeholderTextColor={colors.mutedText}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
            style={{
              color: colors.text,
              backgroundColor: colors.background,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 14,
              paddingHorizontal: 14,
              paddingVertical: 14,
              fontSize: 15,
            }}
          />

          <CreateSubmitButton
            label={t("add.youtubeCard.submitButton")}
            loadingLabel={t("add.youtubeCard.loadingButton")}
            loading={loadingSource === "youtube"}
            disabled={isLoading}
            onPress={handleGenerateFromYoutube}
            colors={colors}
          />
        </View>
      </SourceAccordionCard>

      <SourceAccordionCard
        title={t("add.textCard.title")}
        description={t("add.textCard.description")}
        iconSource={require("@/src/assets/images/text-source.png")}
        iconBackgroundColor={colors.primarySoft}
        iconBorderColor={alpha(colors.primary, 0.18)}
        expanded={expandedSource === "text"}
        onPress={() => toggleSource("text")}
        colors={colors}
      >
        <View style={{ gap: 12 }}>
          <TextInput
            value={textContent}
            onChangeText={setTextContent}
            placeholder={t("add.textCard.placeholder")}
            placeholderTextColor={colors.subtleText}
            multiline
            scrollEnabled
            textAlignVertical="top"
            autoCapitalize="sentences"
            editable={!isLoading}
            style={{
              color: colors.text,
              backgroundColor: colors.background,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 14,
              paddingHorizontal: 14,
              paddingVertical: 14,
              fontSize: 15,
              lineHeight: 22,
              minHeight: 170,
              maxHeight: 260,
            }}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Text
              style={{
                color: textLength >= 80 ? colors.success : colors.mutedText,
                fontSize: 12,
                fontWeight: "800",
              }}
            >
              {textLength >= 80
                ? t("add.textCard.readyHint", { count: textLength })
                : t("add.textCard.minHint", { count: textLength })}
            </Text>

            {textLength > 0 ? (
              <Pressable onPress={() => setTextContent("")} disabled={isLoading}>
                <Text
                  style={{
                    color: colors.mutedText,
                    fontSize: 12,
                    fontWeight: "900",
                    opacity: isLoading ? 0.5 : 1,
                  }}
                >
                  {t("add.textCard.clearButton")}
                </Text>
              </Pressable>
            ) : null}
          </View>

          <CreateSubmitButton
            label={t("add.textCard.submitButton")}
            loadingLabel={t("add.textCard.loadingButton")}
            loading={loadingSource === "text"}
            disabled={!canGenerateText}
            onPress={handleGenerateFromText}
            colors={colors}
          />
        </View>
      </SourceAccordionCard>

      <SourceAccordionCard
        title={t("add.otherSources.pdfUpload")}
        description={t("add.otherSources.pdfComingSoonShort")}
        iconSource={require("@/src/assets/images/pdf-source.png")}
        iconBackgroundColor={colors.primarySoft}
        iconBorderColor={alpha(colors.primary, 0.18)}
        expanded={expandedSource === "pdf"}
        onPress={() => toggleSource("pdf")}
        colors={colors}
      >
        <View
          style={{
            backgroundColor: colors.background,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 14,
            padding: 14,
            gap: 8,
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: 14,
              fontWeight: "900",
            }}
          >
            {t("add.alerts.comingSoonTitle")}
          </Text>

          <Text
            style={{
              color: colors.mutedText,
              fontSize: 13,
              lineHeight: 19,
            }}
          >
            {t("add.otherSources.pdfComingSoonMessage")}
          </Text>

          <Pressable
            onPress={() =>
              showAlert({
                type: "info",
                title: t("add.alerts.comingSoonTitle"),
                message: t("add.otherSources.pdfComingSoonMessage"),
              })
            }
            style={{
              marginTop: 4,
              backgroundColor: colors.primarySoft,
              paddingVertical: 13,
              borderRadius: 14,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: colors.primary,
                fontWeight: "900",
                fontSize: 14,
              }}
            >
              {t("add.otherSources.pdfComingSoonShort")}
            </Text>
          </Pressable>
        </View>
      </SourceAccordionCard>
    </ScrollView>
  );
}