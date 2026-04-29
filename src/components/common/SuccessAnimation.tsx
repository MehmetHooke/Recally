import { useAppTheme } from "@/src/theme/useTheme";
import LottieView from "lottie-react-native";
import { View } from "react-native";

type Props = {
  transparent?: boolean;
};

export function SuccessAnimation({ transparent = false }: Props) {
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: transparent ? "transparent" : colors.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LottieView
        source={require("@/src/assets/animations/success.json")}
        autoPlay
        loop={false}
        style={{ width: 220, height: 220 }}
      />
    </View>
  );
}