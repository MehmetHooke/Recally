import { auth } from "@/src/services/firebase";
import { getSets, SetItem } from "@/src/services/setService";
import { useAppTheme } from "@/src/theme/useTheme";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
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

  const [sets, setSets] = useState<SetItem[]>([]);
  const [loading, setLoading] = useState(true);

  const userName =
    auth.currentUser?.displayName ||
    auth.currentUser?.email?.split("@")[0] ||
    "Mehmet";

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
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 120,
        gap: 18,
      }}
    >
      <View>
        <Text
          style={{
            color: colors.mutedText,
            fontSize: 15,
            fontWeight: "600",
          }}
        >
          Hoş geldin, {userName}
        </Text>

        <Text
          style={{
            color: colors.text,
            fontSize: 30,
            fontWeight: "900",
            marginTop: 4,
          }}
        >
          Bugün neyi hatırlayalım?
        </Text>
      </View>

      {/* Main Review Card */}
      <View
        style={{
          backgroundColor: colors.primary,
          borderRadius: 24,
          padding: 20,
          gap: 14,
        }}
      >
        <Text
          style={{
            color: colors.primaryForeground,
            fontSize: 20,
            fontWeight: "900",
          }}
        >
          Today’s Review
        </Text>

        <Text
          style={{
            color: colors.primaryForeground,
            fontSize: 38,
            fontWeight: "900",
          }}
        >
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
            ? "Bugün tekrar etmen gereken kartlar var. Şimdi çözersen unutma riskini azaltırsın."
            : "Bugün bekleyen tekrar yok. Yeni bir içerik ekleyip kendini test edebilirsin."}
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
          <Text
            style={{
              color: colors.primary,
              fontWeight: "900",
              fontSize: 15,
            }}
          >
            {stats.dueCards > 0 ? "Start Review" : "Create New Cards"}
          </Text>
        </Pressable>
      </View>

      {/* Progress */}
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
          <Text
            style={{
              color: colors.text,
              fontSize: 18,
              fontWeight: "900",
            }}
          >
            Learning Progress
          </Text>

          <Text
            style={{
              color: colors.mutedText,
              marginTop: 4,
              lineHeight: 20,
            }}
          >
            Bu konuların yaklaşık %{stats.progress} kadarını güçlü seviyeye
            taşıdın.
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
          <StatBox label="Set" value={stats.totalSets} />
          <StatBox label="Cards" value={stats.totalCards} />
          <StatBox label="Due" value={stats.dueCards} />
        </View>
      </View>

      {/* Weak Area / Hook */}
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
        <Text
          style={{
            color: colors.text,
            fontSize: 18,
            fontWeight: "900",
          }}
        >
          Weak Spot
        </Text>

        <Text
          style={{
            color: colors.text,
            fontSize: 16,
            fontWeight: "700",
          }}
        >
          Bu kartları 2 gün içinde unutabilirsin
        </Text>

        <Text
          style={{
            color: colors.mutedText,
            lineHeight: 20,
          }}
        >
          Şimdilik mock gösteriyoruz. Sonraki adımda yanlış yaptığın kartlardan
          gerçek zayıf alanlarını çıkaracağız.
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
          <Text
            style={{
              color: colors.text,
              fontWeight: "900",
            }}
          >
            Fix My Gaps
          </Text>
        </Pressable>
      </View>

      {/* Recent Sets */}
      <View style={{ gap: 12 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: 20,
              fontWeight: "900",
            }}
          >
            Recent Sets
          </Text>

          <Pressable onPress={() => router.push("/(tabs)/library")}>
            <Text
              style={{
                color: colors.primary,
                fontWeight: "800",
              }}
            >
              View all
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
            <Text
              style={{
                color: colors.text,
                fontSize: 17,
                fontWeight: "900",
              }}
            >
              Henüz set yok
            </Text>

            <Text
              style={{
                color: colors.mutedText,
                lineHeight: 20,
              }}
            >
              İlk içeriğini ekle. Recallly onu saniyeler içinde soru kartlarına
              çevirsin.
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
              <Text
                style={{
                  color: colors.primaryForeground,
                  fontWeight: "900",
                }}
              >
                İlk setini oluştur
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
                style={{
                  color: colors.text,
                  fontSize: 17,
                  fontWeight: "900",
                }}
                numberOfLines={1}
              >
                {set.title}
              </Text>

              <Text
                style={{
                  color: colors.mutedText,
                  fontSize: 14,
                }}
              >
                {(set.totalCards ?? 0)} cards · {(set.dueCount ?? 0)} due
              </Text>

              <Text
                style={{
                  color: colors.primary,
                  fontWeight: "800",
                  marginTop: 4,
                }}
              >
                Continue →
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