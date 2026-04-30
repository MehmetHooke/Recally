import { useAppTheme } from "@/src/theme/useTheme";
import { useTranslation } from "react-i18next";
import { Image, Text, View } from "react-native";

const profilePlaceholder = require("@/src/assets/images/profilePlaceholder.jpg");

type Props = {
    firstName: string;
    lastName: string;
    email: string;
    plan: "free" | "premium";
};

export function ProfileCard({ firstName, lastName, email, plan }: Props) {
    const { colors } = useAppTheme();
    const { t } = useTranslation("tabs");

    const isPremium = plan === "premium";
    const fullName = `${firstName} ${lastName}`.trim();

    return (
        <View
            style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 22,
                padding: 18,
                flexDirection: "row",
                alignItems: "center",
            }}
        >
            <Image
                source={profilePlaceholder}
                style={{
                    width: 76,
                    height: 76,
                    borderRadius: 38,
                    borderWidth: 2,
                    borderColor: colors.primary,
                }}
            />

            <View style={{ marginLeft: 16, flex: 1 }}>
                <Text
                    numberOfLines={1}
                    style={{ color: colors.text, fontSize: 21, fontWeight: "900" }}
                >
                    {fullName || "Recallly User"}
                </Text>

                <Text
                    numberOfLines={1}
                    style={{ color: colors.mutedText, marginTop: 4, fontSize: 13 }}
                >
                    {email}
                </Text>

                <View
                    style={{
                        marginTop: 10,
                        alignSelf: "flex-start",
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        borderRadius: 999,
                        backgroundColor: isPremium ? "#22c55e30" : colors.background,
                        borderWidth: 1,
                        borderColor: isPremium ? "#22c55e" : colors.border,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 11,
                            fontWeight: "900",
                            color: isPremium ? "#22c55e" : colors.mutedText,
                        }}
                    >
                        {isPremium ? t("settings.premium.premiumPlan") : t("settings.premium.freePlan")}
                    </Text>
                </View>
            </View>
        </View>
    );
}