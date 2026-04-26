import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { register } from "../../src/services/auth";
import { useAppTheme } from "../../src/theme/useTheme";

export default function RegisterScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation("auth");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async () => {
    if (!email.trim() || !password.trim() || !passwordAgain.trim()) {
      setErrorMessage(t("register.errors.requiredFields"));
      return;
    }

    if (password !== passwordAgain) {
      setErrorMessage(t("register.errors.passwordsDoNotMatch"));
      return;
    }

    if (password.length < 6) {
      setErrorMessage(t("register.errors.passwordTooShort"));
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      await register(email.trim(), password);
      router.replace("/(tabs)");
    } catch (error) {
      console.log("Register error:", error);
      setErrorMessage(t("register.errors.createFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          padding: 24,
          gap: 22,
        }}
      >
        <View style={{ gap: 8 }}>
          <Text
            style={{
              color: colors.primary,
              fontSize: 16,
              fontWeight: "900",
            }}
          >
            Recallly
          </Text>

          <Text
            style={{
              color: colors.text,
              fontSize: 34,
              fontWeight: "900",
              lineHeight: 40,
            }}
          >
            {t("register.heroTitle")}
          </Text>

          <Text
            style={{
              color: colors.mutedText,
              fontSize: 15,
              lineHeight: 22,
            }}
          >
            {t("register.heroSubtitle")}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 24,
            padding: 18,
            gap: 14,
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: 22,
              fontWeight: "900",
            }}
          >
            {t("register.title")}
          </Text>

          <TextInput
            placeholder={t("register.emailPlaceholder")}
            placeholderTextColor={colors.mutedText}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 16,
              padding: 15,
              color: colors.text,
              fontSize: 15,
              fontWeight: "600",
            }}
          />

          <TextInput
            placeholder={t("register.passwordPlaceholder")}
            placeholderTextColor={colors.mutedText}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{
              backgroundColor: colors.background,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 16,
              padding: 15,
              color: colors.text,
              fontSize: 15,
              fontWeight: "600",
            }}
          />

          <TextInput
            placeholder={t("register.passwordAgainPlaceholder")}
            placeholderTextColor={colors.mutedText}
            value={passwordAgain}
            onChangeText={setPasswordAgain}
            secureTextEntry
            style={{
              backgroundColor: colors.background,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 16,
              padding: 15,
              color: colors.text,
              fontSize: 15,
              fontWeight: "600",
            }}
          />

          {errorMessage ? (
            <Text
              style={{
                color: "#EF4444",
                fontSize: 13,
                fontWeight: "700",
              }}
            >
              {errorMessage}
            </Text>
          ) : null}

          <Pressable
            onPress={handleRegister}
            disabled={loading}
            style={{
              backgroundColor: colors.primary,
              paddingVertical: 15,
              borderRadius: 16,
              alignItems: "center",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <Text
                style={{
                  color: colors.primaryForeground,
                  fontWeight: "900",
                  fontSize: 15,
                }}
              >
                {t("register.submit")}
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => router.push("/(auth)/login")}
            style={{
              paddingVertical: 12,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: colors.mutedText,
                fontWeight: "700",
              }}
            >
              {t("register.hasAccount")}{" "}
              <Text style={{ color: colors.primary, fontWeight: "900" }}>
                {t("register.login")}
              </Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}