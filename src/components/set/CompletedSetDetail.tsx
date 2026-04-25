import { Ionicons } from "@expo/vector-icons";
import type { GeneratedSummary } from "@/src/services/functions";
import type { StudySet } from "@/src/types/study-set";
import { useAppTheme } from "@/src/theme/useTheme";
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

  const summary = set.summary;
  const structuredSummary = isStructuredSummary(summary) ? summary : null;
  const plainSummary = typeof summary === "string" ? summary : null;
  const cardCount = set.cardCount || set.totalCards || set.cards.length || 0;

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
          {set.sourceType === "youtube" ? (
            <Image
              source={require("@/src/assets/images/youtube.png")}
              style={{ width: 16, height: 16, resizeMode: "contain" }}
            />
          ) : (
            <Ionicons name="document-text-outline" color={colors.primary} size={16} />
          )}
          <Text
            style={{
              color: colors.text,
              fontSize: 12,
              fontWeight: "800",
            }}
          >
            {set.sourceType === "youtube" ? "YouTube Study Set" : "Text Study Set"}
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
          Ozeti okuyup ana fikirleri kavra, sonra quiz ile bilgiyi pekistir.
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
            Set hazir
          </Text>
        </View>

        <Text
          style={{
            color: colors.primaryForeground,
            opacity: 0.92,
            lineHeight: 21,
          }}
        >
          Ozet ve sorular ayni ogrenme akisina gore hazirlandi. Once hizlica
          oku, sonra test tarafina gec.
        </Text>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <StatPill label="Kart" value={cardCount} />
          <StatPill label="Kavram" value={set.keyConcepts.length} />
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
          <Ionicons name="play-circle-outline" color={colors.primary} size={18} />
          <Text
            style={{
              color: colors.primary,
              fontWeight: "900",
            }}
          >
            Quizi baslat
          </Text>
        </Pressable>
      </View>

      {structuredSummary ? (
        <View style={{ gap: 14 }}>
          <SectionCard
            title="Genel Bakis"
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
              icon={<Ionicons name="list-outline" color={colors.primary} size={18} />}
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
                    • {bullet}
                  </Text>
                ))}
              </View>
            </SectionCard>
          ))}

          {structuredSummary.keyTakeaways.length > 0 ? (
            <SectionCard
              title="Akilda Kalacaklar"
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
          title="Ozet"
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
          title="Ana Kavramlar"
          icon={<Ionicons name="list-outline" color={colors.primary} size={18} />}
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
        title="Kaynak"
        icon={
          <Image
            source={require("@/src/assets/images/youtube.png")}
            style={{ width: 18, height: 18, resizeMode: "contain" }}
          />
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
