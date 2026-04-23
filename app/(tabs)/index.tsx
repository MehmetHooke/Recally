import { getDueCards } from "@/src/services/cards";
import { generateCards } from "@/src/services/functions";
import { saveGeneratedSet } from "@/src/services/sets";
import { router } from "expo-router";
import { useState } from "react";
import { Button, Text, View } from "react-native";

export default function HomeScreen() {
  const [lastSetId, setLastSetId] = useState<string | null>(null);

  const handleGenerate = async () => {
    try {
      const sourceText = "React Native ile Firebase Functions kullanımı";
      const title = "React Native Notes";

      const data = await generateCards(sourceText, title);

      const setId = await saveGeneratedSet({
        title: data.title,
        sourceText,
        summary: data.summary,
        keyConcepts: data.keyConcepts,
        cards: data.cards,
      });

      setLastSetId(setId);

      console.log("SET SAVED:", setId);

      // İstersen bunu aç:
      // router.push(`/set/${setId}/review`);
    } catch (error) {
      console.error("GENERATE+SAVE ERROR:", error);
    }
  };

  const handleGetDueCards = async () => {
    try {
      if (!lastSetId) {
        console.log("Önce set oluşturman lazım");
        return;
      }

      console.log("TEST SET ID:", lastSetId);

      const cards = await getDueCards(lastSetId);
      console.log("DUE CARDS:", cards);
    } catch (error) {
      console.error("GET DUE CARDS ERROR:", error);
    }
  };

  const handleGoReview = () => {
    if (!lastSetId) {
      console.log("Önce set oluşturman lazım");
      return;
    }

    router.push(`/set/${lastSetId}/review`);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 12 }}>
      <Text>Generate + Save Test</Text>
      <Text>Last Set ID: {lastSetId ?? "-"}</Text>

      <Button title="Generate and Save" onPress={handleGenerate} />
      <Button title="Due Card Test" onPress={handleGetDueCards} />
      <Button title="Go Review" onPress={handleGoReview} />
    </View>
  );
}