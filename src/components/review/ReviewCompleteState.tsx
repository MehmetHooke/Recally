import { useAppTheme } from "@/src/theme/useTheme";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

type Props = {
  totalCards: number;
  knew: number;
  forgot: number;
};

export function ReviewCompleteState({ totalCards, knew, forgot }: Props) {
  const { colors } = useAppTheme();
  const accuracy = totalCards > 0 ? Math.round((knew / totalCards) * 100) : 0;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        padding: 24,
        gap: 16,
      }}
    >
      <Text style={{ color: colors.text, fontSize: 30, fontWeight: "900" }}>
        Tüm soruları çözdün!
      </Text>

      <Text style={{ color: colors.mutedText, fontSize: 16 }}>Başarın</Text>

      <View
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 22,
          padding: 18,
          gap: 12,
        }}
      >
        <Text style={{ color: colors.text, fontSize: 42, fontWeight: "900" }}>
          %{accuracy}
        </Text>

        <Text style={{ color: colors.mutedText }}>
          {totalCards} kart çözdün · {knew} doğru · {forgot} yanlış
        </Text>
      </View>

      <Pressable
        onPress={() => router.replace("/(tabs)")}
        style={{
          backgroundColor: colors.primary,
          paddingVertical: 15,
          borderRadius: 15,
          alignItems: "center",
        }}
      >
        <Text style={{ color: colors.primaryForeground, fontWeight: "900" }}>
          Ana sayfaya dön
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.replace("/(tabs)/library")}
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
          paddingVertical: 15,
          borderRadius: 15,
          alignItems: "center",
        }}
      >
        <Text style={{ color: colors.text, fontWeight: "900" }}>
          Library’ye git
        </Text>
      </Pressable>
    </View>
  );
}