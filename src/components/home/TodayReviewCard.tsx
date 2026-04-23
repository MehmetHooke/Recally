import { Button, Text, View } from "react-native";

type Props = {
  dueCount: number;
  onStartReview: () => void;
};

export default function TodayReviewCard({ dueCount, onStartReview }: Props) {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 16,
        padding: 16,
        gap: 10,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "700" }}>Today’s Review</Text>
      <Text>{dueCount} cards due today</Text>
      <Button
        title={dueCount > 0 ? "Start Review" : "No Cards Due"}
        onPress={onStartReview}
        disabled={dueCount === 0}
      />
    </View>
  );
}