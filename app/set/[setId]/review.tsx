import {
  getDueCards,
  markCardForgot,
  markCardKnew,
  type ReviewCard,
} from "@/src/services/cards";
import { useAppTheme } from "@/src/theme/useTheme";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

type McqReviewCard = ReviewCard & {
  options?: string[];
  correctIndex?: number | null;
  wrongExplanations?: string[];
  cardType?: "basic" | "mcq";
};

export default function ReviewScreen() {
  const { setId } = useLocalSearchParams<{ setId: string }>();
  const { colors } = useAppTheme();

  const [cards, setCards] = useState<McqReviewCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const [stats, setStats] = useState({
    knew: 0,
    forgot: 0,
  });

  useEffect(() => {
    if (!setId || typeof setId !== "string") return;

    const loadCards = async () => {
      try {
        setLoading(true);
        const dueCards = await getDueCards(setId);
        setCards(dueCards as McqReviewCard[]);
      } catch (error) {
        console.error("LOAD DUE CARDS ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCards();
  }, [setId]);

  const currentCard = useMemo(() => {
    return cards[currentIndex] ?? null;
  }, [cards, currentIndex]);

  const isMcq =
    currentCard &&
    Array.isArray(currentCard.options) &&
    currentCard.options.length === 4 &&
    typeof currentCard.correctIndex === "number";

  const isCorrect =
    isMcq && selectedIndex !== null
      ? selectedIndex === currentCard.correctIndex
      : false;

  const feedbackText = useMemo(() => {
    if (!currentCard || !answered) return "";

    if (!isMcq) {
      return currentCard.explanation;
    }

    if (isCorrect) {
      return currentCard.explanation;
    }

    if (selectedIndex === null) return "";

    return (
      currentCard.wrongExplanations?.[selectedIndex] ||
      "Bu seçenek doğru cevabı tam olarak karşılamıyor."
    );
  }, [currentCard, answered, isMcq, isCorrect, selectedIndex]);

  const resetCardState = () => {
    setSelectedIndex(null);
    setAnswered(false);
  };

  const goNext = () => {
    resetCardState();

    if (currentIndex + 1 >= cards.length) {
      setDone(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const submitResult = async () => {
    if (!setId || typeof setId !== "string" || !currentCard || submitting) {
      return;
    }

    try {
      setSubmitting(true);

      if (isCorrect) {
        await markCardKnew(setId, currentCard);
        setStats((prev) => ({ ...prev, knew: prev.knew + 1 }));
      } else {
        await markCardForgot(setId, currentCard);
        setStats((prev) => ({ ...prev, forgot: prev.forgot + 1 }));
      }

      goNext();
    } catch (error) {
      console.error("SUBMIT REVIEW ERROR:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectOption = (index: number) => {
    if (answered || submitting) return;

    setSelectedIndex(index);
    setAnswered(true);
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color={colors.primary} />
        <Text style={{ marginTop: 12, color: colors.mutedText }}>
          Review yükleniyor...
        </Text>
      </View>
    );
  }

  if (!cards.length) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
          gap: 12,
        }}
      >
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: "900" }}>
          Şu an tekrar bekleyen kart yok.
        </Text>

        <Pressable
          onPress={() => router.replace("/(tabs)")}
          style={{
            backgroundColor: colors.primary,
            paddingVertical: 14,
            paddingHorizontal: 18,
            borderRadius: 14,
          }}
        >
          <Text style={{ color: colors.primaryForeground, fontWeight: "900" }}>
            Ana sayfaya dön
          </Text>
        </Pressable>
      </View>
    );
  }

  if (done) {
    const accuracy = Math.round((stats.knew / cards.length) * 100);

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          padding: 24,
          gap: 16,
        }}
      >
        <Text style={{ color: colors.text, fontSize: 30, fontWeight: "900" }}>
          Tüm soruları çözdün!
        </Text>

        <Text style={{ color: colors.mutedText, fontSize: 16 }}>
          Başarın
        </Text>

        <View
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 22,
            padding: 18,
            gap: 12,
          }}
        >
          <Text style={{ color: colors.text, fontSize: 42, fontWeight: "900" }}>
            %{accuracy}
          </Text>

          <Text style={{ color: colors.mutedText }}>
            {cards.length} kart çözdün · {stats.knew} doğru · {stats.forgot} yanlış
          </Text>
        </View>

        <Pressable
          onPress={() => router.replace("/(tabs)")}
          style={{
            backgroundColor: colors.primary,
            paddingVertical: 15,
            borderRadius: 15,
            alignItems: "center",
          }}
        >
          <Text style={{ color: colors.primaryForeground, fontWeight: "900" }}>
            Ana sayfaya dön
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace("/(tabs)/library")}
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: 1,
            paddingVertical: 15,
            borderRadius: 15,
            alignItems: "center",
          }}
        >
          <Text style={{ color: colors.text, fontWeight: "900" }}>
            Library’ye git
          </Text>
        </Pressable>
      </View>
    );
  }

  if (!currentCard) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <Text style={{ color: colors.text }}>Card not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 120,
        gap: 16,
      }}
    >
      <View>
        <Text style={{ color: colors.mutedText, fontWeight: "800" }}>
          Card {currentIndex + 1} / {cards.length}
        </Text>

        <View
          style={{
            marginTop: 10,
            height: 9,
            backgroundColor: colors.border,
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: `${((currentIndex + 1) / cards.length) * 100}%`,
              height: "100%",
              backgroundColor: colors.primary,
            }}
          />
        </View>
      </View>

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
          {currentCard.question}
        </Text>

        {isMcq ? (
          <View style={{ gap: 10 }}>
            {currentCard.options!.map((option, index) => {
              const isSelected = selectedIndex === index;
              const optionIsCorrect = currentCard.correctIndex === index;

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
                  onPress={() => handleSelectOption(index)}
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
              Bu eski formatta bir kart. Cevabı kontrol edip devam edebilirsin.
            </Text>

            <Pressable
              onPress={() => {
                setSelectedIndex(0);
                setAnswered(true);
              }}
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
                Cevabı göster
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
                {currentCard.answer}
              </Text>
            ) : null}
          </View>
        )}
      </View>

      {answered && (
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
              Doğru cevap: {currentCard.options?.[currentCard.correctIndex ?? 0]}
            </Text>
          ) : null}
        </View>
      )}

      {answered && (
        <Pressable
          onPress={submitResult}
          disabled={submitting}
          style={{
            backgroundColor: colors.primary,
            paddingVertical: 16,
            borderRadius: 16,
            alignItems: "center",
            opacity: submitting ? 0.6 : 1,
          }}
        >
          <Text
            style={{
              color: colors.primaryForeground,
              fontWeight: "900",
              fontSize: 15,
            }}
          >
            {submitting ? "Kaydediliyor..." : "Devam et"}
          </Text>
        </Pressable>
      )}
    </ScrollView>
  );
}