import { callTestFunction } from "@/src/services/functions";
import { Button, Text, View } from "react-native";


export default function HomeScreen() {
  const handleTest = async () => {
    try {
      const data = await callTestFunction("merhaba recallly");
      console.log("FUNCTION RESULT:", data);
    } catch (error) {
      console.error("FUNCTION ERROR:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Function Test</Text>
      <Button title="Test Function" onPress={handleTest} />
    </View>
  );
}