import { getSummaryPreview, SetItem } from "@/src/services/setService";
import { useAppTheme } from "@/src/theme/useTheme";
import { useTranslation } from "react-i18next";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { MiniBadge } from "./MiniBadge";

type Props = {
  item: SetItem;
  onPress: () => void;
};

export function LibrarySetCard({ item, onPress }: Props) {
  const { colors } = useAppTheme();
  const { t } = useTranslation("tabs");

  const total = item.totalCards ?? 0;
  const due = item.dueCount ?? 0;
  const reviewProgress = item.reviewProgress ?? 0;
  const masteryProgress = item.masteryProgress ?? 0;

  const isProcessing = item.status === "processing";
  const isFailed = item.status === "failed";

  const statusLabel = isFailed
    ? t("library.setCard.status.failed")
    : isProcessing
      ? t("library.setCard.status.processing")
      : due > 0
        ? t("library.setCard.status.due")
        : masteryProgress >= 100
          ? t("library.setCard.status.mastered")
          : t("library.setCard.status.inProgress");

  const statusColor = isFailed
    ? colors.danger
    : isProcessing
      ? colors.warning
      : due > 0
        ? colors.primary
        : masteryProgress >= 100
          ? "#16A34A"
          : colors.mutedText;

  const displayTitle = isFailed
    ? t("library.setCard.failedTitle")
    : isProcessing
      ? t("library.setCard.processingTitle")
      : item.title;

  const summaryPreview = isFailed
    ? item.errorMessage || t("library.setCard.failedDescription")
    : isProcessing
      ? t("library.setCard.processingDescription")
      : getSummaryPreview(item.summary) || item.sourceText;

  const ctaLabel = isFailed
    ? t("library.setCard.failedCta")
    : isProcessing
      ? t("library.setCard.processingCta")
      : t("library.setCard.cta");

  const iconSource =
    item.sourceType === "youtube"
      ? require("@/src/assets/images/youtube.png")
      : require("@/src/assets/images/textBook.png");

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 18,
        padding: 16,
        gap: 12,
      }}
    >
      <View>
        <Text
          style={{
            color: colors.text,
            fontSize: 18,
            fontWeight: "900",
          }}
          numberOfLines={1}
        >
          {displayTitle}
        </Text>

        <Text
          style={{
            color: statusColor,
            fontSize: 12,
            fontWeight: "900",
            marginTop: 5,
          }}
        >
          {statusLabel}
        </Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 6,
          }}
        >
          <Image
            source={iconSource}
            style={{
              width: 22,
              height: 22,
              marginRight: 5,
              resizeMode: "contain",
            }}
          />

          <Text
            style={{
              color: colors.mutedText,
              fontSize: 13,
              fontWeight: "700",
            }}
          >
            {item.sourceType === "youtube"
              ? t("library.setCard.youtubeSource")
              : t("library.setCard.textSource")}
          </Text>
        </View>
      </View>

      <Text
        numberOfLines={2}
        style={{
          color: colors.mutedText,
          fontSize: 14,
          lineHeight: 20,
        }}
      >
        {summaryPreview}
      </Text>

      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        <MiniBadge label={t("library.setCard.cardsBadge", { count: total })} />
        <MiniBadge label={t("library.setCard.dueBadge", { count: due })} />
        <MiniBadge
          label={t("library.setCard.masteredBadge", {
            progress: reviewProgress,
          })}
        />
      </View>

      <View
        style={{
          height: 8,
          backgroundColor: colors.border,
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${reviewProgress}%`,
            height: "100%",
            backgroundColor: colors.primary,
            borderRadius: 999,
          }}
        />
      </View>

      <Text
        style={{
          color: isFailed ? colors.danger : colors.primary,
          fontWeight: "900",
          marginTop: 2,
        }}
      >
        {ctaLabel}
      </Text>
    </TouchableOpacity>
  );
}