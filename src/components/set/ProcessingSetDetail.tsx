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

export function ProcessingSetDetail({ set }: { set: StudySet }) {
  const { colors } = useAppTheme();
  const { t } = useTranslation("set");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const progressPercent = useMemo(() => {
    if (elapsedSeconds <= 30) {
      return 8 + (elapsedSeconds / 30) * 62; // 8 -> 70
    }

    if (elapsedSeconds <= 90) {
      return 70 + ((elapsedSeconds - 30) / 60) * 25; // 70 -> 95
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
        paddingTop:40
      }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 28,
          padding: 22,
          gap: 18,
        }}
      >
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 18,
            backgroundColor: "rgba(239,68,68,0.10)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("@/src/assets/images/youtube.png")}
            style={{ width: 28, height: 28, resizeMode: "contain" }}
          />
        </View>

        <View style={{ gap: 8 }}>
          <Text style={{ color: colors.text, fontSize: 25, fontWeight: "900" }}>
            {t("detail.processing.title")}
          </Text>

          <Text style={{ color: colors.mutedText, lineHeight: 21 }}>
            {t("detail.processing.description")}
          </Text>
        </View>

        <View
          style={{
            backgroundColor: colors.background,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 18,
            padding: 14,
            gap: 12,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons name="time-outline" color={colors.primary} size={18} />
            <Text style={{ color: colors.text, fontWeight: "800", flex: 1 }}>
              {statusMessage}
            </Text>
          </View>

          <View
            style={{
              height: 10,
              borderRadius: 999,
              backgroundColor: "rgba(148,163,184,0.18)",
              overflow: "hidden",
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
          </View>
        </View>

        <View style={{ gap: 10 }}>
          <TrustRow
            icon={
              <Ionicons
                name="sparkles-outline"
                color={colors.primary}
                size={16}
              />
            }
            text={t("detail.processing.trustRows.compress")}
          />
          <TrustRow
            icon={
              <Ionicons name="bulb-outline" color={colors.primary} size={16} />
            }
            text={t("detail.processing.trustRows.mainIdeas")}
          />
          <TrustRow
            icon={
              <Ionicons
                name="checkmark-done-outline"
                color={colors.primary}
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
        icon={<Ionicons name="bulb-outline" color={colors.primary} size={18} />}
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
            color={colors.primary}
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
              <Text style={{ color: colors.mutedText }}>{option})</Text>
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
      <View style={{ marginTop: 2 }}>{icon}</View>
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
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 22,
        padding: 18,
        gap: 14,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        {icon}
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
  return (
    <ShimmerBox
      width={width}
      height={height}
      borderRadius={999}
    />
  );
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
      <ShimmerBox width={110} height={34} borderRadius={999}>
        <Text
          style={{
            color: colors.text,
            opacity: 0.35,
            paddingHorizontal: 12,
            paddingVertical: 8,
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
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ).start();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-260, 320],
  });

  return (
    <View
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: "rgba(148,163,184,0.16)",
        overflow: "hidden",
        justifyContent: "center",
      }}
    >
      {children}

      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: -height,
          bottom: -height,
          width: 180,
          transform: [{ translateX }, { rotate: "12deg" }],
          opacity: 0.55,
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(255,255,255,0.10)",
          }}
        />

        <View
          style={{
            position: "absolute",
            left: 45,
            top: 0,
            bottom: 0,
            width: 90,
            backgroundColor: "rgba(255,255,255,0.22)",
            borderRadius: 999,
          }}
        />

        <View
          style={{
            position: "absolute",
            left: 72,
            top: 0,
            bottom: 0,
            width: 36,
            backgroundColor: "rgba(255,255,255,0.32)",
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
        backgroundColor: "rgba(15,23,42,0.08)",
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 6,
      }}
    >
      <Text
        style={{
          color: colors.text,
          fontSize: 12,
          fontWeight: "800",
          opacity: 0.7,
        }}
      >
        {label}
      </Text>
    </View>
  );
}