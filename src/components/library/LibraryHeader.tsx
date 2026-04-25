import { useAppTheme } from "@/src/theme/useTheme";
import { Text, View } from "react-native";

export function LibraryHeader() {
  const { colors } = useAppTheme();

  return (
    <View>
      <Text
        style={{
          fontSize: 28,
          fontWeight: "900",
          color: colors.text,
        }}
      >
        Library
      </Text>

      <Text
        style={{
          marginTop: 6,
          fontSize: 15,
          color: colors.mutedText,
          lineHeight: 21,
        }}
      >
        Burası sadece arşiv değil. Recallly kullandıkça öğrenme durumun burada
        şekillenir.
      </Text>
    </View>
  );
}