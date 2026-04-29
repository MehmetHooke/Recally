import { AppLoadingState } from "@/src/components/common/AppLoadingState";
import { HomeContinueSection } from "@/src/components/home/HomeContinueSection";
import { HomeHeader } from "@/src/components/home/HomeHeader";
import { HomeHeroReviewCard } from "@/src/components/home/HomeHeroReviewCard";
import { HomeProgressCard } from "@/src/components/home/HomeProgressCard";
import { auth } from "@/src/services/firebase";
import { getSets, SetItem } from "@/src/services/setService";
import { getUserStreakCount } from "@/src/services/streakService";
import { useAppTheme } from "@/src/theme/useTheme";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native";


export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { t } = useTranslation("tabs");



  const [sets, setSets] = useState<SetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [streakCount, setStreakCount] = useState(0);

  const userName =
    auth.currentUser?.displayName ||
    auth.currentUser?.email?.split("@")[0] ||
    t("home.fallbackUserName");

  const loadHome = async () => {
    try {
      setLoading(true);
      const [data, streak] = await Promise.all([
        getSets(),
        getUserStreakCount(),
      ]);
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

    const reviewedCards = sets.reduce(
      (sum, set) => sum + (set.reviewedCount ?? 0),
      0
    );

    const reviewProgress =
      totalCards > 0 ? Math.round((reviewedCards / totalCards) * 100) : 0;

    const masteryProgress =
      totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;

    return {
      totalSets,
      totalCards,
      dueCards,
      reviewProgress,
      masteryProgress,
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

  const handleCreateCards = () => {
    router.push("/(tabs)/add");
  };

  const handleOpenSet = (setId: string) => {
    router.push(`/set/${setId}`);
  };

  const handleViewAll = () => {
    router.push("/(tabs)/library");
  };

  if (loading) {
    return <AppLoadingState />;
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
      <HomeHeader userName={userName} />

      <HomeHeroReviewCard
        dueCards={stats.dueCards}
        streakCount={streakCount}
        onPrimaryPress={handleStartReview}
        onCreatePress={handleCreateCards}
      />

      <HomeProgressCard
        reviewProgress={stats.reviewProgress}
        masteryProgress={stats.masteryProgress}
        totalSets={stats.totalSets}
        totalCards={stats.totalCards}
        dueCards={stats.dueCards}
      />

      <HomeContinueSection
        recentSets={recentSets}
        onOpenSet={handleOpenSet}
        onViewAll={handleViewAll}
        onCreatePress={handleCreateCards}
      />
    </ScrollView>
  );
}