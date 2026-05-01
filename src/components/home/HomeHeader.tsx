import { useAppTheme } from "@/src/theme/useTheme";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

type Props = {
  userName: string;
};

export function HomeHeader({ userName }: Props) {
  const { colors } = useAppTheme();
  const { t } = useTranslation("tabs");

  return (
    <View>
      <Text style={{ color: colors.mutedText, fontSize: 15, fontWeight: "600" }}>
        {t("home.welcome", { name: userName })}
      </Text>

      <Text
        style={{
          color: colors.text,
          fontSize: 30,
          fontWeight: "900",
          marginTop: 4,
          letterSpacing: -0.6,
        }}
      >
        {t("home.title")}
      </Text>
    </View>
  );
}