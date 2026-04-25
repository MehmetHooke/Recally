import { createYoutubeSetJob } from "@/src/services/functions";
import { useAppTheme } from "@/src/theme/useTheme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";

export default function AddContentScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);

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

      const result = await createYoutubeSetJob(trimmedUrl);

      if (!result.ok || !result.setId) {
        throw new Error("Set oluşturulamadı.");
      }

      router.push(`/set/${result.setId}`);
    } catch (error) {
      console.error("YouTube create job error:", error);

      Alert.alert(
        "Hata",
        error instanceof Error
          ? error.message
          : "Video işlenirken bir hata oluştu."
      );
    } finally {
      setLoading(false);
    }
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
          Linki yapıştır. Recallly videoyu öğrenilebilir özet, ana kavramlar ve
          quiz kartlarına dönüştürsün.
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
              {loading ? "Set hazırlanıyor..." : "Videoyu öğrenme setine çevir"}
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
    </ScrollView>
  );
}
