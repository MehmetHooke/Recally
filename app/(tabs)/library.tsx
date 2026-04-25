import {
  getSets,
  getSummaryPreview,
  SetItem,
} from "@/src/services/setService";
import { useAppTheme } from "@/src/theme/useTheme";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type FilterType = "all" | "due" | "mastered";

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
            <View>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "900",
                  color: colors.text,
                }}
              >
                Library
              </Text>

              <Text
                style={{
                  marginTop: 6,
                  fontSize: 15,
                  color: colors.mutedText,
                  lineHeight: 21,
                }}
              >
                Burası sadece arşiv değil. Recallly kullandıkça öğrenme
                durumun burada şekillenir.
              </Text>
            </View>

            <View
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 22,
                padding: 16,
                gap: 14,
              }}
            >
              <View>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 18,
                    fontWeight: "900",
                  }}
                >
                  Learning Intelligence
                </Text>

                <Text
                  style={{
                    color: colors.mutedText,
                    marginTop: 5,
                    lineHeight: 20,
                  }}
                >
                  Şu an genel ilerlemen %{progress}. Tekrar bekleyen kartlar,
                  unutma riskinin olduğu yerleri gösterir.
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
                    width: `${progress}%`,
                    height: "100%",
                    backgroundColor: colors.primary,
                    borderRadius: 999,
                  }}
                />
              </View>

              <View style={{ flexDirection: "row", gap: 10 }}>
                <StatBox label="Set" value={sets.length} />
                <StatBox label="Kart" value={totalCards} />
                <StatBox label="Tekrar" value={dueCards} />
              </View>
            </View>

            {dueCards > 0 ? (
              <Pressable
                onPress={() => setFilter("due")}
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 20,
                  padding: 16,
                  gap: 8,
                }}
              >
                <Text
                  style={{
                    color: colors.primaryForeground,
                    fontSize: 18,
                    fontWeight: "900",
                  }}
                >
                  {dueCards} kart unutma riskinde
                </Text>

                <Text
                  style={{
                    color: colors.primaryForeground,
                    opacity: 0.9,
                    lineHeight: 20,
                  }}
                >
                  Bu kartları şimdi tekrar edersen bilgiyi daha kalıcı hale
                  getirirsin.
                </Text>
              </Pressable>
            ) : null}

            <View style={{ flexDirection: "row", gap: 8 }}>
              <FilterButton
                label="All"
                active={filter === "all"}
                onPress={() => setFilter("all")}
              />
              <FilterButton
                label="Due"
                active={filter === "due"}
                onPress={() => setFilter("due")}
              />
              <FilterButton
                label="Mastered"
                active={filter === "mastered"}
                onPress={() => setFilter("mastered")}
              />
            </View>
          </View>
        }
        ListEmptyComponent={
          <View
            style={{
              marginTop: 24,
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 18,
              padding: 20,
              gap: 12,
            }}
          >
            <Text
              style={{
                color: colors.text,
                fontSize: 18,
                fontWeight: "900",
              }}
            >
              Henüz burada bir şey yok
            </Text>

            <Text
              style={{
                color: colors.mutedText,
                fontSize: 15,
                lineHeight: 21,
              }}
            >
              YouTube linki ekle, Recallly onu saniyeler içinde özet ve soru
              kartlarına çevirsin.
            </Text>

            <Pressable
              onPress={() => router.push("/(tabs)/add")}
              style={{
                backgroundColor: colors.primary,
                paddingVertical: 14,
                borderRadius: 14,
                alignItems: "center",
                marginTop: 4,
              }}
            >
              <Text
                style={{
                  color: colors.primaryForeground,
                  fontWeight: "900",
                }}
              >
                İlk videonu teste çevir
              </Text>
            </Pressable>
          </View>
        }
        renderItem={({ item }) => {
          const total = item.totalCards ?? 0;
          const due = item.dueCount ?? 0;
          const mastered = item.masteredCount ?? 0;
          const itemProgress =
            total > 0 ? Math.round((mastered / total) * 100) : 0;

          const summaryPreview = getSummaryPreview(item.summary) || item.sourceText;

          return (
            <TouchableOpacity
              onPress={() => handleOpenSet(item.id)}
              activeOpacity={0.85}
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 18,
                padding: 16,
                gap: 12,
              }}
            >
              <View>
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 18,
                    fontWeight: "900",
                  }}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>

                <Text
                  style={{
                    marginTop: 6,
                    color: colors.mutedText,
                    fontSize: 13,
                    fontWeight: "700",
                  }}
                >
                  {item.sourceType === "youtube"
                    ? "YouTube video"
                    : "Text content"}
                </Text>
              </View>

              <Text
                numberOfLines={2}
                style={{
                  color: colors.mutedText,
                  fontSize: 14,
                  lineHeight: 20,
                }}
              >
                {summaryPreview}
              </Text>

              <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                <MiniBadge label={`${total} cards`} />
                <MiniBadge label={`${due} due`} />
                <MiniBadge label={`${itemProgress}% mastered`} />
              </View>

              <View
                style={{
                  height: 8,
                  backgroundColor: colors.border,
                  borderRadius: 999,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    width: `${itemProgress}%`,
                    height: "100%",
                    backgroundColor: colors.primary,
                    borderRadius: 999,
                  }}
                />
              </View>

              <Text
                style={{
                  color: colors.primary,
                  fontWeight: "900",
                  marginTop: 2,
                }}
              >
                Özeti oku ve test et →
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
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
      <Text
        style={{
          color: colors.text,
          fontSize: 20,
          fontWeight: "900",
        }}
      >
        {value}
      </Text>

      <Text
        style={{
          marginTop: 4,
          color: colors.mutedText,
          fontSize: 12,
          fontWeight: "700",
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function FilterButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        paddingVertical: 11,
        borderRadius: 999,
        alignItems: "center",
        backgroundColor: active ? colors.primary : colors.card,
        borderColor: active ? colors.primary : colors.border,
        borderWidth: 1,
      }}
    >
      <Text
        style={{
          color: active ? colors.primaryForeground : colors.text,
          fontWeight: "900",
          fontSize: 13,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function MiniBadge({ label }: { label: string }) {
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        backgroundColor: colors.background,
        borderColor: colors.border,
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
      }}
    >
      <Text
        style={{
          color: colors.mutedText,
          fontSize: 12,
          fontWeight: "700",
        }}
      >
        {label}
      </Text>
    </View>
  );
}