import { auth } from "@/src/services/firebase";
import { getSets, SetItem } from "@/src/services/setService";
import { useAppTheme } from "@/src/theme/useTheme";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { t } = useTranslation("tabs");

  const [sets, setSets] = useState<SetItem[]>([]);
  const [loading, setLoading] = useState(true);

  const userName =
    auth.currentUser?.displayName ||
    auth.currentUser?.email?.split("@")[0] ||
    t("home.fallbackUserName");

  const loadHome = async () => {
    try {
      setLoading(true);
      const data = await getSets();
      setSets(data);
    } catch (error) {
      console.error("Home load error:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadHome();
    }, [])
  );

  const stats = useMemo(() => {
    const totalSets = sets.length;
    const totalCards = sets.reduce((sum, set) => sum + (set.totalCards ?? 0), 0);
    const dueCards = sets.reduce((sum, set) => sum + (set.dueCount ?? 0), 0);
    const masteredCards = sets.reduce(
      (sum, set) => sum + (set.masteredCount ?? 0),
      0
    );

    const progress =
      totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;

    return {
      totalSets,
      totalCards,
      dueCards,
      masteredCards,
      progress,
    };
  }, [sets]);

  const firstDueSet = sets.find((set) => (set.dueCount ?? 0) > 0);
  const recentSets = sets.slice(0, 3);

  const handleStartReview = () => {
    if (firstDueSet) {
      router.push(`/set/${firstDueSet.id}/review`);
      return;
    }

    router.push("/(tabs)/library");
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background, paddingTop: 40 }}
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 120,
        gap: 18,
      }}
    >
      <View>
        <Text style={{ color: colors.mutedText, fontSize: 15, fontWeight: "600" }}>
          {t("home.welcome", { name: userName })}
        </Text>

        <Text
          style={{
            color: colors.text,
            fontSize: 30,
            fontWeight: "900",
            marginTop: 4,
          }}
        >
          {t("home.title")}
        </Text>
      </View>

      <View
        style={{
          backgroundColor: colors.primary,
          borderRadius: 24,
          padding: 20,
          gap: 14,
        }}
      >
        <Text style={{ color: colors.primaryForeground, fontSize: 20, fontWeight: "900" }}>
          {t("home.review.title")}
        </Text>

        <Text style={{ color: colors.primaryForeground, fontSize: 38, fontWeight: "900" }}>
          {stats.dueCards}
        </Text>

        <Text
          style={{
            color: colors.primaryForeground,
            fontSize: 15,
            lineHeight: 21,
            opacity: 0.9,
          }}
        >
          {stats.dueCards > 0
            ? t("home.review.hasDueDescription")
            : t("home.review.noDueDescription")}
        </Text>

        <Pressable
          onPress={stats.dueCards > 0 ? handleStartReview : () => router.push("/(tabs)/add")}
          style={{
            backgroundColor: colors.primaryForeground,
            paddingVertical: 14,
            borderRadius: 16,
            alignItems: "center",
            marginTop: 4,
          }}
        >
          <Text style={{ color: colors.primary, fontWeight: "900", fontSize: 15 }}>
            {stats.dueCards > 0
              ? t("home.review.startButton")
              : t("home.review.createButton")}
          </Text>
        </Pressable>
      </View>

      <View
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 20,
          padding: 16,
          gap: 14,
        }}
      >
        <View>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: "900" }}>
            {t("home.progress.title")}
          </Text>

          <Text style={{ color: colors.mutedText, marginTop: 4, lineHeight: 20 }}>
            {t("home.progress.description", { progress: stats.progress })}
          </Text>
        </View>

        <View
          style={{
            height: 10,
            backgroundColor: colors.border,
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: `${stats.progress}%`,
              height: "100%",
              backgroundColor: colors.primary,
              borderRadius: 999,
            }}
          />
        </View>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <StatBox label={t("home.stats.sets")} value={stats.totalSets} />
          <StatBox label={t("home.stats.cards")} value={stats.totalCards} />
          <StatBox label={t("home.stats.due")} value={stats.dueCards} />
        </View>
      </View>

      <View
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 20,
          padding: 16,
          gap: 12,
        }}
      >
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: "900" }}>
          {t("home.weakSpot.title")}
        </Text>

        <Text style={{ color: colors.text, fontSize: 16, fontWeight: "700" }}>
          {t("home.weakSpot.subtitle")}
        </Text>

        <Text style={{ color: colors.mutedText, lineHeight: 20 }}>
          {t("home.weakSpot.description")}
        </Text>

        <Pressable
          onPress={() => router.push("/(tabs)/library")}
          style={{
            backgroundColor: colors.background,
            borderColor: colors.border,
            borderWidth: 1,
            paddingVertical: 13,
            borderRadius: 14,
            alignItems: "center",
          }}
        >
          <Text style={{ color: colors.text, fontWeight: "900" }}>
            {t("home.weakSpot.button")}
          </Text>
        </Pressable>
      </View>

      <View style={{ gap: 12 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: "900" }}>
            {t("home.recent.title")}
          </Text>

          <Pressable onPress={() => router.push("/(tabs)/library")}>
            <Text style={{ color: colors.primary, fontWeight: "800" }}>
              {t("home.recent.viewAll")}
            </Text>
          </Pressable>
        </View>

        {recentSets.length === 0 ? (
          <View
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 18,
              padding: 18,
              gap: 10,
            }}
          >
            <Text style={{ color: colors.text, fontSize: 17, fontWeight: "900" }}>
              {t("home.empty.title")}
            </Text>

            <Text style={{ color: colors.mutedText, lineHeight: 20 }}>
              {t("home.empty.description")}
            </Text>

            <Pressable
              onPress={() => router.push("/(tabs)/add")}
              style={{
                backgroundColor: colors.primary,
                paddingVertical: 14,
                borderRadius: 14,
                alignItems: "center",
              }}
            >
              <Text style={{ color: colors.primaryForeground, fontWeight: "900" }}>
                {t("home.empty.button")}
              </Text>
            </Pressable>
          </View>
        ) : (
          recentSets.map((set) => (
            <Pressable
              key={set.id}
              onPress={() => router.push(`/set/${set.id}`)}
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 18,
                padding: 16,
                gap: 8,
              }}
            >
              <Text
                style={{ color: colors.text, fontSize: 17, fontWeight: "900" }}
                numberOfLines={1}
              >
                {set.title}
              </Text>

              <Text style={{ color: colors.mutedText, fontSize: 14 }}>
                {t("home.recent.cardMeta", {
                  cards: set.totalCards ?? 0,
                  due: set.dueCount ?? 0,
                })}
              </Text>

              <Text style={{ color: colors.primary, fontWeight: "800", marginTop: 4 }}>
                {t("home.recent.continue")}
              </Text>
            </Pressable>
          ))
        )}
      </View>
    </ScrollView>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 14,
        padding: 12,
      }}
    >
      <Text style={{ color: colors.text, fontSize: 20, fontWeight: "900" }}>
        {value}
      </Text>

      <Text
        style={{
          color: colors.mutedText,
          marginTop: 4,
          fontSize: 12,
          fontWeight: "700",
        }}
      >
        {label}
      </Text>
    </View>
  );
}