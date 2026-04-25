import { DueReminderCard } from "@/src/components/library/DueReminderCard";
import { LearningIntelligenceCard } from "@/src/components/library/LearningIntelligenceCard";
import { LibraryEmptyState } from "@/src/components/library/LibraryEmptyState";
import {
  FilterType,
  LibraryFilters,
} from "@/src/components/library/LibraryFilters";
import { LibraryHeader } from "@/src/components/library/LibraryHeader";
import { LibrarySetCard } from "@/src/components/library/LibrarySetCard";
import { getSets, SetItem } from "@/src/services/setService";
import { useAppTheme } from "@/src/theme/useTheme";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";

export default function LibraryScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  const [sets, setSets] = useState<SetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");

  const loadSets = async () => {
    try {
      setLoading(true);
      const data = await getSets();
      setSets(data);
    } catch (error) {
      console.error("Get sets error:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSets();
    }, [])
  );

  const filteredSets = useMemo(() => {
    if (filter === "due") {
      return sets.filter((set) => (set.dueCount ?? 0) > 0);
    }

    if (filter === "mastered") {
      return sets.filter((set) => {
        const total = set.totalCards ?? 0;
        const mastered = set.masteredCount ?? 0;
        return total > 0 && mastered >= total;
      });
    }

    return sets;
  }, [sets, filter]);

  const totalCards = sets.reduce((sum, set) => sum + (set.totalCards ?? 0), 0);
  const dueCards = sets.reduce((sum, set) => sum + (set.dueCount ?? 0), 0);
  const masteredCards = sets.reduce(
    (sum, set) => sum + (set.masteredCount ?? 0),
    0
  );

  const progress =
    totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;

  const handleOpenSet = (setId: string) => {
    router.push(`/set/${setId}`);
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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={filteredSets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 120,
          gap: 12,
        }}
        ListHeaderComponent={
          <View style={{ gap: 16 }}>
            <LibraryHeader />

            <LearningIntelligenceCard
              progress={progress}
              totalSets={sets.length}
              totalCards={totalCards}
              dueCards={dueCards}
            />

            <DueReminderCard
              dueCards={dueCards}
              onPress={() => setFilter("due")}
            />

            <LibraryFilters filter={filter} onChange={setFilter} />
          </View>
        }
        ListEmptyComponent={
          <LibraryEmptyState onCreatePress={() => router.push("/(tabs)/add")} />
        }
        renderItem={({ item }) => (
          <LibrarySetCard item={item} onPress={() => handleOpenSet(item.id)} />
        )}
      />
    </View>
  );
}