import { useAppTheme } from "@/src/theme/useTheme";
import type { ImageSourcePropType } from "react-native";
import { Image, Text, View } from "react-native";

type Props = {
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
};

export function OnboardingSlide({ title, subtitle, image }: Props) {
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-between",
        paddingBottom: 24,
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={image}
          style={{
            width: "100%",
            height: 500,
          }}
          resizeMode="contain"
        />
      </View>

      <View
        style={{
          minHeight: 118,
          justifyContent: "flex-end",
        }}
      >
        <Text
          style={{
            color: colors.text,
            fontSize: 32,
            fontWeight: "900",
            lineHeight: 38,
            textAlign: "center",
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            color: colors.mutedText,
            fontSize: 16,
            lineHeight: 23,
            marginTop: 10,
            textAlign: "center",
          }}
        >
          {subtitle}
        </Text>
      </View>
    </View>
  );
}