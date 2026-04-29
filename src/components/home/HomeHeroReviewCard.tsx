
import { useAppTheme } from "@/src/theme/useTheme";
import { useTranslation } from "react-i18next";
import { Image, Pressable, Text, View } from "react-native";

type Props = {
    dueCards: number;
    streakCount: number;
    onPrimaryPress: () => void;
    onCreatePress: () => void;
};

export function HomeHeroReviewCard({
    dueCards,
    streakCount,
    onPrimaryPress,
    onCreatePress,
}: Props) {
    const { colors } = useAppTheme();
    const { t } = useTranslation("tabs");


    const hasDue = dueCards > 0;
    const hasStreak = streakCount > 0;

    return (
        <View
            style={{
                backgroundColor: colors.primary,
                borderRadius: 24,
                padding: 20,
                gap: 14,
            }}
        >
            <View style={{ gap: 8 }}>
                <Text
                    style={{
                        color: colors.primaryForeground,
                        fontSize: 22,
                        fontWeight: "900",
                    }}
                >
                    {hasDue
                        ? t("home.hero.title.hasDue")
                        : t("home.hero.title.noDue")}
                </Text>

                <View
                    style={{
                        alignSelf: "flex-start",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                        backgroundColor: "rgba(255,255,255,0.18)",
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 999,
                    }}
                >
                    <Image
                        source={require("@/src/assets/images/flame.png")}
                        style={{
                            width: 16, 
                            height: 20,
                            resizeMode: "cover",
                        }}
                    />

                    <Text
                        style={{
                            color: colors.primaryForeground,
                            fontSize: 13,
                            fontWeight: "900",
                        }}
                    >
                        {hasStreak
                            ? t("home.hero.streak", { count: streakCount })
                            : t("home.hero.startStreak")}
                    </Text>
                </View>
            </View>

            <View>
                <Text
                    style={{
                        color: colors.primaryForeground,
                        fontSize: 44,
                        fontWeight: "900",
                    }}
                >
                    {dueCards}
                </Text>

                <Text
                    style={{
                        color: colors.primaryForeground,
                        fontSize: 15,
                        lineHeight: 21,
                        opacity: 0.92,
                    }}
                >
                    {hasDue
                        ? t("home.hero.description.hasDue")
                        : t("home.hero.description.noDue")}
                </Text>
            </View>

            <Pressable
                onPress={hasDue ? onPrimaryPress : onCreatePress}
                style={{
                    backgroundColor: colors.primaryForeground,
                    paddingVertical: 15,
                    borderRadius: 16,
                    alignItems: "center",
                    marginTop: 2,
                }}
            >
                <Text
                    style={{
                        color: colors.primary,
                        fontWeight: "900",
                        fontSize: 15,
                    }}
                >
                    {hasDue
                        ? t("home.hero.primaryButton")
                        : t("home.hero.createButton")}
                </Text>
            </Pressable>
        </View>
    );
}