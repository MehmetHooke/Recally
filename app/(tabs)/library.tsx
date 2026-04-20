import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { getSets } from "../../src/services/setService";

type SetItem = {
  id: string;
  title: string;
  sourceType: "text";
  sourceText: string;
};

export default function LibraryScreen() {
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
            <View
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
              <Text numberOfLines={3} style={{ marginTop: 8 }}>
                {item.sourceText}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}