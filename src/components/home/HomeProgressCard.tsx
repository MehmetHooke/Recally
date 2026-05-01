import { useAppTheme } from "@/src/theme/useTheme";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

type Props = {
  reviewProgress: number;
  masteryProgress: number;
  totalSets: number;
  totalCards: number;
  dueCards: number;
};

export function HomeProgressCard({
  reviewProgress,
  masteryProgress,
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
        borderColor: colors.softBorder,
        borderWidth: 1,
        borderRadius: 22,
        padding: 16,
        gap: 16,
      }}
    >
      <View>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: "900" }}>
          {t("home.progress.title")}
        </Text>

        <Text style={{ color: colors.mutedText, marginTop: 5, lineHeight: 20 }}>
          {t("home.progress.description", {
            reviewProgress: safeReviewProgress,
            masteryProgress: safeMasteryProgress,
          })}
        </Text>
      </View>

      <ProgressRow
        title={t("home.progress.reviewTitle")}
        value={safeReviewProgress}
        label={t("home.progress.reviewLabel", {
          progress: safeReviewProgress,
        })}
        height={10}
        color={colors.primary}
      />

      <ProgressRow
        title={t("home.progress.masteryTitle")}
        value={safeMasteryProgress}
        label={t("home.progress.masteryLabel", {
          progress: safeMasteryProgress,
        })}
        height={6}
        color={colors.success}
      />

      <View style={{ flexDirection: "row", gap: 10 }}>
        <MiniStat label={t("home.stats.sets")} value={totalSets} />
        <MiniStat label={t("home.stats.cards")} value={totalCards} />
        <MiniStat label={t("home.stats.due")} value={dueCards} />
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

  const safeValue = Math.max(
    0,
    Math.min(100, Number.isFinite(value) ? value : 0)
  );

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
          backgroundColor: colors.progressTrack,
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

function MiniStat({ label, value }: { label: string; value: number }) {
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.primarySoft,
        borderColor: colors.softBorder,
        borderWidth: 1,
        borderRadius: 14,
        padding: 12,
      }}
    >
      <Text style={{ color: colors.text, fontSize: 20, fontWeight: "900" }}>
        {value}
      </Text>

      <Text
        style={{
          color: colors.mutedText,
          marginTop: 4,
          fontSize: 12,
          fontWeight: "700",
        }}
      >
        {label}
      </Text>
    </View>
  );
}