import { useAppTheme } from "@/src/theme/useTheme";
import { Text, View } from "react-native";
import type { McqReviewCard } from "./types";

type Props = {
  card: McqReviewCard;
  isCorrect: boolean;
  isMcq: boolean;
  feedbackText: string;
};

export function ReviewFeedbackCard({
  card,
  isCorrect,
  isMcq,
  feedbackText,
}: Props) {
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderColor: isCorrect ? "#22C55E" : "#EF4444",
        borderWidth: 1,
        borderRadius: 20,
        padding: 16,
        gap: 10,
      }}
    >
      <Text
        style={{
          color: isCorrect ? "#16A34A" : "#DC2626",
          fontSize: 18,
          fontWeight: "900",
        }}
      >
        {isCorrect ? "Bravo!" : "Oops!"}
      </Text>

      <Text
        style={{
          color: colors.text,
          fontSize: 15,
          lineHeight: 22,
        }}
      >
        {feedbackText}
      </Text>

      {!isCorrect && isMcq ? (
        <Text
          style={{
            color: colors.mutedText,
            lineHeight: 21,
          }}
        >
          Doğru cevap: {card.options?.[card.correctIndex ?? 0]}
        </Text>
      ) : null}
    </View>
  );
}