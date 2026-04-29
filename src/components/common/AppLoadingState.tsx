import { useAppTheme } from "@/src/theme/useTheme";
import LottieView from "lottie-react-native";
import { useTranslation } from "react-i18next";

import { Text, View } from "react-native";

type Props = {
    title?: string;
    description?: string;
};

export function AppLoadingState({ title, description }: Props) {
    const { colors } = useAppTheme();
    const {t} = useTranslation("common")


    return (
        <View
            style={{
                flex: 1,
                backgroundColor: colors.background,
                justifyContent: "center",
                alignItems: "center",
                padding: 24,
            }}
        >
            <LottieView
                source={require("@/src/assets/animations/loadingAnim.json")}
                autoPlay
                loop
                style={{
                    width: 180,
                    height: 180,
                }}
            />

            {title ? (
                <Text
                    style={{
                        color: colors.primary,
                        fontSize: 22,
                        fontWeight: "900",
                        marginTop: 12,
                        textAlign: "center",
                    }}
                >
                    {title}
                </Text>
            ) :
                <Text
                    style={{
                        color: colors.primary,
                        fontSize: 22,
                        fontWeight: "900",
                        marginTop: 12,
                        textAlign: "center",
                    }}
                >
                    {t("loading")}
                </Text>
            }

            {description ? (
                <Text
                    style={{
                        color: colors.mutedText,
                        fontSize: 14,
                        lineHeight: 20,
                        marginTop: 6,
                        textAlign: "center",
                    }}
                >
                    {description}
                </Text>
            ) : null}
        </View>
    );
}