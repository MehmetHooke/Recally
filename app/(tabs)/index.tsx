import { generateCards } from "@/src/services/functions";
import { Button, Text, View } from "react-native";

export default function HomeScreen() {
  const handleGenerate = async () => {
    try {
      const data = await generateCards(
        "React Native ile Firebase Functions kullanımı",
        "React Native Notes"
      );
      console.log("GENERATE RESULT:", JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("GENERATE ERROR:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Generate Cards Test</Text>
      <Button title="Generate Cards" onPress={handleGenerate} />
    </View>
  );
}