import { useAppTheme } from "@/src/theme/useTheme";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

export type FilterType = "all" | "due" | "mastered";

type Props = {
  filter: FilterType;
  onChange: (filter: FilterType) => void;
};

export function LibraryFilters({ filter, onChange }: Props) {
  const { t } = useTranslation("tabs");

  return (
    <View style={{ flexDirection: "row", gap: 8 }}>
      <FilterButton
        label={t("library.filters.all")}
        active={filter === "all"}
        onPress={() => onChange("all")}
      />
      <FilterButton
        label={t("library.filters.due")}
        active={filter === "due"}
        onPress={() => onChange("due")}
      />
      <FilterButton
        label={t("library.filters.mastered")}
        active={filter === "mastered"}
        onPress={() => onChange("mastered")}
      />
    </View>
  );
}

function FilterButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        paddingVertical: 11,
        borderRadius: 999,
        alignItems: "center",
        backgroundColor: active ? colors.primary : colors.card,
        borderColor: active ? colors.primary : colors.border,
        borderWidth: 1,
      }}
    >
      <Text
        style={{
          color: active ? colors.primaryForeground : colors.text,
          fontWeight: "900",
          fontSize: 13,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}