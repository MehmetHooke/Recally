import { generateCardsYoutube } from "@/src/services/functions";
import { saveGeneratedSet } from "@/src/services/sets";
import { useAppTheme } from "@/src/theme/useTheme";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

type FlowStep = "input_youtube" | "processing" | "result";

const processingMessages = [
  "Videoyu analiz ediyorum...",
  "Konuşma içeriğini anlamlandırıyorum...",
  "Önemli kavramları çıkarıyorum...",
  "Soru kartları hazırlanıyor...",
  "Neredeyse hazır...",
];

export default function AddContentScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  const [step, setStep] = useState<FlowStep>("input_youtube");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdSetId, setCreatedSetId] = useState<string | null>(null);
  const [processingIndex, setProcessingIndex] = useState(0);

  useEffect(() => {
    if (step !== "processing") return;

    setProcessingIndex(0);

    const interval = setInterval(() => {
      setProcessingIndex((prev) => {
        if (prev >= processingMessages.length - 1) return prev;
        return prev + 1;
      });
    }, 2200);

    return () => clearInterval(interval);
  }, [step]);

  const isValidYoutubeUrl = (url: string) => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  const handleGenerateFromYoutube = async () => {
    const trimmedUrl = youtubeUrl.trim();

    if (!trimmedUrl) {
      Alert.alert("Hata", "Lütfen bir YouTube linki gir.");
      return;
    }

    if (!isValidYoutubeUrl(trimmedUrl)) {
      Alert.alert("Hata", "Geçerli bir YouTube linki gir.");
      return;
    }

    try {
      setLoading(true);
      setStep("processing");

      const data = await generateCardsYoutube(trimmedUrl);

      const setId = await saveGeneratedSet({
        title: data.title || "YouTube Study Set",
        sourceType: "youtube",
        sourceText: trimmedUrl,
        summary: data.summary,
        keyConcepts: data.keyConcepts,
        cards: data.cards,
      });

      setCreatedSetId(setId);
      setStep("result");
    } catch (error) {
      console.error("YouTube create error:", error);

      Alert.alert(
        "Hata",
        error instanceof Error
          ? error.message
          : "Video işlenirken bir hata oluştu."
      );

      setStep("input_youtube");
    } finally {
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setStep("input_youtube");
    setYoutubeUrl("");
    setCreatedSetId(null);
    setProcessingIndex(0);
    setLoading(false);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 120,
        gap: 18,
      }}
    >
      <View>
        <Text
          style={{
            color: colors.text,
            fontSize: 30,
            fontWeight: "900",
          }}
        >
          Create
        </Text>

        <Text
          style={{
            color: colors.mutedText,
            marginTop: 6,
            fontSize: 15,
            lineHeight: 21,
          }}
        >
          Öğrendiğin içeriği saniyeler içinde özet ve soru kartlarına çevir.
        </Text>
      </View>

      {step === "input_youtube" && (
        <>
          <View
            style={{
              backgroundColor: colors.primary,
              borderRadius: 26,
              padding: 22,
              gap: 14,
            }}
          >
            <Text
              style={{
                color: colors.primaryForeground,
                fontSize: 25,
                fontWeight: "900",
                lineHeight: 31,
              }}
            >
              YouTube videosunu teste çevir
            </Text>

            <Text
              style={{
                color: colors.primaryForeground,
                opacity: 0.9,
                fontSize: 15,
                lineHeight: 22,
              }}
            >
              Linki yapıştır. Recallly videoyu analiz edip sana özet, ana
              kavramlar ve tekrar kartları hazırlasın.
            </Text>

            <View
              style={{
                backgroundColor: colors.card,
                borderRadius: 18,
                padding: 14,
                gap: 12,
              }}
            >
              <TextInput
                value={youtubeUrl}
                onChangeText={setYoutubeUrl}
                placeholder="https://youtube.com/watch?v=..."
                placeholderTextColor={colors.mutedText}
                autoCapitalize="none"
                autoCorrect={false}
                style={{
                  color: colors.text,
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: 14,
                  padding: 14,
                  fontSize: 15,
                }}
              />

              <Pressable
                onPress={handleGenerateFromYoutube}
                disabled={loading}
                style={{
                  backgroundColor: colors.primary,
                  paddingVertical: 15,
                  borderRadius: 15,
                  alignItems: "center",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                <Text
                  style={{
                    color: colors.primaryForeground,
                    fontWeight: "900",
                    fontSize: 15,
                  }}
                >
                  Videodan kart üret
                </Text>
              </Pressable>
            </View>
          </View>

          <View
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 20,
              padding: 16,
              gap: 10,
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 17,
                fontWeight: "900",
              }}
            >
              Diğer kaynaklar
            </Text>

            <Pressable
              onPress={() =>
                Alert.alert(
                  "Yakında",
                  "Metin modu önceki akışta çalışıyor. Ana deneyimi YouTube üzerine kuruyoruz."
                )
              }
              style={{
                backgroundColor: colors.background,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 14,
                padding: 14,
              }}
            >
              <Text style={{ color: colors.text, fontWeight: "800" }}>
                Metin yapıştır
              </Text>
            </Pressable>

            <Pressable
              onPress={() => Alert.alert("Yakında", "PDF desteği sonra eklenecek.")}
              style={{
                backgroundColor: colors.background,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 14,
                padding: 14,
              }}
            >
              <Text style={{ color: colors.mutedText, fontWeight: "800" }}>
                PDF yükle · yakında
              </Text>
            </Pressable>
          </View>
        </>
      )}

      {step === "processing" && (
        <View
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 24,
            padding: 22,
            gap: 18,
          }}
        >
          <ActivityIndicator size="large" color={colors.primary} />

          <View>
            <Text
              style={{
                color: colors.text,
                fontSize: 22,
                fontWeight: "900",
                textAlign: "center",
              }}
            >
              Video işleniyor
            </Text>

            <Text
              style={{
                color: colors.mutedText,
                marginTop: 8,
                textAlign: "center",
                lineHeight: 21,
              }}
            >
              {processingMessages[processingIndex]}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: colors.background,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 16,
              padding: 14,
              gap: 8,
            }}
          >
            <Text style={{ color: colors.text, fontWeight: "800" }}>
              Recallly şunları hazırlıyor:
            </Text>

            <Text style={{ color: colors.mutedText }}>• Kısa özet</Text>
            <Text style={{ color: colors.mutedText }}>• Ana kavramlar</Text>
            <Text style={{ color: colors.mutedText }}>• Soru kartları</Text>
          </View>
        </View>
      )}

      {step === "result" && (
        <View
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 24,
            padding: 22,
            gap: 14,
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: 25,
              fontWeight: "900",
            }}
          >
            Kartların hazır
          </Text>

          <Text
            style={{
              color: colors.mutedText,
              lineHeight: 21,
            }}
          >
            Video özetlendi ve tekrar kartların oluşturuldu. Şimdi çözmeye
            başlayarak bilgiyi kalıcı hale getirebilirsin.
          </Text>

          <Pressable
            onPress={() => {
              if (!createdSetId) return;
              router.push(`/set/${createdSetId}/review`);
            }}
            style={{
              backgroundColor: colors.primary,
              paddingVertical: 15,
              borderRadius: 15,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: colors.primaryForeground,
                fontWeight: "900",
              }}
            >
              Hemen çözmeye başla
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              if (!createdSetId) return;
              router.push(`/set/${createdSetId}`);
            }}
            style={{
              backgroundColor: colors.background,
              borderColor: colors.border,
              borderWidth: 1,
              paddingVertical: 15,
              borderRadius: 15,
              alignItems: "center",
            }}
          >
            <Text style={{ color: colors.text, fontWeight: "900" }}>
              Set detayını gör
            </Text>
          </Pressable>

          <Pressable
            onPress={resetFlow}
            style={{
              paddingVertical: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: colors.mutedText, fontWeight: "800" }}>
              Yeni video ekle
            </Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}