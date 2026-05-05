import { useAppTheme } from "@/src/theme/useTheme";
import type { StudySet } from "@/src/types/study-set";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

type Props = {
  set: StudySet;
  onRetry: () => void;
  onDelete: () => void;
  retrying?: boolean;
  deleting?: boolean;
};

export function FailedSetDetail({
  set,
  onRetry,
  onDelete,
  retrying = false,
  deleting = false,
}: Props) {
  const { colors } = useAppTheme();
  const { t } = useTranslation("set");

  const isBusy = retrying || deleting;

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
      contentContainerStyle={{
        flexGrow: 1,
        padding: 20,
        justifyContent: "center",
      }}
      showsVerticalScrollIndicator={false}
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
        <Image
          source={require("@/src/assets/images/failedChartecter.png")}
          resizeMode="contain"
          style={{
            width: "100%",
            height: 190,
          }}
        />

        <View
          style={{
            alignSelf: "center",
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
              textAlign: "center",
            }}
          >
            {t("detail.failed.title")}
          </Text>

          <Text
            style={{
              color: colors.mutedText,
              lineHeight: 21,
              textAlign: "center",
            }}
          >
            {t("detail.failed.description")}
          </Text>

          {set.errorMessage ? (
            <Text
              style={{
                color: colors.mutedText,
                lineHeight: 21,
                textAlign: "center",
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

          <Text
            numberOfLines={4}
            style={{
              color: colors.mutedText,
              lineHeight: 20,
            }}
          >
            {set.sourceText}
          </Text>
        </View>

        <Pressable
          onPress={onRetry}
          disabled={isBusy}
          style={{
            backgroundColor: colors.primary,
            paddingVertical: 15,
            borderRadius: 16,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 8,
            opacity: isBusy ? 0.6 : 1,
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
            {retrying
              ? t("detail.failed.retryingButton")
              : t("detail.failed.retryButton")}
          </Text>
        </Pressable>

        <Pressable
          onPress={onDelete}
          disabled={isBusy}
          style={{
            backgroundColor: "rgba(239,68,68,0.10)",
            borderColor: "rgba(239,68,68,0.22)",
            borderWidth: 1,
            paddingVertical: 15,
            borderRadius: 16,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 8,
            opacity: isBusy ? 0.6 : 1,
          }}
        >
          <Ionicons name="trash-outline" color="#ef4444" size={18} />

          <Text
            style={{
              color: "#ef4444",
              fontWeight: "900",
            }}
          >
            {deleting
              ? t("detail.failed.deletingButton")
              : t("detail.failed.deleteButton")}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.replace("/(tabs)/add")}
          disabled={isBusy}
          style={{
            backgroundColor: colors.background,
            borderColor: colors.border,
            borderWidth: 1,
            paddingVertical: 15,
            borderRadius: 16,
            alignItems: "center",
            opacity: isBusy ? 0.6 : 1,
          }}
        >
          <Text style={{ color: colors.text, fontWeight: "900" }}>
            {t("detail.failed.moveBack")}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}