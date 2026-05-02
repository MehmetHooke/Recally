import { useAppTheme } from "@/src/theme/useTheme";
import { useTranslation } from "react-i18next";
import { Image, Pressable, Text, View } from "react-native";

type Props = {
  dueCards: number;
  streakCount: number;
  onPrimaryPress: () => void;
  onCreatePress: () => void;
};

const flameImage = require("@/src/assets/images/flame.png");
const brainImage = require("@/src/assets/images/brain-hero.png");

export function HomeHeroReviewCard({
  dueCards,
  streakCount,
  onPrimaryPress,
  onCreatePress,
}: Props) {
  const { colors } = useAppTheme();
  const { t } = useTranslation("tabs");

  const hasDue = dueCards > 0;
  const hasStreak = streakCount > 0;

  return (
    <View
      style={{
        backgroundColor: colors.primary,
        borderRadius: 26,
        padding: 20,
        gap: 16,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Decorative background glow */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: -20,
          right: -10,
          width: 170,
          height: 170,
          borderRadius: 999,
          backgroundColor: colors.onPrimarySoft,
          opacity: 0.45,
        }}
      />

      {/* Decorative brain */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 18,
          right: 10,
          width: 120,
          height: 120,
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.95,
        }}
      >
        <Image
          source={brainImage}
          style={{
            width: 105,
            height: 105,
            resizeMode: "contain",
          }}
        />
      </View>

      {/* Content */}
      <View style={{ gap: 10, paddingRight: 110 }}>
        <Text
          style={{
            color: colors.primaryForeground,
            fontSize: 22,
            fontWeight: "900",
            lineHeight: 28,
          }}
        >
          {hasDue ? t("home.hero.title.hasDue") : t("home.hero.title.noDue")}
        </Text>

        <View
          style={{
            alignSelf: "flex-start",
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            backgroundColor: colors.onPrimarySoft,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 999,
          }}
        >
          <Image
            source={flameImage}
            style={{
              width: 16,
              height: 20,
              resizeMode: "contain",
            }}
          />

          <Text
            style={{
              color: colors.primaryForeground,
              fontSize: 13,
              fontWeight: "900",
            }}
          >
            {hasStreak
              ? t("home.hero.streak", { count: streakCount })
              : t("home.hero.startStreak")}
          </Text>
        </View>
      </View>

      <View style={{ paddingRight: 90 }}>
        <Text
          style={{
            color: colors.primaryForeground,
            fontSize: 48,
            fontWeight: "900",
            letterSpacing: -1,
          }}
        >
          {dueCards}
        </Text>

        <Text
          style={{
            color: colors.primaryForeground,
            fontSize: 15,
            lineHeight: 22,
            opacity: 0.9,
          }}
        >
          {hasDue
            ? t("home.hero.description.hasDue")
            : t("home.hero.description.noDue")}
        </Text>
      </View>

      <Pressable
        onPress={hasDue ? onPrimaryPress : onCreatePress}
        style={({ pressed }) => ({
          backgroundColor: colors.primaryForeground,
          paddingVertical: 15,
          borderRadius: 16,
          alignItems: "center",
          marginTop: 2,
          opacity: pressed ? 0.88 : 1,
        })}
      >
        <Text
          style={{
            color: colors.primary,
            fontWeight: "900",
            fontSize: 15,
          }}
        >
          {hasDue ? t("home.hero.primaryButton") : t("home.hero.createButton")}
        </Text>
      </Pressable>
    </View>
  );
}