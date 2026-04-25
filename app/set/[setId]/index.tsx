import type { GeneratedSummary } from "@/src/services/functions";
import {
    getSetById,
    getSetCardsStats,
    type SetItem,
} from "@/src/services/setService";
import { useAppTheme } from "@/src/theme/useTheme";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";

type Stats = {
  totalCards: number;
  dueCards: number;
};

function isStructuredSummary(summary: SetItem["summary"]): summary is GeneratedSummary {
  return !!summary && typeof summary !== "string";
}

export default function SetDetailScreen() {
  const { setId } = useLocalSearchParams<{ setId: string }>();
  const { colors } = useAppTheme();

  const [setData, setSetData] = useState<SetItem | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!setId || typeof setId !== "string") return;

    const loadSetDetail = async () => {
      try {
        setLoading(true);

        const [setResult, statsResult] = await Promise.all([
          getSetById(setId),
          getSetCardsStats(setId),
        ]);

        setSetData(setResult);
        setStats(statsResult);
      } catch (error) {
        console.error("SET DETAIL ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSetDetail();
  }, [setId]);

  const handleStartReview = () => {
    if (!setId || typeof setId !== "string") return;
    router.push(`/set/${setId}/review`);
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!setData) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
          gap: 12,
        }}
      >
        <Text style={{ color: colors.text, fontWeight: "800" }}>
          Set bulunamadı.
        </Text>

        <Pressable
          onPress={() => router.back()}
          style={{
            backgroundColor: colors.primary,
            paddingVertical: 13,
            paddingHorizontal: 18,
            borderRadius: 14,
          }}
        >
          <Text
            style={{
              color: colors.primaryForeground,
              fontWeight: "800",
            }}
          >
            Geri dön
          </Text>
        </Pressable>
      </View>
    );
  }

  const summary = setData.summary;
  const structuredSummary = isStructuredSummary(summary) ? summary : null;
  const plainSummary = typeof summary === "string" ? summary : null;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 120,
        gap: 16,
      }}
    >
      <View style={{ gap: 8 }}>
        <Text
          style={{
            color: colors.mutedText,
            fontWeight: "700",
            fontSize: 13,
          }}
        >
          {setData.sourceType === "youtube" ? "YouTube Study Set" : "Text Study Set"}
        </Text>

        <Text
          style={{
            color: colors.text,
            fontSize: 29,
            fontWeight: "900",
            lineHeight: 35,
          }}
        >
          {setData.title}
        </Text>

        <Text
          style={{
            color: colors.mutedText,
            fontSize: 15,
            lineHeight: 21,
          }}
        >
          Önce kısa özeti oku, sonra kendini test et.
        </Text>
      </View>

      <View
        style={{
          backgroundColor: colors.primary,
          borderRadius: 24,
          padding: 18,
          gap: 14,
        }}
      >
        <Text
          style={{
            color: colors.primaryForeground,
            fontSize: 18,
            fontWeight: "900",
          }}
        >
          Hazır olduğunda quiz’e geç
        </Text>

        <Text
          style={{
            color: colors.primaryForeground,
            opacity: 0.9,
            lineHeight: 21,
          }}
        >
          Bu özet, aşağıdaki soruları çözebileceğin şekilde hazırlandı.
        </Text>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <StatPill label="Kart" value={stats?.totalCards ?? 0} />
          <StatPill label="Due" value={stats?.dueCards ?? 0} />
        </View>

        <Pressable
          onPress={handleStartReview}
          disabled={!stats || stats.totalCards === 0}
          style={{
            backgroundColor: colors.primaryForeground,
            paddingVertical: 15,
            borderRadius: 16,
            alignItems: "center",
            opacity: !stats || stats.totalCards === 0 ? 0.5 : 1,
          }}
        >
          <Text
            style={{
              color: colors.primary,
              fontWeight: "900",
            }}
          >
            Şimdi kendini test et
          </Text>
        </Pressable>
      </View>

      {structuredSummary ? (
        <View style={{ gap: 14 }}>
          <SectionCard title="Kısa Özet">
            <Text
              style={{
                color: colors.text,
                fontSize: 15,
                lineHeight: 23,
              }}
            >
              {structuredSummary.overview}
            </Text>
          </SectionCard>

          {structuredSummary.sections.map((section, index) => (
            <SectionCard key={`${section.title}-${index}`} title={section.title}>
              <Text
                style={{
                  color: colors.mutedText,
                  fontSize: 14,
                  lineHeight: 21,
                  marginBottom: 10,
                }}
              >
                {section.description}
              </Text>

              <View style={{ gap: 8 }}>
                {section.bullets.map((bullet, bulletIndex) => (
                  <Text
                    key={`${bullet}-${bulletIndex}`}
                    style={{
                      color: colors.text,
                      fontSize: 14,
                      lineHeight: 21,
                    }}
                  >
                    • {bullet}
                  </Text>
                ))}
              </View>
            </SectionCard>
          ))}

          {structuredSummary.keyTakeaways.length > 0 ? (
            <SectionCard title="Akılda Kalacaklar">
              <View style={{ gap: 10 }}>
                {structuredSummary.keyTakeaways.map((item, index) => (
                  <View
                    key={`${item}-${index}`}
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      borderWidth: 1,
                      borderRadius: 14,
                      padding: 12,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.text,
                        fontWeight: "700",
                        lineHeight: 21,
                      }}
                    >
                      {index + 1}. {item}
                    </Text>
                  </View>
                ))}
              </View>
            </SectionCard>
          ) : null}
        </View>
      ) : plainSummary ? (
        <SectionCard title="Summary">
          <Text
            style={{
              color: colors.text,
              fontSize: 15,
              lineHeight: 23,
            }}
          >
            {plainSummary}
          </Text>
        </SectionCard>
      ) : null}

      {setData.keyConcepts && setData.keyConcepts.length > 0 ? (
        <SectionCard title="Key Concepts">
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {setData.keyConcepts.map((item, index) => (
              <View
                key={`${item}-${index}`}
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: 999,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                }}
              >
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 13,
                    fontWeight: "700",
                  }}
                >
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </SectionCard>
      ) : null}

      <SectionCard title="Source">
        <Text
          numberOfLines={6}
          style={{
            color: colors.mutedText,
            fontSize: 14,
            lineHeight: 21,
          }}
        >
          {setData.sourceText}
        </Text>
      </SectionCard>
    </ScrollView>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 20,
        padding: 16,
        gap: 10,
      }}
    >
      <Text
        style={{
          color: colors.text,
          fontSize: 18,
          fontWeight: "900",
        }}
      >
        {title}
      </Text>

      {children}
    </View>
  );
}

function StatPill({ label, value }: { label: string; value: number }) {
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.18)",
        borderRadius: 14,
        padding: 12,
      }}
    >
      <Text
        style={{
          color: colors.primaryForeground,
          fontSize: 20,
          fontWeight: "900",
        }}
      >
        {value}
      </Text>

      <Text
        style={{
          color: colors.primaryForeground,
          opacity: 0.9,
          marginTop: 3,
          fontSize: 12,
          fontWeight: "700",
        }}
      >
        {label}
      </Text>
    </View>
  );
}