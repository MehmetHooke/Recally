import { useAppTheme } from "@/src/theme/useTheme";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export function ReviewEmptyState() {
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        gap: 12,
      }}
    >
      <Text style={{ color: colors.text, fontSize: 20, fontWeight: "900" }}>
        Şu an tekrar bekleyen kart yok.
      </Text>

      <Pressable
        onPress={() => router.replace("/(tabs)")}
        style={{
          backgroundColor: colors.primary,
          paddingVertical: 14,
          paddingHorizontal: 18,
          borderRadius: 14,
        }}
      >
        <Text style={{ color: colors.primaryForeground, fontWeight: "900" }}>
          Ana sayfaya dön
        </Text>
      </Pressable>
    </View>
  );
}