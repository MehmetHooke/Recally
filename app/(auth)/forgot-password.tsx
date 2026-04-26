import { router } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import { sendResetPasswordEmail } from "../../src/services/passwordReset";
import { useAppTheme } from "../../src/theme/useTheme";

export default function ForgotPasswordScreen() {
  const { colors } = useAppTheme();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleResetPassword = async () => {
    if (!email.trim()) {
      setErrorMessage("Email adresini yazmalısın.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setErrorMessage("");

      await sendResetPasswordEmail(email);

      setMessage(
        "Eğer bu email ile kayıtlı bir hesap varsa, şifre sıfırlama bağlantısı gönderildi."
      );
    } catch (error) {
      console.log("Password reset error:", error);
      setErrorMessage("Şu anda sıfırlama maili gönderilemedi.");
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
            Şifreni mi unuttun?
          </Text>

          <Text
            style={{
              color: colors.mutedText,
              fontSize: 15,
              lineHeight: 22,
            }}
          >
            Email adresini yaz. Kayıtlı hesabın varsa sana şifre sıfırlama
            bağlantısı gönderelim.
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
            Şifre sıfırla
          </Text>

          <TextInput
            placeholder="Email"
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

          {message ? (
            <Text
              style={{
                color: "#22C55E",
                fontSize: 13,
                fontWeight: "700",
                lineHeight: 18,
              }}
            >
              {message}
            </Text>
          ) : null}

          <Pressable
            onPress={handleResetPassword}
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
                Sıfırlama maili gönder
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
                color: colors.primary,
                fontWeight: "900",
              }}
            >
              Giriş ekranına dön
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}