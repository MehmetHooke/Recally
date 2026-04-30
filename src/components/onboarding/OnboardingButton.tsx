import { useAppTheme } from "@/src/theme/useTheme";
import { Pressable, Text } from "react-native";

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function OnboardingButton({ label, onPress, disabled = false }: Props) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={{
        backgroundColor: colors.primary,
        paddingVertical: 16,
        borderRadius: 18,
        alignItems: "center",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Text
        style={{
          color: colors.primaryForeground,
          fontSize: 16,
          fontWeight: "900",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}