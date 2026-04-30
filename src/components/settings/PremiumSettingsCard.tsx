import { useAppTheme } from "@/src/theme/useTheme";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

type UserPlan = "free" | "premium";

type Props = {
  plan: UserPlan;
  usedSets: number;
  maxFreeSets: number;
  onUpgrade?: () => void;
};

export function PremiumSettingsCard({
  plan,
  usedSets,
  maxFreeSets,
  onUpgrade,
}: Props) {
  const { colors } = useAppTheme();
  const { t } = useTranslation("tabs");

  const isPremium = plan === "premium";
  const progress = maxFreeSets > 0 ? Math.min((usedSets / maxFreeSets) * 100, 100) : 0;
  const remainingSets = Math.max(maxFreeSets - usedSets, 0);

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 18,
        padding: 16,
      }}
    >
      <Text
        style={{
          color: colors.text,
          fontWeight: "900",
          fontSize: 16,
          marginBottom: 8,
        }}
      >
        {t("settings.premium.title")}
      </Text>

      <Text style={{ color: colors.mutedText, lineHeight: 20 }}>
        {isPremium
          ? t("settings.premium.premiumDescription")
          : t("settings.premium.description")}
      </Text>

      {!isPremium ? (
        <View style={{ marginTop: 16 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Text style={{ color: colors.text, fontWeight: "800" }}>
              {usedSets} / {maxFreeSets}  {t("settings.premium.setsUsage")}
            </Text>

            <Text style={{ color: colors.mutedText, fontWeight: "700" }}>
              {remainingSets} left
            </Text>
          </View>

          <View
            style={{
              height: 9,
              borderRadius: 999,
              overflow: "hidden",
              backgroundColor: colors.border,
            }}
          >
            <View
              style={{
                width: `${progress}%`,
                height: "100%",
                backgroundColor: colors.primary,
              }}
            />
          </View>

          <Pressable
            onPress={onUpgrade}
            style={{
              marginTop: 14,
              backgroundColor: colors.primary,
              padding: 12,
              borderRadius: 12,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: colors.primaryForeground,
                fontWeight: "900",
              }}
            >
              {t("settings.premium.button")}
            </Text>
          </Pressable>
        </View>
      ) : (
        <View
          style={{
            marginTop: 14,
            padding: 12,
            borderRadius: 14,
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text style={{ color: colors.text, fontWeight: "900" }}>
            Premium active
          </Text>

          <Text style={{ color: colors.mutedText, marginTop: 4 }}>
            Unlimited study sets and AI generations.
          </Text>
        </View>
      )}
    </View>
  );
}