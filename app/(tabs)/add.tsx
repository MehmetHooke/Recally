import { generateCards } from "@/src/services/functions";
import { saveGeneratedSet } from "@/src/services/sets";
import { useAppTheme } from "@/src/theme/useTheme";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

type FlowStep =
  | "choose_source"
  | "input_content"
  | "choose_output"
  | "processing"
  | "result";

type SourceType = "text" | "pdf" | "youtube";
type OutputType = "flashcard" | "summary";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

export default function AddContentScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  const [step, setStep] = useState<FlowStep>("choose_source");
  const [sourceType, setSourceType] = useState<SourceType | null>(null);
  const [outputType, setOutputType] = useState<OutputType | null>(null);

  const [title, setTitle] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [loading, setLoading] = useState(false);

  const messages = useMemo<ChatMessage[]>(() => {
    const list: ChatMessage[] = [
      {
        id: "welcome",
        role: "assistant",
        text: "Hoş geldin. Bugün neyi öğrenilebilir hale getirelim?",
      },
    ];

    if (sourceType) {
      list.push({
        id: "source-user",
        role: "user",
        text:
          sourceType === "text"
            ? "Metin ile devam etmek istiyorum."
            : sourceType === "pdf"
              ? "PDF yüklemek istiyorum."
              : "YouTube linki ile devam etmek istiyorum.",
      });
    }

    if (step === "input_content") {
      list.push({
        id: "input-assistant",
        role: "assistant",
        text: "Harika. Konu başlığını ve çalışmak istediğin metni ekle.",
      });
    }

    if (title && sourceText && step !== "input_content") {
      list.push({
        id: "content-user",
        role: "user",
        text: `"${title}" içeriğini ekledim.`,
      });
    }

    if (step === "choose_output") {
      list.push({
        id: "output-assistant",
        role: "assistant",
        text: "Bu içerikten ne oluşturmak istiyorsun?",
      });
    }

    if (outputType) {
      list.push({
        id: "output-user",
        role: "user",
        text:
          outputType === "flashcard"
            ? "Soru kartları üret."
            : "Özet oluştur.",
      });
    }

    if (step === "processing") {
      list.push({
        id: "processing",
        role: "assistant",
        text: "İçeriği analiz ediyorum, önemli kavramları çıkarıyorum ve kartları hazırlıyorum...",
      });
    }

    if (step === "result") {
      list.push({
        id: "result",
        role: "assistant",
        text: "Set oluşturuldu. İstersen kütüphaneden review akışına başlayabilirsin.",
      });
    }

    return list;
  }, [sourceType, step, title, sourceText, outputType]);

  const resetFlow = () => {
    setStep("choose_source");
    setSourceType(null);
    setOutputType(null);
    setTitle("");
    setSourceText("");
    setLoading(false);
  };

  const handleSourceSelect = (type: SourceType) => {
    if (type !== "text") {
      Alert.alert(
        "Yakında",
        "İlk sürümde sadece metin ile ilerliyoruz. PDF ve YouTube sonra eklenecek."
      );
      return;
    }

    setSourceType(type);
    setStep("input_content");
  };

  const handleContentSubmit = () => {
    if (!title.trim()) {
      Alert.alert("Hata", "Lütfen bir başlık gir.");
      return;
    }

    if (!sourceText.trim()) {
      Alert.alert("Hata", "Lütfen içerik metni gir.");
      return;
    }

    setStep("choose_output");
  };

  const handleOutputSelect = async (type: OutputType) => {
    if (type === "summary") {
      Alert.alert(
        "Yakında",
        "Bugün ana hedefimiz flashcard üretme akışı. Özet modu sonra eklenecek."
      );
      return;
    }

    setOutputType(type);
    setStep("processing");
    setLoading(true);

    try {
      const data = await generateCards(sourceText, title);

      const setId = await saveGeneratedSet({
        title: data.title,
        sourceText,
        summary: data.summary,
        keyConcepts: data.keyConcepts,
        cards: data.cards,
      });

      console.log("Yeni gerçek set oluşturuldu:", setId);

      setStep("result");
    } catch (error) {
      console.error("Create set error:", error);
      Alert.alert(
        "Hata",
        error instanceof Error ? error.message : "Bir hata oluştu"
      );
      setStep("choose_output");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          gap: 14,
          paddingBottom: 120,
        }}
      >
        <Text
          style={{
            fontSize: 26,
            fontWeight: "800",
            color: colors.text,
            marginBottom: 8,
          }}
        >
          Create
        </Text>

        {messages.map((message) => {
          const isUser = message.role === "user";

          return (
            <View
              key={message.id}
              style={{
                alignSelf: isUser ? "flex-end" : "flex-start",
                maxWidth: "86%",
                backgroundColor: isUser ? colors.primary : colors.card,
                borderColor: colors.border,
                borderWidth: isUser ? 0 : 1,
                borderRadius: 18,
                padding: 14,
              }}
            >
              <Text
                style={{
                  color: isUser ? colors.primaryForeground : colors.text,
                  fontSize: 15,
                  lineHeight: 21,
                }}
              >
                {message.text}
              </Text>
            </View>
          );
        })}

        {step === "choose_source" && (
          <View style={{ gap: 10, marginTop: 8 }}>
            <ActionButton label="Metin ekle" onPress={() => handleSourceSelect("text")} />
            <ActionButton label="PDF yükle" onPress={() => handleSourceSelect("pdf")} />
            <ActionButton label="YouTube linki" onPress={() => handleSourceSelect("youtube")} />
          </View>
        )}

        {step === "input_content" && (
          <View
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 18,
              padding: 14,
              gap: 12,
            }}
          >
            <View>
              <Text style={{ color: colors.text, marginBottom: 8, fontWeight: "700" }}>
                Başlık
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Örn: React Hooks Notes"
                placeholderTextColor={colors.mutedText}
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  padding: 12,
                  color: colors.text,
                }}
              />
            </View>

            <View>
              <Text style={{ color: colors.text, marginBottom: 8, fontWeight: "700" }}>
                İçerik
              </Text>
              <TextInput
                value={sourceText}
                onChangeText={setSourceText}
                placeholder="İçeriği buraya yapıştır..."
                placeholderTextColor={colors.mutedText}
                multiline
                textAlignVertical="top"
                style={{
                  minHeight: 220,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: 12,
                  padding: 12,
                  color: colors.text,
                }}
              />
            </View>

            <ActionButton label="Devam et" onPress={handleContentSubmit} />
          </View>
        )}

        {step === "choose_output" && (
          <View style={{ gap: 10, marginTop: 8 }}>
            <ActionButton
              label="Flashcard üret"
              onPress={() => handleOutputSelect("flashcard")}
            />
            <ActionButton
              label="Özet oluştur"
              onPress={() => handleOutputSelect("summary")}
            />
          </View>
        )}

        {step === "processing" && (
          <View style={{ alignItems: "center", padding: 20, gap: 12 }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ color: colors.mutedText }}>
              Bu birkaç saniye sürebilir...
            </Text>
          </View>
        )}

        {step === "result" && (
          <View style={{ gap: 10, marginTop: 8 }}>
            <ActionButton
              label="Kütüphaneye git"
              onPress={() => router.push("/(tabs)/library")}
            />
            <SecondaryButton label="Yeni içerik ekle" onPress={resetFlow} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function ActionButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: colors.primary,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 14,
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: colors.primaryForeground,
          fontWeight: "800",
          fontSize: 15,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function SecondaryButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 1,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 14,
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: colors.text,
          fontWeight: "800",
          fontSize: 15,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}