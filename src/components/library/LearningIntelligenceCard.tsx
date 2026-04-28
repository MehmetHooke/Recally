import { useAppTheme } from "@/src/theme/useTheme";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { StatBox } from "./StatBox";

type Props = {
  reviewProgress: number;
  masteryProgress: number;
  totalSets: number;
  totalCards: number;
  dueCards: number;
};

export function LearningIntelligenceCard({
  masteryProgress,
  reviewProgress,
  totalSets,
  totalCards,
  dueCards,
}: Props) {
  const { colors } = useAppTheme();
  const { t } = useTranslation("tabs");

  const safeReviewProgress = Number.isFinite(reviewProgress)
    ? reviewProgress
    : 0;

  const safeMasteryProgress = Number.isFinite(masteryProgress)
    ? masteryProgress
    : 0;

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 22,
        padding: 16,
        gap: 16,
      }}
    >
      <View>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: "900" }}>
          {t("library.learning.title")}
        </Text>

        <Text style={{ color: colors.mutedText, marginTop: 5, lineHeight: 20 }}>
          {t("library.learning.description", {
            reviewProgress: safeReviewProgress,
            masteryProgress: safeMasteryProgress,
          })}
        </Text>
      </View>

      <ProgressRow
        title={t("library.learning.reviewProgressTitle")}
        value={safeReviewProgress}
        label={t("library.learning.reviewProgressLabel", {
          progress: safeReviewProgress,
        })}
        height={10}
        color={colors.primary}
      />

      <ProgressRow
        title={t("library.learning.masteryProgressTitle")}
        value={safeMasteryProgress}
        label={t("library.learning.masteryProgressLabel", {
          progress: safeMasteryProgress,
        })}
        height={6}
        color="#16A34A"
      />

      <View style={{ flexDirection: "row", gap: 10 }}>
        <StatBox label={t("library.stats.sets")} value={totalSets} />
        <StatBox label={t("library.stats.cards")} value={totalCards} />
        <StatBox label={t("library.stats.review")} value={dueCards} />
      </View>
    </View>
  );
}

function ProgressRow({
  title,
  value,
  label,
  height,
  color,
}: {
  title: string;
  value: number;
  label: string;
  height: number;
  color: string;
}) {
  const { colors } = useAppTheme();
  const safeValue = Number.isFinite(value) ? value : 0;

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ color: colors.text, fontWeight: "900", fontSize: 14 }}>
          {title}
        </Text>

        <Text
          style={{
            color: colors.mutedText,
            fontWeight: "900",
            fontSize: 13,
          }}
        >
          %{safeValue}
        </Text>
      </View>

      <View
        style={{
          marginTop: 8,
          height,
          backgroundColor: colors.border,
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${safeValue}%`,
            height: "100%",
            backgroundColor: color,
            borderRadius: 999,
          }}
        />
      </View>

      <Text
        style={{
          color: colors.mutedText,
          marginTop: 5,
          fontSize: 12,
          fontWeight: "700",
        }}
      >
        {label}
      </Text>
    </View>
  );
}