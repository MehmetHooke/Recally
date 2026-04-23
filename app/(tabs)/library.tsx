import { getSets } from "@/src/services/setService";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type SetItem = {
  id: string;
  title: string;
  sourceType: "text";
  sourceText: string;
  totalCards?: number;
  dueCount?: number;
};

export default function LibraryScreen() {
  const router = useRouter();

  const [sets, setSets] = useState<SetItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSets = async () => {
    try {
      setLoading(true);
      const data = await getSets();
      setSets(data as SetItem[]);
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

  const handleOpenReview = (setId: string) => {
    router.push(`/set/${setId}/review`);
  };

  if (loading) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 16 }}>
        Library
      </Text>

      {sets.length === 0 ? (
        <Text>Henüz set yok.</Text>
      ) : (
        <FlatList
          data={sets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleOpenReview(item.id)}
              activeOpacity={0.8}
              style={{
                borderWidth: 1,
                borderColor: "#ddd",
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: "600" }}>
                {item.title}
              </Text>

              <Text style={{ marginTop: 6, color: "#666" }}>
                Type: {item.sourceType}
              </Text>

              {typeof item.totalCards === "number" && (
                <Text style={{ marginTop: 4, color: "#666" }}>
                  Cards: {item.totalCards}
                </Text>
              )}

              {typeof item.dueCount === "number" && (
                <Text style={{ marginTop: 4, color: "#666" }}>
                  Due: {item.dueCount}
                </Text>
              )}

              <Text numberOfLines={3} style={{ marginTop: 8 }}>
                {item.sourceText}
              </Text>

              <Text style={{ marginTop: 12, fontWeight: "600" }}>
                Tap to review →
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}