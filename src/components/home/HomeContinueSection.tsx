import type { SetItem } from "@/src/services/setService";
import { useAppTheme } from "@/src/theme/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

type Props = {
  recentSets: SetItem[];
  onOpenSet: (setId: string) => void;
  onViewAll: () => void;
  onCreatePress: () => void;
};

function alpha(hex: string, opacity: number) {
  const sanitized = hex.replace("#", "");

  if (sanitized.length !== 6) return hex;

  const r = parseInt(sanitized.slice(0, 2), 16);
  const g = parseInt(sanitized.slice(2, 4), 16);
  const b = parseInt(sanitized.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function HomeContinueSection({
  recentSets,
  onOpenSet,
  onViewAll,
  onCreatePress,
}: Props) {
  const { colors } = useAppTheme();
  const { t } = useTranslation("tabs");

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderColor: colors.softBorder,
        borderWidth: 1,
        borderRadius: 24,
        padding: 16,
        gap: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 12,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: colors.text,
              fontSize: 20,
              fontWeight: "900",
            }}
          >
            {t("home.continue.title")}
          </Text>

          <Text
            style={{
              color: colors.mutedText,
              fontSize: 13,
              fontWeight: "700",
              marginTop: 4,
              lineHeight: 18,
            }}
          >
            {recentSets.length > 0
              ? t("home.continue.subtitle")
              : t("home.continue.emptySubtitle")}
          </Text>
        </View>

        {recentSets.length > 0 ? (
          <Pressable
            onPress={onViewAll}
            style={({ pressed }) => ({
              backgroundColor: colors.primarySoft,
              borderColor: alpha(colors.primary, 0.16),
              borderWidth: 1,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 999,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text
              style={{
                color: colors.primary,
                fontWeight: "900",
                fontSize: 13,
              }}
            >
              {t("home.continue.viewAll")}
            </Text>
          </Pressable>
        ) : null}
      </View>

      {recentSets.length === 0 ? (
        <EmptyContinueCard onCreatePress={onCreatePress} />
      ) : (
        <View style={{ gap: 12 }}>
          {recentSets.map((set) => (
            <ContinueSetCard
              key={set.id}
              set={set}
              onPress={() => onOpenSet(set.id)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

function EmptyContinueCard({
  onCreatePress,
}: {
  onCreatePress: () => void;
}) {
  const { colors } = useAppTheme();
  const { t } = useTranslation("tabs");

  return (
    <View
      style={{
        backgroundColor: colors.background,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 20,
        padding: 16,
        gap: 14,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 14,
        }}
      >
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 18,
            backgroundColor: colors.primarySoft,
            borderWidth: 1,
            borderColor: alpha(colors.primary, 0.16),
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="sparkles" size={24} color={colors.primary} />
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: colors.text,
              fontSize: 17,
              fontWeight: "900",
              lineHeight: 23,
            }}
          >
            {t("home.continue.emptyTitle")}
          </Text>

          <Text
            style={{
              color: colors.mutedText,
              lineHeight: 20,
              marginTop: 5,
              fontSize: 14,
            }}
          >
            {t("home.continue.emptyDescription")}
          </Text>
        </View>
      </View>

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
          style={{
            color: colors.primaryForeground,
            fontWeight: "900",
          }}
        >
          {t("home.continue.emptyButton")}
        </Text>
      </Pressable>
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

  const setWithOptionalFields = set as SetItem & {
    sourceType?: "youtube" | "text" | "pdf" | string;
    totalCards?: number;
    cardCount?: number;
  };

  const hasDue = dueCards > 0;
  const sourceType = setWithOptionalFields.sourceType;
  const totalCards =
    setWithOptionalFields.totalCards ?? setWithOptionalFields.cardCount ?? 0;

  const sourceIcon =
    sourceType === "youtube"
      ? "logo-youtube"
      : sourceType === "text"
        ? "document-text"
        : "layers";

  const sourceColor =
    sourceType === "youtube" ? colors.danger : colors.primary;

  const sourceBackground =
    sourceType === "youtube" ? colors.dangerSoft : colors.primarySoft;

  const metaText =
    totalCards > 0
      ? t("home.continue.cardMeta", { count: totalCards })
      : hasDue
        ? t("home.continue.dueMeta", { count: dueCards })
        : t("home.continue.noDueMeta");

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: colors.background,
        borderColor: hasDue ? alpha(colors.primary, 0.28) : colors.border,
        borderWidth: 1,
        borderRadius: 20,
        padding: 14,
        gap: 14,
        opacity: pressed ? 0.94 : 1,
      })}
    >
      {/* Top */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 17,
            backgroundColor: sourceBackground,
            borderWidth: 1,
            borderColor: alpha(sourceColor, 0.18),
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name={sourceIcon} size={23} color={sourceColor} />
        </View>

        <View style={{ flex: 1, minWidth: 0 }}>
          <Text
            style={{
              color: colors.text,
              fontSize: 14,
              lineHeight: 22,
              fontWeight: "900",
            }}
            numberOfLines={1}
          >
            {set.title}
          </Text>

          <Text
            style={{
              color: colors.mutedText,
              fontSize: 12,
              fontWeight: "700",
              marginTop: 4,
            }}
            numberOfLines={1}
          >
            {metaText}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: hasDue ? colors.primarySoft : colors.card,
            borderColor: hasDue ? alpha(colors.primary, 0.22) : colors.border,
            borderWidth: 1,
            borderRadius: 999,
            paddingHorizontal: 10,
            paddingVertical: 6,
          }}
        >
          <Text
            style={{
              color: hasDue ? colors.primary : colors.mutedText,
              fontSize: 11,
              fontWeight: "900",
            }}
          >
            {hasDue
              ? t("home.continue.dueBadge", { count: dueCards })
              : t("home.continue.doneBadge")}
          </Text>
        </View>
      </View>

      {/* Progress */}
      <View style={{ gap: 8, paddingTop: 2 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: colors.mutedText,
              fontSize: 12,
              fontWeight: "800",
            }}
          >
            {t("home.continue.progressLabel", {
              progress: reviewProgress,
            })}
          </Text>
        </View>

        <View
          style={{
            height: 8,
            backgroundColor: colors.progressTrack,
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: `${reviewProgress}%`,
              height: "100%",
              backgroundColor: hasDue ? colors.primary : colors.success,
              borderRadius: 999,
            }}
          />
        </View>
      </View>

      {/* Action */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderTopWidth: 1,
          borderTopColor: colors.softBorder,
          paddingTop: 12,
        }}
      >
        <Text
          style={{
            color: hasDue ? colors.primary : colors.text,
            fontWeight: "900",
            fontSize: 14,
          }}
        >
          {hasDue
            ? t("home.continue.reviewCta")
            : t("home.continue.openCta")}
        </Text>

        <View
          style={{
            width: 34,
            height: 34,
            borderRadius: 999,
            backgroundColor: hasDue ? colors.primary : colors.card,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: hasDue ? 0 : 1,
            borderColor: colors.border,
          }}
        >
          <Ionicons
            name={hasDue ? "play" : "chevron-forward"}
            size={16}
            color={hasDue ? colors.primaryForeground : colors.mutedText}
          />
        </View>
      </View>
    </Pressable>
  );
}