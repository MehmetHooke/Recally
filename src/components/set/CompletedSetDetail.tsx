import type { GeneratedSummary } from "@/src/services/functions";
import { useAppTheme } from "@/src/theme/useTheme";
import type { StudySet } from "@/src/types/study-set";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

function isStructuredSummary(
  summary: StudySet["summary"]
): summary is GeneratedSummary {
  return !!summary && typeof summary !== "string";
}

export function CompletedSetDetail({
  set,
  onOpenReview,
}: {
  set: StudySet;
  onOpenReview: () => void;
}) {
  const { colors } = useAppTheme();
  const { t } = useTranslation("set");

  const summary = set.summary;
  const structuredSummary = isStructuredSummary(summary) ? summary : null;
  const plainSummary = typeof summary === "string" ? summary : null;
  const cardCount = set.cardCount || set.totalCards || set.cards.length || 0;
  const isYoutubeSource = set.sourceType === "youtube";
  const sourceLabel = isYoutubeSource
    ? t("detail.completed.source.youtube")
    : t("detail.completed.source.text");

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 120,
        gap: 16,
      }}
    >
      <View style={{ gap: 10 }}>
        <View
          style={{
            alignSelf: "flex-start",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 999,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          {isYoutubeSource ? (
            <Image
              source={require("@/src/assets/images/youtube.png")}
              style={{ width: 16, height: 16, resizeMode: "contain" }}
            />
          ) : (
            <Ionicons
              name="document-text-outline"
              color={colors.primary}
              size={16}
            />
          )}

          <Text
            style={{
              color: colors.text,
              fontSize: 12,
              fontWeight: "800",
            }}
          >
            {sourceLabel}
          </Text>
        </View>

        <Text
          style={{
            color: colors.text,
            fontSize: 29,
            fontWeight: "900",
            lineHeight: 35,
          }}
        >
          {set.title}
        </Text>

        <Text
          style={{
            color: colors.mutedText,
            fontSize: 15,
            lineHeight: 22,
          }}
        >
          {t("detail.completed.subtitle")}
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
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Ionicons
            name="sparkles-outline"
            color={colors.primaryForeground}
            size={20}
          />
          <Text
            style={{
              color: colors.primaryForeground,
              fontSize: 18,
              fontWeight: "900",
            }}
          >
            {t("detail.completed.readyTitle")}
          </Text>
        </View>

        <Text
          style={{
            color: colors.primaryForeground,
            opacity: 0.92,
            lineHeight: 21,
          }}
        >
          {t("detail.completed.readyDescription")}
        </Text>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <StatPill label={t("detail.completed.stats.cards")} value={cardCount} />
          <StatPill
            label={t("detail.completed.stats.concepts")}
            value={set.keyConcepts.length}
          />
        </View>

        <Pressable
          onPress={onOpenReview}
          disabled={cardCount === 0}
          style={{
            backgroundColor: colors.primaryForeground,
            paddingVertical: 15,
            borderRadius: 16,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 8,
            opacity: cardCount === 0 ? 0.55 : 1,
          }}
        >
          <Ionicons
            name="play-circle-outline"
            color={colors.primary}
            size={18}
          />
          <Text
            style={{
              color: colors.primary,
              fontWeight: "900",
            }}
          >
            {t("detail.completed.startQuiz")}
          </Text>
        </Pressable>
      </View>

      {structuredSummary ? (
        <View style={{ gap: 14 }}>
          <SectionCard
            title={t("detail.completed.sections.overview")}
            icon={
              <Ionicons
                name="document-text-outline"
                color={colors.primary}
                size={18}
              />
            }
          >
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
            <SectionCard
              key={`${section.title}-${index}`}
              title={section.title}
              icon={
                <Ionicons
                  name="list-outline"
                  color={colors.primary}
                  size={18}
                />
              }
            >
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
                    - {bullet}
                  </Text>
                ))}
              </View>
            </SectionCard>
          ))}

          {structuredSummary.keyTakeaways.length > 0 ? (
            <SectionCard
              title={t("detail.completed.sections.takeaways")}
              icon={
                <Ionicons
                  name="sparkles-outline"
                  color={colors.primary}
                  size={18}
                />
              }
            >
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
        <SectionCard
          title={t("detail.completed.sections.summary")}
          icon={
            <Ionicons
              name="document-text-outline"
              color={colors.primary}
              size={18}
            />
          }
        >
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

      {set.keyConcepts.length > 0 ? (
        <SectionCard
          title={t("detail.completed.sections.keyConcepts")}
          icon={
            <Ionicons name="list-outline" color={colors.primary} size={18} />
          }
        >
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {set.keyConcepts.map((item, index) => (
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

      <SectionCard
        title={t("detail.completed.sections.source")}
        icon={
          isYoutubeSource ? (
            <Image
              source={require("@/src/assets/images/youtube.png")}
              style={{ width: 18, height: 18, resizeMode: "contain" }}
            />
          ) : (
            <Ionicons
              name="document-text-outline"
              color={colors.primary}
              size={18}
            />
          )
        }
      >
        <Text
          numberOfLines={6}
          style={{
            color: colors.mutedText,
            fontSize: 14,
            lineHeight: 21,
          }}
        >
          {set.sourceText}
        </Text>
      </SectionCard>
    </ScrollView>
  );
}

function SectionCard({
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
        borderRadius: 20,
        padding: 16,
        gap: 10,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        {icon}
        <Text
          style={{
            color: colors.text,
            fontSize: 18,
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
