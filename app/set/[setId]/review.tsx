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
import { useAppTheme } from "@/src/theme/useTheme";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text } from "react-native";

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

  const goNext = () => {
    resetCardState();

    if (currentIndex + 1 >= cards.length) {
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
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background ,paddingTop:40}}
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 120,
        gap: 16,
      }}
    >
      <ReviewProgress currentIndex={currentIndex} totalCards={cards.length} />

      <ReviewQuestionCard
        card={currentCard}
        selectedIndex={selectedIndex}
        answered={answered}
        submitting={submitting}
        isMcq={!!isMcq}
        onSelectOption={handleSelectOption}
        onShowBasicAnswer={handleShowBasicAnswer}
      />

      {answered ? (
        <ReviewFeedbackCard
          card={currentCard}
          isCorrect={!!isCorrect}
          isMcq={!!isMcq}
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
              {submitting ? "Kaydediliyor..." : "Biliyordum"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => submitResult("forgot")}
            disabled={submitting}
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
              paddingVertical: 16,
              borderRadius: 16,
              alignItems: "center",
              opacity: submitting ? 0.6 : 1,
            }}
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
  );
}