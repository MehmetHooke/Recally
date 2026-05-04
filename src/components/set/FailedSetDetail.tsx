import { useAppTheme } from "@/src/theme/useTheme";
import type { StudySet } from "@/src/types/study-set";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

export function FailedSetDetail({ set }: { set: StudySet }) {
  const { colors } = useAppTheme();
  const { t } = useTranslation("set");

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
        justifyContent: "center",
      }}
    >
      <View
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 28,
          padding: 24,
          gap: 18,
        }}
      >
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 18,
            backgroundColor: "rgba(239,68,68,0.12)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="warning-outline" color="#ef4444" size={26} />
        </View>

        <View style={{ gap: 8 }}>
          <Text
            style={{
              color: colors.text,
              fontSize: 24,
              fontWeight: "900",
            }}
          >
            {t("detail.failed.title")}
          </Text>

          <Text
            style={{
              color: colors.mutedText,
              lineHeight: 21,
            }}
          >
            {t("detail.failed.description")}
          </Text>

          {set.errorMessage ? (
            <Text
              style={{
                color: colors.mutedText,
                lineHeight: 21,
              }}
            >
              {set.errorMessage}
            </Text>
          ) : null}
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
            {t("detail.failed.savedLink")}
          </Text>

          <Text style={{ color: colors.mutedText, lineHeight: 20 }}>
            {set.sourceText}
          </Text>
        </View>

        <Pressable
          onPress={() => router.replace("/(tabs)/add")}
          style={{
            backgroundColor: colors.primary,
            paddingVertical: 15,
            borderRadius: 16,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Ionicons
            name="refresh-outline"
            color={colors.primaryForeground}
            size={18}
          />
          <Text
            style={{
              color: colors.primaryForeground,
              fontWeight: "900",
            }}
          >
            {t("detail.failed.retryButton")}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace("/(tabs)/add")}
          style={{
            backgroundColor: colors.background,
            borderColor: colors.border,
            borderWidth: 1,
            paddingVertical: 15,
            borderRadius: 16,
            alignItems: "center",
          }}
        >
          <Text style={{ color: colors.text, fontWeight: "900" }}>
            {t("detail.failed.moveBack")}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}