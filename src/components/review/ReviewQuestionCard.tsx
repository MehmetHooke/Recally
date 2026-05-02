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

function alpha(hex: string, opacity: number) {
  if (!hex.startsWith("#")) return hex;

  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);

  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r},${g},${b},${opacity})`;
}

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
        borderColor: colors.softBorder,
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
          letterSpacing: -0.3,
        }}
      >
        {card.question}
      </Text>

      {isMcq ? (
        <View style={{ gap: 11 }}>
          {card.options!.map((option, index) => {
            const isSelected = selectedIndex === index;
            const optionIsCorrect = card.correctIndex === index;

            let bg = colors.elevatedCard;
            let border = colors.border;
            let optionTextColor = colors.text;

            let badgeBg = colors.card;
            let badgeBorder = colors.border;
            let badgeTextColor = colors.mutedText;

            if (answered) {
              if (optionIsCorrect) {
                bg = alpha(colors.success, 0.13);
                border = colors.success;
                optionTextColor = colors.text;

                badgeBg = colors.success;
                badgeBorder = colors.success;
                badgeTextColor = colors.primaryForeground;
              } else if (isSelected) {
                bg = alpha(colors.danger, 0.13);
                border = colors.danger;
                optionTextColor = colors.text;

                badgeBg = colors.danger;
                badgeBorder = colors.danger;
                badgeTextColor = colors.primaryForeground;
              } else {
                bg = colors.elevatedCard;
                border = colors.border;
                optionTextColor = colors.mutedText;

                badgeBg = colors.card;
                badgeBorder = colors.border;
                badgeTextColor = colors.subtleText;
              }
            } else if (isSelected) {
              bg = colors.primarySoft;
              border = colors.primary;
              optionTextColor = colors.text;

              badgeBg = colors.primary;
              badgeBorder = colors.primary;
              badgeTextColor = colors.primaryForeground;
            }

            return (
              <Pressable
                key={`${option}-${index}`}
                onPress={() => onSelectOption(index)}
                disabled={answered || submitting}
                style={({ pressed }) => ({
                  width: "100%",
                  backgroundColor: bg,
                  borderColor: border,
                  borderWidth: isSelected || optionIsCorrect ? 1.5 : 1,
                  borderRadius: 18,
                  paddingVertical: 14,
                  paddingHorizontal: 14,
                  opacity: pressed && !answered ? 0.88 : 1,
                  transform: [{ scale: pressed && !answered ? 0.99 : 1 }],
                })}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 999,
                      backgroundColor: badgeBg,
                      borderColor: badgeBorder,
                      borderWidth: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: badgeTextColor,
                        fontSize: 13,
                        fontWeight: "900",
                      }}
                    >
                      {String.fromCharCode(65 + index)}
                    </Text>
                  </View>

                  <Text
                    style={{
                      color: optionTextColor,
                      fontSize: 15,
                      fontWeight: "800",
                      lineHeight: 21,
                      flex: 1,
                    }}
                  >
                    {option}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      ) : (
        <View style={{ gap: 12 }}>
          <Text style={{ color: colors.mutedText, lineHeight: 21 }}>
            {t("review.question.basicCardDescription")}
          </Text>

          <Pressable
            onPress={onShowBasicAnswer}
            disabled={answered}
            style={({ pressed }) => ({
              backgroundColor: colors.primary,
              paddingVertical: 14,
              borderRadius: 14,
              alignItems: "center",
              opacity: answered ? 0.6 : pressed ? 0.88 : 1,
              transform: [{ scale: pressed && !answered ? 0.99 : 1 }],
            })}
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
            <View
              style={{
                backgroundColor: colors.elevatedCard,
                borderColor: colors.softBorder,
                borderWidth: 1,
                borderRadius: 16,
                padding: 15,
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  fontSize: 17,
                  fontWeight: "800",
                  lineHeight: 24,
                }}
              >
                {card.answer}
              </Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}