import { useAppTheme } from "@/src/theme/useTheme";
import { Pressable, Text, View } from "react-native";


export default function HomeScreen() {
  const { colors, mode, toggleTheme } = useAppTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 24 }}>
      <Text style={{ color: colors.text, fontSize: 24 }}>Recallly</Text>
      <Text style={{ color: colors.mutedText, marginTop: 8 }}>
        Current theme: {mode}
      </Text>

      <Pressable
        onPress={toggleTheme}
        style={{
          marginTop: 20,
          backgroundColor: colors.primary,
          padding: 14,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: colors.primaryForeground }}>Toggle Theme</Text>
      </Pressable>
    </View>
  );
}