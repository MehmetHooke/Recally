import type { AppAlertPayload, AppAlertType } from "@/src/context/AppAlertContext";
import { useAppTheme } from "@/src/theme/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  alert: (AppAlertPayload & { id: number }) | null;
  visible: boolean;
  onDismiss: () => void;
  onHidden: () => void;
};
type AlertTypeMeta = {
  icon: keyof typeof Ionicons.glyphMap;
  accent: string;
  softBackground: string;
};

function getTypeMeta(type: AppAlertType): AlertTypeMeta {
  switch (type) {
    case "success":
      return {
        icon: "checkmark-circle",
        accent: "#16A34A",
        softBackground: "rgba(22,163,74,0.12)",
      };
    case "error":
      return {
        icon: "close-circle",
        accent: "#EF4444",
        softBackground: "rgba(239,68,68,0.12)",
      };
    case "warning":
      return {
        icon: "warning",
        accent: "#F59E0B",
        softBackground: "rgba(245,158,11,0.12)",
      };
    case "info":
    default:
      return {
        icon: "information-circle",
        accent: "#3B82F6",
        softBackground: "rgba(59,130,246,0.12)",
      };
  }
}

export function AppAlert({ alert, visible, onDismiss, onHidden }: Props) {
  const { colors, mode } = useAppTheme();
  const { t } = useTranslation("common");
  const insets = useSafeAreaInsets();

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-18)).current;
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!alert) {
      return;
    }

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    if (visible) {
      opacity.setValue(0);
      translateY.setValue(-18);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 260,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

      return;
    }

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -12,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (!finished) {
        return;
      }

      hideTimeoutRef.current = setTimeout(() => {
        onHidden();
      }, 10);
    });
  }, [alert, visible, onHidden, opacity, translateY]);

  const typeMeta = useMemo(
    () => (alert ? getTypeMeta(alert.type) : null),
    [alert],
  );

  if (!alert || !typeMeta) {
    return null;
  }

  const hasPrimaryAction = !!(
    alert.primaryActionLabel && alert.onPrimaryAction
  );

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <Animated.View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 16,
          justifyContent: "center",
          paddingRight: 16,
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 12,
          opacity,
          transform: [{ translateY }],
          zIndex: 9999,
        }}
      >
        <View
          style={{
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 20,
            padding: 14,
            shadowColor: "#000000",
            shadowOpacity: mode === "dark" ? 0.3 : 0.12,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 8 },
            elevation: 10,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: typeMeta.softBackground,
              }}
            >
              <Ionicons
                name={typeMeta.icon}
                size={22}
                color={typeMeta.accent}
              />
            </View>

            <View style={{ flex: 1, gap: 4 }}>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 16,
                  fontWeight: "900",
                }}
              >
                {alert.title}
              </Text>

              {alert.message ? (
                <Text
                  style={{
                    color: colors.mutedText,
                    fontSize: 14,
                    lineHeight: 20,
                  }}
                >
                  {alert.message}
                </Text>
              ) : null}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 4,
                }}
              >
                {hasPrimaryAction ? (
                  <Pressable
                    onPress={() => {
                      alert.onPrimaryAction?.();
                      onDismiss();
                    }}
                    style={{
                      backgroundColor: typeMeta.accent,
                      borderRadius: 999,
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontSize: 13,
                        fontWeight: "900",
                      }}
                    >
                      {alert.primaryActionLabel}
                    </Text>
                  </Pressable>
                ) : null}

                <Pressable
                  onPress={onDismiss}
                  style={{
                    paddingHorizontal: 6,
                    paddingVertical: 8,
                  }}
                >
                  <Text
                    style={{
                      color: typeMeta.accent,
                      fontSize: 13,
                      fontWeight: "800",
                    }}
                  >
                    {t("alert.dismiss")}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
