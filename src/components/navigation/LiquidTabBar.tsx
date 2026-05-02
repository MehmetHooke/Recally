import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import React, { useEffect, useMemo, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@/src/theme/useTheme";
import { Ionicons } from "@expo/vector-icons";

type TabLayoutItem = {
  key: string;
  x: number;
  width: number;
};

function getTabIcon(routeName: string, focused: boolean) {
  switch (routeName) {
    case "index":
      return focused ? "home" : "home-outline";

    case "add":
      return focused ? "sparkles" : "sparkles-outline";

    case "library":
      return focused ? "albums" : "albums-outline";

    case "settings":
      return focused ? "options" : "options-outline";

    default:
      return focused ? "ellipse" : "ellipse-outline";
  }
}

export function LiquidTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors, mode } = useAppTheme();

  const bottom = Math.max(insets.bottom, 12);

  const [tabLayouts, setTabLayouts] = useState<TabLayoutItem[]>([]);

  const x = useSharedValue(0);
  const w = useSharedValue(0);

  const visibleRoutes = useMemo(() => {
    return state.routes.filter((route) => {
      const options: any = descriptors[route.key]?.options;

      if (options?.href === null) return false;
      if (options?.tabBarItemStyle?.display === "none") return false;

      return true;
    });
  }, [state.routes, descriptors]);

  const focusedKey = state.routes[state.index]?.key;

  const isDark = mode === "dark";

  const glassBg = isDark
    ? "rgba(21, 22, 24, 0.72)"
    : "rgba(255, 255, 255, 0.72)";

  const activePillBg = isDark
    ? "rgba(96, 165, 250, 0.22)"
    : "rgba(59, 130, 246, 0.14)";

  const borderColor = isDark
    ? "rgba(255, 255, 255, 0.12)"
    : "rgba(17, 17, 17, 0.08)";

  const SPRING = {
    damping: 28,
    stiffness: 210,
    mass: 0.85,
    overshootClamping: false,
    restDisplacementThreshold: 0.4,
    restSpeedThreshold: 0.4,
  };

  useEffect(() => {
    const layout = tabLayouts.find((item) => item.key === focusedKey);
    if (!layout) return;

    x.value = withSpring(layout.x, SPRING);
    w.value = withSpring(layout.width, SPRING);
  }, [focusedKey, tabLayouts, x, w]);

  const pillStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: x.value }],
      width: w.value,
    };
  });

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        bottom,
        height: 72,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: "100%",
          height: 68,
          borderRadius: 28,
          overflow: "hidden",
          borderWidth: 1,
          borderColor,
          backgroundColor: glassBg,
          shadowColor: "#000",
          shadowOpacity: isDark ? 0.35 : 0.12,
          shadowRadius: 22,
          shadowOffset: { width: 0, height: 12 },
          elevation: 18,
        }}
      >
        <BlurView
          intensity={Platform.OS === "ios" ? 38 : 24}
          tint={isDark ? "dark" : "light"}
          style={{
            flex: 1,
            backgroundColor: glassBg,
            paddingHorizontal: 8,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Animated.View
              pointerEvents="none"
              style={[
                {
                  position: "absolute",
                  top: 8,
                  height: 52,
                  borderRadius: 22,
                  backgroundColor: activePillBg,
                  borderWidth: 1,
                  borderColor: isDark
                    ? "rgba(96, 165, 250, 0.24)"
                    : "rgba(59, 130, 246, 0.18)",
                },
                pillStyle,
              ]}
            />

            {visibleRoutes.map((route) => {
              const { options } = descriptors[route.key];

              const label =
                options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                    ? options.title
                    : route.name;

              const isFocused = focusedKey === route.key;

              const iconName = getTabIcon(route.name, isFocused);

              const onPress = () => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };

              const onLongPress = () => {
                navigation.emit({
                  type: "tabLongPress",
                  target: route.key,
                });
              };

              return (
                <Pressable
                  key={route.key}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  onLayout={(event) => {
                    const { x, width } = event.nativeEvent.layout;

                    setTabLayouts((prev) => {
                      const filtered = prev.filter(
                        (item) => item.key !== route.key
                      );

                      return [...filtered, { key: route.key, x, width }];
                    });
                  }}
                  style={{
                    flex: 1,
                    height: 52,
                    borderRadius: 22,
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                  }}
                >
                  <Ionicons
                    name={iconName as any}
                    size={route.name === "add" ? 20 : 22}
                    color={isFocused ? colors.primary : colors.mutedText}
                  />

                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 11,
                      fontWeight: isFocused ? "900" : "700",
                      color: isFocused ? colors.text : colors.mutedText,
                    }}
                  >
                    {String(label)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </BlurView>
      </View>
    </View>
  );
}