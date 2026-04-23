import ProgressStatsCard from "@/src/components/home/ProgressStatsCard";
import RecentSetsSection from "@/src/components/home/RecentSetsSection";
import StreakCard from "@/src/components/home/StreakCard";
import TodayReviewCard from "@/src/components/home/TodayReviewCard";
import {
  getHomeDashboardData,
  type HomeDashboardData,
} from "@/src/services/homeService";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
  const [data, setData] = useState<HomeDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const result = await getHomeDashboardData();
      setData(result);
    } catch (error) {
      console.error("HOME DASHBOARD ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [])
  );

  const handleStartReview = () => {
    if (!data || data.recentSets.length === 0) return;

    const firstSetWithReview = data.recentSets[0];
    router.push(`/set/${firstSetWithReview.id}/review`);
  };

  const handleOpenSet = (setId: string) => {
    router.push(`/set/${setId}/review`);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
        <Text>Dashboard could not be loaded.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        gap: 16,
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: "700" }}>Home</Text>

      <TodayReviewCard
        dueCount={data.dueTodayCount}
        onStartReview={handleStartReview}
      />

      <RecentSetsSection
        sets={data.recentSets}
        onPressSet={handleOpenSet}
      />

      <ProgressStatsCard
        totalSets={data.totalSets}
        totalCards={data.totalCards}
        dueTodayCount={data.dueTodayCount}
      />

      <StreakCard streakCount={data.streakCount} />
    </ScrollView>
  );
}