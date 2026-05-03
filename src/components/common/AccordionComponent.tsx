import { Ionicons } from "@expo/vector-icons";
import type React from "react";
import { Image, ImageSourcePropType, Pressable, Text, View } from "react-native";
import Animated, {
    FadeIn,
    FadeOut,
    LinearTransition,
} from "react-native-reanimated";

type SourceAccordionCardProps = {
    title: string;
    description: string;
    iconSource: ImageSourcePropType;
    iconBackgroundColor: string;
    iconBorderColor: string;
    expanded: boolean;
    onPress: () => void;
    children?: React.ReactNode;
    colors: any;
};

export default function SourceAccordionCard({
    title,
    description,
    iconSource,
    iconBackgroundColor,
    iconBorderColor,
    expanded,
    onPress,
    children,
    colors,
}: SourceAccordionCardProps) {
    return (
        <Animated.View
            layout={LinearTransition.springify().damping(45).stiffness(200)}
            style={{
                backgroundColor: colors.card,
                borderRadius: 24,
                borderWidth: 1,
                borderColor: expanded ? colors.softBorder : colors.border,
                padding: 16,
                overflow: "hidden",
            }}
        >
            <Pressable
                onPress={onPress}
                style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    gap: 12,
                }}
            >
                <View
                    style={{
                        width: 54,
                        height: 54,
                        borderRadius: 18,
                        backgroundColor: iconBackgroundColor,
                        borderWidth: 1,
                        borderColor: iconBorderColor,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Image
                        source={iconSource}
                        style={{ width: 28, height: 28, resizeMode: "contain" }}
                    />
                </View>

                <View style={{ flex: 1, paddingTop: 2 }}>
                    <Text
                        style={{
                            color: colors.text,
                            fontSize: 18,
                            lineHeight: 24,
                            fontWeight: "900",
                        }}
                    >
                        {title}
                    </Text>

                    <Text
                        style={{
                            color: colors.mutedText,
                            fontSize: 13,
                            lineHeight: 19,
                            marginTop: 4,
                        }}
                    >
                        {description}
                    </Text>
                </View>

                <View style={{ paddingTop: 6 }}>
                    <Ionicons
                        name={expanded ? "chevron-up" : "chevron-down"}
                        size={18}
                        color={colors.mutedText}
                    />
                </View>
            </Pressable>

            {expanded ? (
                <Animated.View
                    entering={FadeIn.duration(180)}
                    exiting={FadeOut.duration(120)}
                    style={{
                        marginTop: 14,
                        paddingTop: 14,
                        borderTopWidth: 1,
                        borderTopColor: colors.softBorder,
                    }}
                >
                    {children}
                </Animated.View>
            ) : null}
        </Animated.View>
    );
}