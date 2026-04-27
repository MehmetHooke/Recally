import { useAppTheme } from "@/src/theme/useTheme";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import type { McqReviewCard } from "./types";

type Props = {
  card: McqReviewCard;
  selectedIndex: number | null;
  answered: boolean;
  submitting: boolean;
  isMcq: boolean;
  onSelectOption: (index: number) => void;
  onShowBasicAnswer: () => void;
};

export function ReviewQuestionCard({
  card,
  selectedIndex,
  answered,
  submitting,
  isMcq,
  onSelectOption,
  onShowBasicAnswer,
}: Props) {
  const { colors } = useAppTheme();
  const { t } = useTranslation("set");

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 24,
        padding: 20,
        gap: 18,
      }}
    >
      <Text
        style={{
          color: colors.text,
          fontSize: 24,
          fontWeight: "900",
          lineHeight: 31,
        }}
      >
        {card.question}
      </Text>

      {isMcq ? (
        <View style={{ gap: 10 }}>
          {card.options!.map((option, index) => {
            const isSelected = selectedIndex === index;
            const optionIsCorrect = card.correctIndex === index;

            let bg = colors.background;
            let border = colors.border;
            let textColor = colors.text;

            if (answered) {
              if (optionIsCorrect) {
                bg = "#DCFCE7";
                border = "#22C55E";
                textColor = "#166534";
              } else if (isSelected) {
                bg = "#FEE2E2";
                border = "#EF4444";
                textColor = "#991B1B";
              }
            } else if (isSelected) {
              bg = colors.primary;
              border = colors.primary;
              textColor = colors.primaryForeground;
            }

            return (
              <Pressable
                key={`${option}-${index}`}
                onPress={() => onSelectOption(index)}
                disabled={answered || submitting}
                style={{
                  backgroundColor: bg,
                  borderColor: border,
                  borderWidth: 1,
                  borderRadius: 16,
                  padding: 15,
                }}
              >
                <Text
                  style={{
                    color: textColor,
                    fontSize: 15,
                    fontWeight: "800",
                    lineHeight: 21,
                  }}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <View style={{ gap: 12 }}>
          <Text style={{ color: colors.mutedText }}>
            {t("review.question.basicCardDescription")}
          </Text>

          <Pressable
            onPress={onShowBasicAnswer}
            disabled={answered}
            style={{
              backgroundColor: colors.primary,
              paddingVertical: 14,
              borderRadius: 14,
              alignItems: "center",
              opacity: answered ? 0.6 : 1,
            }}
          >
            <Text
              style={{
                color: colors.primaryForeground,
                fontWeight: "900",
              }}
            >
              {t("review.question.showAnswer")}
            </Text>
          </Pressable>

          {answered ? (
            <Text
              style={{
                color: colors.text,
                fontSize: 17,
                fontWeight: "800",
              }}
            >
              {card.answer}
            </Text>
          ) : null}
        </View>
      )}
    </View>
  );
}