import { useAppTheme } from "@/src/theme/useTheme";
import { Pressable, Text, View } from "react-native";

type Props = {
  onCreatePress: () => void;
};

export function LibraryEmptyState({ onCreatePress }: Props) {
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        marginTop: 24,
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 18,
        padding: 20,
        gap: 12,
      }}
    >
      <Text style={{ color: colors.text, fontSize: 18, fontWeight: "900" }}>
        Henüz burada bir şey yok
      </Text>

      <Text style={{ color: colors.mutedText, fontSize: 15, lineHeight: 21 }}>
        YouTube linki ekle, Recallly onu saniyeler içinde özet ve soru
        kartlarına çevirsin.
      </Text>

      <Pressable
        onPress={onCreatePress}
        style={{
          backgroundColor: colors.primary,
          paddingVertical: 14,
          borderRadius: 14,
          alignItems: "center",
          marginTop: 4,
        }}
      >
        <Text style={{ color: colors.primaryForeground, fontWeight: "900" }}>
          İlk videonu teste çevir
        </Text>
      </Pressable>
    </View>
  );
}