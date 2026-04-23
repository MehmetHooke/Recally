import type { HomeRecentSet } from "@/src/services/homeService";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  sets: HomeRecentSet[];
  onPressSet: (setId: string) => void;
};

export default function RecentSetsSection({ sets, onPressSet }: Props) {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 16,
        padding: 16,
        gap: 12,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "700" }}>Recent Sets</Text>

      {sets.length === 0 ? (
        <Text>No sets yet.</Text>
      ) : (
        sets.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => onPressSet(item.id)}
            style={{
              borderWidth: 1,
              borderColor: "#eee",
              borderRadius: 12,
              padding: 12,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "600" }}>{item.title}</Text>

            <Text style={{ marginTop: 4, color: "#666" }}>
              {item.totalCards ?? 0} cards
            </Text>

            <Text numberOfLines={2} style={{ marginTop: 6 }}>
              {item.sourceText}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
}