import { generateCards } from "@/src/services/functions";
import { saveGeneratedSet } from "@/src/services/sets";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";

export default function AddContentScreen() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateSet = async () => {
    if (!title.trim()) {
      Alert.alert("Hata", "Lütfen bir başlık gir.");
      return;
    }

    if (!sourceText.trim()) {
      Alert.alert("Hata", "Lütfen içerik metni gir.");
      return;
    }

    try {
      setLoading(true);

      const data = await generateCards(sourceText, title);

      const setId = await saveGeneratedSet({
        title: data.title,
        sourceText,
        summary: data.summary,
        keyConcepts: data.keyConcepts,
        cards: data.cards,
      });

      console.log("Yeni gerçek set oluşturuldu:", setId);

      Alert.alert("Başarılı", "Set oluşturuldu.");

      setTitle("");
      setSourceText("");

      router.push("/(tabs)/library");
    } catch (error) {
      console.error("Create set error:", error);
      Alert.alert(
        "Hata",
        error instanceof Error ? error.message : "Bir hata oluştu"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, gap: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Add Content</Text>

      <View>
        <Text style={{ marginBottom: 8 }}>Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Örn: React Hooks Notes"
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            padding: 12,
          }}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ marginBottom: 8 }}>Text</Text>
        <TextInput
          value={sourceText}
          onChangeText={setSourceText}
          placeholder="İçeriği buraya yapıştır..."
          multiline
          textAlignVertical="top"
          style={{
            flex: 1,
            minHeight: 220,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            padding: 12,
          }}
        />
      </View>

      <Button
        title={loading ? "Creating..." : "Create Set"}
        onPress={handleCreateSet}
        disabled={loading}
      />
    </View>
  );
}