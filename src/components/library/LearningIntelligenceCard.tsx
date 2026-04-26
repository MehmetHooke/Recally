import { useAppTheme } from "@/src/theme/useTheme";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { StatBox } from "./StatBox";

type Props = {
  progress: number;
  totalSets: number;
  totalCards: number;
  dueCards: number;
};

export function LearningIntelligenceCard({
  progress,
  totalSets,
  totalCards,
  dueCards,
}: Props) {
  const { colors } = useAppTheme();
  const { t } = useTranslation("tabs");

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 22,
        padding: 16,
        gap: 14,
      }}
    >
      <View>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: "900" }}>
          {t("library.learning.title")}
        </Text>

        <Text style={{ color: colors.mutedText, marginTop: 5, lineHeight: 20 }}>
          {t("library.learning.description", { progress })}
        </Text>
      </View>

      <View
        style={{
          height: 10,
          backgroundColor: colors.border,
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: colors.primary,
            borderRadius: 999,
          }}
        />
      </View>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <StatBox label={t("library.stats.sets")} value={totalSets} />
        <StatBox label={t("library.stats.cards")} value={totalCards} />
        <StatBox label={t("library.stats.review")} value={dueCards} />
      </View>
    </View>
  );
}