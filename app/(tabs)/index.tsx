import { generateCards } from "@/src/services/functions";
import { saveGeneratedSet } from "@/src/services/sets";
import { Button, Text, View } from "react-native";

export default function HomeScreen() {
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

      console.log("SET SAVED:", setId);
    } catch (error) {
      console.error("GENERATE+SAVE ERROR:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Generate + Save Test</Text>
      <Button title="Generate and Save" onPress={handleGenerate} />
      <Text>Bu alandan devam edilecek, bir sonraki adım, backend kısmını tamamlayıp ui a dönmek</Text>
    </View>
  );
}