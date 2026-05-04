import { Ionicons } from "@expo/vector-icons";
import type React from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

type Props = {
  title: string;
  description: string;
  iconSource?: ImageSourcePropType;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconBackgroundColor: string;
  iconBorderColor: string;
  expanded: boolean;
  onPress: () => void;
  children: React.ReactNode;
  colors: any;
};

export function SettingsSectionAccordion({
  title,
  description,
  iconSource,
  iconName,
  iconColor,
  iconBackgroundColor,
  iconBorderColor,
  expanded,
  onPress,
  children,
  colors,
}: Props) {
  return (
    <Animated.View
      layout={LinearTransition.springify().damping(45).stiffness(200)}
      style={{
        backgroundColor: colors.card,
        borderRadius: 22,
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
          alignItems: "center",
          gap: 12,
        }}
      >
        <View
          style={{
            width: 52,
            height: 52,
            borderRadius: 18,
            backgroundColor: iconBackgroundColor,
            borderWidth: 1,
            borderColor: iconBorderColor,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {iconSource ? (
            <Image
              source={iconSource}
              style={{
                width: 45,
                height: 45,
                resizeMode: "contain",
              }}
            />
          ) : iconName ? (
            <Ionicons
              name={iconName}
              size={24}
              color={iconColor || colors.primary}
            />
          ) : null}
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: colors.text,
              fontSize: 17,
              fontWeight: "900",
              lineHeight: 23,
            }}
          >
            {title}
          </Text>

          <Text
            style={{
              color: colors.mutedText,
              fontSize: 13,
              lineHeight: 18,
              marginTop: 3,
            }}
          >
            {description}
          </Text>
        </View>

        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color={colors.mutedText}
        />
      </Pressable>

      {expanded ? (
        <View
          style={{
            marginTop: 14,
            paddingTop: 14,
            borderTopWidth: 1,
            borderTopColor: colors.softBorder,
          }}
        >
          {children}
        </View>
      ) : null}
    </Animated.View>
  );
}