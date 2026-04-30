import { useAppTheme } from "@/src/theme/useTheme";
import { useState } from "react";
import {
    LayoutAnimation,
    Pressable,
    Text,
    View,
} from "react-native";

type Props = {
    title: string;
    children: React.ReactNode;
};

export function SettingsAccordion({ title, children }: Props) {
    const { colors } = useAppTheme();
    const [open, setOpen] = useState(false);

    const toggle = () => {
        LayoutAnimation.configureNext({
            duration: 420,
            create: {
                type: LayoutAnimation.Types.easeInEaseOut,
                property: LayoutAnimation.Properties.opacity,
            },
            update: {
                type: LayoutAnimation.Types.easeInEaseOut,
            },
            delete: {
                type: LayoutAnimation.Types.easeInEaseOut,
                property: LayoutAnimation.Properties.opacity,
            },
        });

        setOpen((prev) => !prev);
    };

    return (
        <View
            style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 16,
                padding: 16,
                overflow: "hidden",
            }}
        >
            <Pressable
                onPress={toggle}
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Text style={{ color: colors.text, fontWeight: "800", fontSize: 16 }}>
                    {title}
                </Text>

                <Text style={{ color: colors.mutedText, fontWeight: "900" }}>
                    {open ? "−" : "+"}
                </Text>
            </Pressable>

            <View
                style={{
                    marginTop: open ? 14 : 0,
                    height: open ? undefined : 0,
                    opacity: open ? 1 : 0,
                    overflow: "hidden",
                }}
            >
                {children}
            </View>
        </View>
    );
}