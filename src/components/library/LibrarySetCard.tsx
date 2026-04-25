import { getSummaryPreview, SetItem } from "@/src/services/setService";
import { useAppTheme } from "@/src/theme/useTheme";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { MiniBadge } from "./MiniBadge";

type Props = {
    item: SetItem;
    onPress: () => void;
};

export function LibrarySetCard({ item, onPress }: Props) {
    const { colors } = useAppTheme();

    const total = item.totalCards ?? 0;
    const due = item.dueCount ?? 0;
    const mastered = item.masteredCount ?? 0;
    const itemProgress = total > 0 ? Math.round((mastered / total) * 100) : 0;
    const summaryPreview = getSummaryPreview(item.summary) || item.sourceText;

    const iconSource =
        item.sourceType === "youtube"
            ? require("@/src/assets/images/youtube.png")
            : require("@/src/assets/images/textBook.png");

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.85}
            style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 18,
                padding: 16,
                gap: 12,
            }}
        >
            <View>
                <Text
                    style={{
                        color: colors.text,
                        fontSize: 18,
                        fontWeight: "900",
                    }}
                    numberOfLines={1}
                >
                    {item.title}
                </Text>

                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
                    <Image
                        source={iconSource}
                        style={{
                            width: 22,
                            height: 22,
                            marginRight: 5,
                            resizeMode: "contain",
                        }}
                    />

                    <Text
                        style={{
                            color: colors.mutedText,
                            fontSize: 13,
                            fontWeight: "700",
                        }}
                    >
                        {item.sourceType === "youtube" ? "YouTube Video" : "Text content"}
                    </Text>
                </View>
            </View>

            <Text
                numberOfLines={2}
                style={{
                    color: colors.mutedText,
                    fontSize: 14,
                    lineHeight: 20,
                }}
            >
                {summaryPreview}
            </Text>

            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                <MiniBadge label={`${total} cards`} />
                <MiniBadge label={`${due} due`} />
                <MiniBadge label={`${itemProgress}% mastered`} />
            </View>

            <View
                style={{
                    height: 8,
                    backgroundColor: colors.border,
                    borderRadius: 999,
                    overflow: "hidden",
                }}
            >
                <View
                    style={{
                        width: `${itemProgress}%`,
                        height: "100%",
                        backgroundColor: colors.primary,
                        borderRadius: 999,
                    }}
                />
            </View>

            <Text
                style={{
                    color: colors.primary,
                    fontWeight: "900",
                    marginTop: 2,
                }}
            >
                Özeti oku ve test et →
            </Text>
        </TouchableOpacity>
    );
}