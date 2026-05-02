import { useAppTheme } from "@/src/theme/useTheme";
import type { StudySet } from "@/src/types/study-set";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { DimensionValue } from "react-native";
import { Animated, Easing, Image, ScrollView, Text, View } from "react-native";

function getProcessingMessage(seconds: number, t: (key: string) => string) {
  if (seconds < 10) return t("detail.processing.steps.checkingConnection");
  if (seconds < 25) return t("detail.processing.steps.extractingIdeas");
  if (seconds < 45) return t("detail.processing.steps.splittingSummary");
  if (seconds < 65) return t("detail.processing.steps.creatingQuiz");
  if (seconds < 85) return t("detail.processing.steps.checkingAnswers");
  return t("detail.processing.steps.takingLonger");
}

function alpha(hex: string, opacity: number) {
  if (!hex.startsWith("#")) return hex;

  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);

  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r},${g},${b},${opacity})`;
}

export function ProcessingSetDetail({ set }: { set: StudySet }) {
  const { colors } = useAppTheme();
  const { t } = useTranslation("set");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const progressPercent = useMemo(() => {
    if (elapsedSeconds <= 30) {
      return 8 + (elapsedSeconds / 30) * 62;
    }

    if (elapsedSeconds <= 90) {
      return 70 + ((elapsedSeconds - 30) / 60) * 25;
    }

    return 95;
  }, [elapsedSeconds]);

  useEffect(() => {
    const startedAt =
      set.createdAt && typeof set.createdAt?.toDate === "function"
        ? set.createdAt.toDate().getTime()
        : Date.now();

    const updateElapsed = () => {
      setElapsedSeconds(
        Math.max(0, Math.floor((Date.now() - startedAt) / 1000))
      );
    };

    updateElapsed();

    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [set.createdAt]);

  const statusMessage = useMemo(
    () => getProcessingMessage(elapsedSeconds, t),
    [elapsedSeconds, t]
  );

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
      contentContainerStyle={{
        padding: 20,
        gap: 16,
        paddingBottom: 32,
        paddingTop: 40,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          backgroundColor: colors.card,
          borderColor: colors.softBorder,
          borderWidth: 1,
          borderRadius: 30,
          padding: 22,
          gap: 18,
          shadowColor: colors.aiGlow,
          shadowOpacity: 0.14,
          shadowRadius: 22,
          shadowOffset: { width: 0, height: 10 },
          elevation: 4,
          overflow: "hidden",
        }}
      >
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: -70,
            right: -70,
            width: 180,
            height: 180,
            borderRadius: 999,
            backgroundColor: alpha(colors.aiGlow, 0.1),
          }}
        />

        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            bottom: -90,
            left: -80,
            width: 220,
            height: 220,
            borderRadius: 999,
            backgroundColor: alpha(colors.primary, 0.08),
          }}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
          }}
        >
          <View
            style={{
              width: 58,
              height: 58,
              borderRadius: 20,
              backgroundColor: colors.dangerSoft,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: alpha(colors.danger, 0.18),
            }}
          >
            <Image
              source={require("@/src/assets/images/youtube.png")}
              style={{ width: 29, height: 29, resizeMode: "contain" }}
            />
          </View>

          <View
            style={{
              borderRadius: 999,
              backgroundColor: colors.primarySoft,
              borderWidth: 1,
              borderColor: colors.softBorder,
              paddingHorizontal: 12,
              paddingVertical: 7,
              flexDirection: "row",
              alignItems: "center",
              gap: 7,
            }}
          >
            <Ionicons name="sparkles" color={colors.aiGlow} size={14} />
            <Text
              style={{
                color: colors.primary,
                fontSize: 12,
                fontWeight: "900",
              }}
            >
              AI
            </Text>
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <Text
            style={{
              color: colors.text,
              fontSize: 26,
              fontWeight: "900",
              letterSpacing: -0.5,
            }}
          >
            {t("detail.processing.title")}
          </Text>

          <Text
            style={{
              color: colors.mutedText,
              lineHeight: 22,
              fontSize: 14.5,
            }}
          >
            {t("detail.processing.description")}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: colors.elevatedCard,
            borderColor: colors.softBorder,
            borderWidth: 1,
            borderRadius: 22,
            padding: 15,
            gap: 13,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 9 }}>
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 999,
                backgroundColor: colors.primarySoft,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="time-outline" color={colors.primary} size={17} />
            </View>

            <Text
              style={{
                color: colors.text,
                fontWeight: "900",
                flex: 1,
                lineHeight: 20,
              }}
            >
              {statusMessage}
            </Text>

            <Text
              style={{
                color: colors.subtleText,
                fontSize: 12,
                fontWeight: "800",
              }}
            >
              {Math.round(progressPercent)}%
            </Text>
          </View>

          <View
            style={{
              height: 11,
              borderRadius: 999,
              backgroundColor: colors.progressTrack,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: alpha(colors.primary, 0.08),
            }}
          >
            <View
              style={{
                width: `${progressPercent}%`,
                height: "100%",
                borderRadius: 999,
                backgroundColor: colors.primary,
              }}
            />

            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${progressPercent}%`,
                backgroundColor: alpha(colors.aiGlow, 0.18),
              }}
            />
          </View>
        </View>

        <View style={{ gap: 10 }}>
          <TrustRow
            icon={
              <Ionicons
                name="sparkles-outline"
                color={colors.aiGlow}
                size={16}
              />
            }
            text={t("detail.processing.trustRows.compress")}
          />
          <TrustRow
            icon={
              <Ionicons name="bulb-outline" color={colors.warning} size={16} />
            }
            text={t("detail.processing.trustRows.mainIdeas")}
          />
          <TrustRow
            icon={
              <Ionicons
                name="checkmark-done-outline"
                color={colors.success}
                size={16}
              />
            }
            text={t("detail.processing.trustRows.answers")}
          />
        </View>
      </View>

      <SkeletonCard
        title={t("detail.processing.skeleton.summaryTitle")}
        icon={
          <Ionicons
            name="document-text-outline"
            color={colors.primary}
            size={18}
          />
        }
      >
        <SkeletonLine width="92%" />
        <SkeletonLine width="86%" />
        <SkeletonLine width="72%" />
      </SkeletonCard>

      <SkeletonCard
        title={t("detail.processing.skeleton.conceptsTitle")}
        icon={<Ionicons name="bulb-outline" color={colors.warning} size={18} />}
      >
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {["Type Coercion", "Scope", "Promises", "Event Loop", "Closures"].map(
            (item) => (
              <SkeletonChip key={item} text={item} />
            )
          )}
        </View>

        <OverlayLabel label={t("detail.processing.aiPreparing")} />
      </SkeletonCard>

      <SkeletonCard
        title={t("detail.processing.skeleton.quizPreviewTitle")}
        icon={
          <Ionicons
            name="checkmark-done-outline"
            color={colors.success}
            size={18}
          />
        }
      >
        <SkeletonLine width="70%" height={16} />

        <View style={{ gap: 10 }}>
          {["A", "B", "C", "D"].map((option) => (
            <View
              key={option}
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Text
                style={{
                  color: colors.subtleText,
                  fontWeight: "800",
                  width: 18,
                }}
              >
                {option})
              </Text>
              <SkeletonLine width="78%" />
            </View>
          ))}
        </View>

        <OverlayLabel label={t("detail.processing.aiPreparing")} />
      </SkeletonCard>
    </ScrollView>
  );
}

function TrustRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  const { colors } = useAppTheme();

  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
      <View
        style={{
          marginTop: 2,
          width: 24,
          height: 24,
          borderRadius: 999,
          backgroundColor: colors.primarySoft,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </View>

      <Text style={{ flex: 1, color: colors.mutedText, lineHeight: 20 }}>
        {text}
      </Text>
    </View>
  );
}

function SkeletonCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderColor: colors.softBorder,
        borderWidth: 1,
        borderRadius: 24,
        padding: 18,
        gap: 14,
        position: "relative",
        overflow: "hidden",
        shadowColor: colors.primary,
        shadowOpacity: 0.06,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 2,
      }}
    >
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 120,
          height: 120,
          borderRadius: 999,
          backgroundColor: alpha(colors.aiGlow, 0.06),
        }}
      />

      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 999,
            backgroundColor: colors.primarySoft,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </View>

        <Text style={{ color: colors.text, fontSize: 17, fontWeight: "900" }}>
          {title}
        </Text>
      </View>

      {children}
    </View>
  );
}

function SkeletonLine({
  width,
  height = 12,
}: {
  width: DimensionValue;
  height?: number;
}) {
  return <ShimmerBox width={width} height={height} borderRadius={999} />;
}

function SkeletonChip({ text }: { text: string }) {
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        borderRadius: 999,
        overflow: "hidden",
      }}
    >
      <ShimmerBox width={112} height={35} borderRadius={999}>
        <Text
          style={{
            color: colors.text,
            opacity: 0.38,
            paddingHorizontal: 12,
            paddingVertical: 8,
            fontWeight: "800",
          }}
        >
          {text}
        </Text>
      </ShimmerBox>
    </View>
  );
}

function ShimmerBox({
  width,
  height,
  borderRadius,
  children,
}: {
  width: DimensionValue;
  height: number;
  borderRadius: number;
  children?: React.ReactNode;
}) {
  const { colors } = useAppTheme();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1900,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    );

    animation.start();

    return () => animation.stop();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-240, 320],
  });

  return (
    <View
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: colors.primarySoft,
        overflow: "hidden",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: alpha(colors.primary, 0.06),
      }}
    >
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: alpha(colors.elevatedCard, 0.62),
        }}
      />

      {children}

      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: -height * 1.5,
          bottom: -height * 1.5,
          width: 180,
          transform: [{ translateX }, { rotate: "10deg" }],
          opacity: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: alpha(colors.aiGlow, 0.08),
          }}
        />

        <View
          style={{
            position: "absolute",
            left: 42,
            top: 0,
            bottom: 0,
            width: 96,
            backgroundColor: alpha(colors.aiGlow, 0.18),
            borderRadius: 999,
          }}
        />

        <View
          style={{
            position: "absolute",
            left: 72,
            top: 0,
            bottom: 0,
            width: 38,
            backgroundColor: alpha(colors.primary, 0.22),
            borderRadius: 999,
          }}
        />
      </Animated.View>
    </View>
  );
}

function OverlayLabel({ label }: { label: string }) {
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        position: "absolute",
        right: 16,
        bottom: 16,
        backgroundColor: colors.primarySoft,
        borderColor: colors.softBorder,
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 6,
      }}
    >
      <Text
        style={{
          color: colors.primary,
          fontSize: 12,
          fontWeight: "900",
        }}
      >
        {label}
      </Text>
    </View>
  );
}