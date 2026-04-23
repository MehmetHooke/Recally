import {
    getDueCards,
    markCardForgot,
    markCardKnew,
    type ReviewCard,
} from "@/src/services/cards";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Button, Text, View } from "react-native";

export default function ReviewScreen() {
  const { setId } = useLocalSearchParams<{ setId: string }>();

  const [cards, setCards] = useState<ReviewCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
        setCards(dueCards);
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

  const goNext = () => {
    setShowAnswer(false);

    if (currentIndex + 1 >= cards.length) {
      setDone(true);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
  };

  const handleKnew = async () => {
    if (!setId || typeof setId !== "string" || !currentCard || submitting) {
      return;
    }

    try {
      setSubmitting(true);
      await markCardKnew(setId, currentCard);
      setStats((prev) => ({ ...prev, knew: prev.knew + 1 }));
      goNext();
    } catch (error) {
      console.error("MARK KNEW ERROR:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgot = async () => {
    if (!setId || typeof setId !== "string" || !currentCard || submitting) {
      return;
    }

    try {
      setSubmitting(true);
      await markCardForgot(setId, currentCard);
      setStats((prev) => ({ ...prev, forgot: prev.forgot + 1 }));
      goNext();
    } catch (error) {
      console.error("MARK FORGOT ERROR:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
        <Text>Loading review...</Text>
      </View>
    );
  }

  if (!cards.length) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24, gap: 12 }}>
        <Text>No cards due right now.</Text>
        <Button title="Go Home" onPress={() => router.replace("/(tabs)")} />
      </View>
    );
  }

  if (done) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24, gap: 12 }}>
        <Text style={{ fontSize: 22, fontWeight: "700" }}>Review Complete</Text>
        <Text>Reviewed: {cards.length}</Text>
        <Text>Remembered: {stats.knew}</Text>
        <Text>Forgot: {stats.forgot}</Text>
        <Button title="Back Home" onPress={() => router.replace("/(tabs)")} />
      </View>
    );
  }

  if (!currentCard) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
        <Text>Card not found.</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        padding: 24,
        justifyContent: "center",
        gap: 16,
      }}
    >
      <Text style={{ fontSize: 16, opacity: 0.7 }}>
        Card {currentIndex + 1} / {cards.length}
      </Text>

      <View
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 16,
          padding: 20,
          gap: 14,
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: "700" }}>
          {currentCard.question}
        </Text>

        {!showAnswer ? (
          <Button title="Show Answer" onPress={() => setShowAnswer(true)} />
        ) : (
          <View style={{ gap: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: "600" }}>
              {currentCard.answer}
            </Text>

            <Text style={{ fontSize: 15, lineHeight: 22 }}>
              {currentCard.explanation}
            </Text>
          </View>
        )}
      </View>

      {showAnswer && (
        <View style={{ gap: 12 }}>
          <Button
            title={submitting ? "Saving..." : "I knew it"}
            onPress={handleKnew}
            disabled={submitting}
          />
          <Button
            title={submitting ? "Saving..." : "I forgot"}
            onPress={handleForgot}
            disabled={submitting}
          />
        </View>
      )}
    </View>
  );
}