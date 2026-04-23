import { Text, View } from "react-native";

type Props = {
  totalSets: number;
  totalCards: number;
  dueTodayCount: number;
};

export default function ProgressStatsCard({
  totalSets,
  totalCards,
  dueTodayCount,
}: Props) {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 16,
        padding: 16,
        gap: 8,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "700" }}>Progress</Text>
      <Text>Total Sets: {totalSets}</Text>
      <Text>Total Cards: {totalCards}</Text>
      <Text>Due Today: {dueTodayCount}</Text>
    </View>
  );
}