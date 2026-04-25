import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "@/src/theme/useTheme";
import type { StudySet } from "@/src/types/study-set";
import { useEffect, useMemo, useState } from "react";
import type { DimensionValue } from "react-native";
import { Image, Text, View } from "react-native";

function getProcessingMessage(seconds: number) {
  if (seconds < 10) return "Video baglantisi kontrol ediliyor...";
  if (seconds < 25) return "Videodaki ana fikirler cikariliyor...";
  if (seconds < 45) return "Ozet ogrenilebilir parcalara ayriliyor...";
  if (seconds < 65) return "Quiz sorulari hazirlaniyor...";
  if (seconds < 85) return "Cevaplar ve aciklamalar kontrol ediliyor...";
  return "Video uzun oldugu icin biraz daha suruyor. Setin hazirlaniyor...";
}

export function ProcessingSetDetail({ set }: { set: StudySet }) {
  const { colors } = useAppTheme();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const startedAt =
      set.createdAt && typeof set.createdAt?.toDate === "function"
        ? set.createdAt.toDate().getTime()
        : Date.now();

    const updateElapsed = () => {
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startedAt) / 1000)));
    };

    updateElapsed();

    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [set.createdAt]);

  const statusMessage = useMemo(
    () => getProcessingMessage(elapsedSeconds),
    [elapsedSeconds]
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
        gap: 16,
      }}
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
          <Text
            style={{
              color: colors.text,
              fontSize: 25,
              fontWeight: "900",
            }}
          >
            Video ogrenme setine donusturuluyor
          </Text>

          <Text
            style={{
              color: colors.mutedText,
              lineHeight: 21,
            }}
          >
            Uzun videolarda bu islem 1-2 dakika surebilir.
          </Text>
        </View>

        <View
          style={{
            backgroundColor: colors.background,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 18,
            padding: 14,
            gap: 10,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons name="time-outline" color={colors.primary} size={18} />
            <Text style={{ color: colors.text, fontWeight: "800" }}>
              {statusMessage}
            </Text>
          </View>
          <Text style={{ color: colors.mutedText }}>{elapsedSeconds} sn</Text>
        </View>

        <View style={{ gap: 10 }}>
          <TrustRow
            icon={<Ionicons name="sparkles-outline" color={colors.primary} size={16} />}
            text="1 saatlik videoyu birkac dakikalik ogrenme setine sikistiriyoruz."
          />
          <TrustRow
            icon={<Ionicons name="bulb-outline" color={colors.primary} size={16} />}
            text="Sorular sadece ozetten degil, videodaki ana fikirlerden hazirlaniyor."
          />
          <TrustRow
            icon={
              <Ionicons
                name="checkmark-done-outline"
                color={colors.primary}
                size={16}
              />
            }
            text="Yanlis secenekler bile ogretici olacak sekilde kontrol ediliyor."
          />
        </View>
      </View>

      <SkeletonCard
        title="Ozet hazirlaniyor"
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
        title="Ana kavramlar seciliyor"
        icon={<Ionicons name="bulb-outline" color={colors.primary} size={18} />}
      >
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {["Type Coercion", "Scope", "Promises", "Event Loop", "Closures"].map(
            (item) => (
              <View
                key={item}
                style={{
                  backgroundColor: "rgba(148,163,184,0.18)",
                  borderRadius: 999,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  opacity: 0.45,
                }}
              >
                <Text style={{ color: colors.text }}>{item}</Text>
              </View>
            )
          )}
        </View>
        <OverlayLabel label="AI hazirliyor" />
      </SkeletonCard>

      <SkeletonCard
        title="Quiz on izlemesi"
        icon={
          <Ionicons
            name="checkmark-done-outline"
            color={colors.primary}
            size={18}
          />
        }
      >
        <Text
          style={{
            color: colors.text,
            opacity: 0.5,
            fontWeight: "800",
          }}
        >
          Question loading...
        </Text>
        <View style={{ gap: 10 }}>
          {["A", "B", "C", "D"].map((option) => (
            <View
              key={option}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Text style={{ color: colors.mutedText }}>{option})</Text>
              <SkeletonLine width="78%" />
            </View>
          ))}
        </View>
        <OverlayLabel label="AI hazirliyor" />
      </SkeletonCard>
    </View>
  );
}

function TrustRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  const { colors } = useAppTheme();

  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
      <View style={{ marginTop: 2 }}>{icon}</View>
      <Text
        style={{
          flex: 1,
          color: colors.mutedText,
          lineHeight: 20,
        }}
      >
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
        <Text
          style={{
            color: colors.text,
            fontSize: 17,
            fontWeight: "900",
          }}
        >
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
}

function SkeletonLine({ width }: { width: DimensionValue }) {
  return (
    <View
      style={{
        width,
        height: 12,
        borderRadius: 999,
        backgroundColor: "rgba(148,163,184,0.22)",
        opacity: 0.9,
      }}
    />
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
