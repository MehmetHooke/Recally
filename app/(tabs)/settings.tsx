import { logout } from "@/src/services/auth";
import { useAppTheme } from "@/src/theme/useTheme";
import { useRouter } from "expo-router";
import { Pressable, Switch, Text, View } from "react-native";

export default function SettingsScreen() {
  const { colors, mode, toggleTheme } = useAppTheme();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/(auth)/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
        gap: 20,
      }}
    >
      {/* Header */}
      <Text
        style={{
          fontSize: 28,
          fontWeight: "800",
          color: colors.text,
        }}
      >
        Settings
      </Text>

      {/* Theme */}
      <View
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 16,
          padding: 16,
        }}
      >
        <Text
          style={{
            color: colors.text,
            fontWeight: "700",
            marginBottom: 10,
          }}
        >
          Theme
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ color: colors.text }}>
            {mode === "light" ? "Light Mode" : "Dark Mode"}
          </Text>

          <Switch
            value={mode === "dark"}
            onValueChange={toggleTheme}
          />
        </View>
      </View>

      {/* Notifications (placeholder) */}
      <View
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 16,
          padding: 16,
        }}
      >
        <Text
          style={{
            color: colors.text,
            fontWeight: "700",
            marginBottom: 10,
          }}
        >
          Notifications
        </Text>

        <Text style={{ color: colors.mutedText }}>
          Daily reminder yakında eklenecek.
        </Text>
      </View>

      {/* Premium (placeholder) */}
      <View
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 16,
          padding: 16,
        }}
      >
        <Text
          style={{
            color: colors.text,
            fontWeight: "700",
            marginBottom: 10,
          }}
        >
          Premium
        </Text>

        <Text style={{ color: colors.mutedText }}>
          Sınırsız set ve AI üretimi yakında.
        </Text>

        <Pressable
          style={{
            marginTop: 10,
            backgroundColor: colors.primary,
            padding: 12,
            borderRadius: 12,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: colors.primaryForeground,
              fontWeight: "700",
            }}
          >
            Upgrade (yakında)
          </Text>
        </Pressable>
      </View>

      {/* Logout */}
      <Pressable
        onPress={handleLogout}
        style={{
          marginTop: "auto",
          backgroundColor: colors.primary,
          padding: 14,
          borderRadius: 14,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: colors.primaryForeground,
            fontWeight: "800",
          }}
        >
          Çıkış Yap
        </Text>
      </Pressable>
    </View>
  );
}