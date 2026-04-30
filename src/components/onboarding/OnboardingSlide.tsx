import { useAppTheme } from "@/src/theme/useTheme";
import { Text, View } from "react-native";

type Props = {
  title: string;
  subtitle: string;
  visualType: "youtube" | "quiz" | "intelligence";
};

export function OnboardingSlide({ title, subtitle, visualType }: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={{ gap: 28 }}>
      <MockVisual visualType={visualType} />

      <View>
        <Text
          style={{
            color: colors.text,
            fontSize: 32,
            fontWeight: "900",
            lineHeight: 38,
          }}
        >
          {title}
        </Text>

        <Text
          style={{
            color: colors.mutedText,
            fontSize: 16,
            lineHeight: 23,
            marginTop: 10,
          }}
        >
          {subtitle}
        </Text>
      </View>
    </View>
  );
}

function MockVisual({ visualType }: { visualType: Props["visualType"] }) {
  const { colors } = useAppTheme();

  if (visualType === "youtube") {
    return (
      <View
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 28,
          padding: 18,
          gap: 14,
        }}
      >
        <View
          style={{
            backgroundColor: colors.background,
            borderRadius: 18,
            padding: 16,
          }}
        >
          <Text style={{ color: colors.mutedText, fontWeight: "800" }}>
            youtube.com/watch?v=...
          </Text>
        </View>

        <View
          style={{
            backgroundColor: colors.primary,
            borderRadius: 18,
            padding: 16,
          }}
        >
          <Text
            style={{
              color: colors.primaryForeground,
              fontWeight: "900",
              fontSize: 16,
            }}
          >
            Summary + Quiz Cards
          </Text>
        </View>
      </View>
    );
  }

  if (visualType === "quiz") {
    return (
      <View
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 28,
          padding: 18,
          gap: 12,
        }}
      >
        <Text style={{ color: colors.text, fontWeight: "900", fontSize: 17 }}>
          What is the main idea?
        </Text>

        {["Option A", "Option B", "Option C"].map((item, index) => (
          <View
            key={item}
            style={{
              borderColor: index === 1 ? colors.primary : colors.border,
              borderWidth: 1,
              borderRadius: 14,
              padding: 13,
              backgroundColor:
                index === 1 ? colors.primary : colors.background,
            }}
          >
            <Text
              style={{
                color:
                  index === 1 ? colors.primaryForeground : colors.mutedText,
                fontWeight: "800",
              }}
            >
              {item}
            </Text>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 28,
        padding: 18,
        gap: 14,
      }}
    >
      <Text style={{ color: colors.text, fontWeight: "900", fontSize: 17 }}>
        Learning Intelligence
      </Text>

      <View
        style={{
          height: 10,
          backgroundColor: colors.border,
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: "64%",
            height: "100%",
            backgroundColor: colors.primary,
          }}
        />
      </View>

      <View style={{ flexDirection: "row", gap: 8 }}>
        <MiniStat label="Strong" value="64%" />
        <MiniStat label="At risk" value="3" />
      </View>
    </View>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: 14,
        padding: 12,
      }}
    >
      <Text style={{ color: colors.text, fontWeight: "900", fontSize: 20 }}>
        {value}
      </Text>
      <Text
        style={{
          color: colors.mutedText,
          marginTop: 4,
          fontWeight: "700",
          fontSize: 12,
        }}
      >
        {label}
      </Text>
    </View>
  );
}