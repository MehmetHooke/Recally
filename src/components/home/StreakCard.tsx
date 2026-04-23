import { Text, View } from "react-native";

type Props = {
  streakCount: number;
};

export default function StreakCard({ streakCount }: Props) {
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
      <Text style={{ fontSize: 20, fontWeight: "700" }}>Streak</Text>
      <Text>{streakCount} day streak</Text>
      <Text style={{ color: "#666" }}>
        Basic version for now. We’ll improve this later.
      </Text>
    </View>
  );
}