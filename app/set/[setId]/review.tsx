import { ReviewCompleteState } from "@/src/components/review/ReviewCompleteState";
import { ReviewEmptyState } from "@/src/components/review/ReviewEmptyState";
import { ReviewFeedbackCard } from "@/src/components/review/ReviewFeedbackCard";
import { ReviewLoadingState } from "@/src/components/review/ReviewLoadingState";
import { ReviewProgress } from "@/src/components/review/ReviewProgress";
import { ReviewQuestionCard } from "@/src/components/review/ReviewQuestionCard";
import type { McqReviewCard } from "@/src/components/review/types";
import {
  getDueCards,
  markCardForgot,
  markCardKnew,
} from "@/src/services/cards";
import { updateReviewStreak } from "@/src/services/streakService";
import { useAppTheme } from "@/src/theme/useTheme";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

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

  function alpha(hex: string, opacity: number) {
    if (!hex.startsWith("#")) return hex;

    const clean = hex.replace("#", "");
    const bigint = parseInt(clean, 16);

    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `rgba(${r},${g},${b},${opacity})`;
  }

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

  const isMcq = Boolean(
    currentCard &&
    Array.isArray(currentCard.options) &&
    currentCard.options.length === 4 &&
    typeof currentCard.correctIndex === "number"
  );

  const isCorrect =
    isMcq && currentCard && selectedIndex !== null
      ? selectedIndex === currentCard.correctIndex
      : false;

  const feedbackText = useMemo(() => {
    if (!currentCard || !answered) return "";

    if (!isMcq) return currentCard.explanation;
    if (isCorrect) return currentCard.explanation;
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

  const goNext = async () => {
    resetCardState();

    if (currentIndex + 1 >= cards.length) {
      await updateReviewStreak();
      setDone(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const submitResult = async (result: "knew" | "forgot") => {
    if (!setId || typeof setId !== "string" || !currentCard || submitting) {
      return;
    }

    try {
      setSubmitting(true);

      if (result === "knew") {
        await markCardKnew(setId, currentCard);
        setStats((prev) => ({ ...prev, knew: prev.knew + 1 }));
      } else {
        await markCardForgot(setId, currentCard);
        setStats((prev) => ({ ...prev, forgot: prev.forgot + 1 }));
      }

      await goNext();
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

  const handleShowBasicAnswer = () => {
    setSelectedIndex(0);
    setAnswered(true);
  };

  if (loading) return <ReviewLoadingState />;
  if (!cards.length) return <ReviewEmptyState />;

  if (done) {
    return (
      <ReviewCompleteState
        totalCards={cards.length}
        knew={stats.knew}
        forgot={stats.forgot}
      />
    );
  }

  if (!currentCard) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{ padding: 24 }}
      >
        <Text style={{ color: colors.text }}>Card not found.</Text>
      </ScrollView>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: -130,
          right: -100,
          width: 280,
          height: 280,
          borderRadius: 999,
          backgroundColor: alpha(colors.aiGlow, 0.11),
        }}
      />

      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          bottom: -150,
          left: -110,
          width: 300,
          height: 300,
          borderRadius: 999,
          backgroundColor: alpha(colors.primary, 0.08),
        }}
      />

      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 180,
          left: -120,
          width: 220,
          height: 220,
          borderRadius: 999,
          backgroundColor: alpha(colors.secondary, 0.06),
        }}
      />

      <ScrollView
        style={{
          flex: 1,
          paddingTop: 40,
        }}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 120,
          gap: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <ReviewProgress currentIndex={currentIndex} totalCards={cards.length} />

        <ReviewQuestionCard
          card={currentCard}
          selectedIndex={selectedIndex}
          answered={answered}
          submitting={submitting}
          isMcq={isMcq}
          onSelectOption={handleSelectOption}
          onShowBasicAnswer={handleShowBasicAnswer}
        />

        {answered ? (
          <ReviewFeedbackCard
            card={currentCard}
            isCorrect={isCorrect}
            isMcq={isMcq}
            feedbackText={feedbackText}
          />
        ) : null}
        {answered && isMcq ? (
          <Pressable
            onPress={() => submitResult(isCorrect ? "knew" : "forgot")}
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
        ) : null}

        {answered && !isMcq ? (
          <>
            <Pressable
              onPress={() => submitResult("knew")}
              disabled={submitting}
              style={({ pressed }) => ({
                backgroundColor: colors.primary,
                paddingVertical: 16,
                borderRadius: 16,
                alignItems: "center",
                opacity: submitting ? 0.6 : pressed ? 0.88 : 1,
                transform: [{ scale: pressed && !submitting ? 0.99 : 1 }],
              })}
            >
              <Text
                style={{
                  color: colors.primaryForeground,
                  fontWeight: "900",
                  fontSize: 15,
                }}
              >
                {submitting ? "Kaydediliyor..." : "Biliyordum"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => submitResult("forgot")}
              disabled={submitting}
              style={({ pressed }) => ({
                backgroundColor: colors.card,
                borderColor: colors.softBorder,
                borderWidth: 1,
                paddingVertical: 16,
                borderRadius: 16,
                alignItems: "center",
                opacity: submitting ? 0.6 : pressed ? 0.88 : 1,
                transform: [{ scale: pressed && !submitting ? 0.99 : 1 }],
              })}
            >
              <Text
                style={{
                  color: colors.text,
                  fontWeight: "900",
                  fontSize: 15,
                }}
              >
                Unuttum
              </Text>
            </Pressable>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}