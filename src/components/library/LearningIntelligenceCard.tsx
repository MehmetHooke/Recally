import { useAppTheme } from "@/src/theme/useTheme";
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
          Learning Intelligence
        </Text>

        <Text style={{ color: colors.mutedText, marginTop: 5, lineHeight: 20 }}>
          Şu an genel ilerlemen %{progress}. Tekrar bekleyen kartlar, unutma
          riskinin olduğu yerleri gösterir.
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
        <StatBox label="Set" value={totalSets} />
        <StatBox label="Kart" value={totalCards} />
        <StatBox label="Tekrar" value={dueCards} />
      </View>
    </View>
  );
}