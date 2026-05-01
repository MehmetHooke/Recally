import type { SetItem } from "@/src/services/setService";
import { useAppTheme } from "@/src/theme/useTheme";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

type Props = {
  recentSets: SetItem[];
  onOpenSet: (setId: string) => void;
  onViewAll: () => void;
  onCreatePress: () => void;
};

export function HomeContinueSection({
  recentSets,
  onOpenSet,
  onViewAll,
  onCreatePress,
}: Props) {
  const { colors } = useAppTheme();
  const { t } = useTranslation("tabs");

  return (
    <View style={{ gap: 12 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: "900" }}>
          {t("home.continue.title")}
        </Text>

        {recentSets.length > 0 ? (
          <Pressable onPress={onViewAll}>
            <Text style={{ color: colors.primary, fontWeight: "800" }}>
              {t("home.continue.viewAll")}
            </Text>
          </Pressable>
        ) : null}
      </View>

      {recentSets.length === 0 ? (
        <View
          style={{
            backgroundColor: colors.card,
            borderColor: colors.softBorder,
            borderWidth: 1,
            borderRadius: 20,
            padding: 18,
            gap: 12,
          }}
        >
          <Text style={{ color: colors.text, fontSize: 17, fontWeight: "900" }}>
            {t("home.continue.emptyTitle")}
          </Text>

          <Text style={{ color: colors.mutedText, lineHeight: 20 }}>
            {t("home.continue.emptyDescription")}
          </Text>

          <Pressable
            onPress={onCreatePress}
            style={({ pressed }) => ({
              backgroundColor: colors.primary,
              paddingVertical: 14,
              borderRadius: 14,
              alignItems: "center",
              opacity: pressed ? 0.88 : 1,
            })}
          >
            <Text
              style={{ color: colors.primaryForeground, fontWeight: "900" }}
            >
              {t("home.continue.emptyButton")}
            </Text>
          </Pressable>
        </View>
      ) : (
        recentSets.map((set) => (
          <ContinueSetCard
            key={set.id}
            set={set}
            onPress={() => onOpenSet(set.id)}
          />
        ))
      )}
    </View>
  );
}

function ContinueSetCard({
  set,
  onPress,
}: {
  set: SetItem;
  onPress: () => void;
}) {
  const { colors } = useAppTheme();
  const { t } = useTranslation("tabs");

  const dueCards = set.dueCount ?? 0;

  const reviewProgress = Math.max(
    0,
    Math.min(100, Math.round(set.reviewProgress ?? 0))
  );

  const hasDue = dueCards > 0;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: colors.card,
        borderColor: hasDue ? colors.primarySoft : colors.softBorder,
        borderWidth: 1,
        borderRadius: 18,
        padding: 16,
        gap: 12,
        opacity: pressed ? 0.9 : 1,
      })}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{ color: colors.text, fontSize: 17, fontWeight: "900" }}
            numberOfLines={1}
          >
            {set.title}
          </Text>

          <Text
            style={{
              color: hasDue ? colors.text : colors.mutedText,
              fontSize: 14,
              fontWeight: "700",
              marginTop: 5,
            }}
          >
            {hasDue
              ? t("home.continue.dueMeta", { count: dueCards })
              : t("home.continue.noDueMeta")}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: colors.background,
            borderColor: colors.softBorder,
            borderWidth: 1,
            borderRadius: 999,
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: 12,
              fontWeight: "900",
            }}
          >
            {t("home.continue.progressLabel", {
              progress: reviewProgress,
            })}
          </Text>
        </View>
      </View>

      <View
        style={{
          height: 7,
          backgroundColor: colors.progressTrack,
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${reviewProgress}%`,
            height: "100%",
            backgroundColor: colors.primary,
            borderRadius: 999,
          }}
        />
      </View>

      <Text
        style={{
          color: hasDue ? colors.primary : colors.mutedText,
          fontWeight: "900",
          marginTop: 2,
        }}
      >
        {hasDue
          ? t("home.continue.reviewCta")
          : t("home.continue.openCta")}
      </Text>
    </Pressable>
  );
}