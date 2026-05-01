export const lightColors = {
  background: "#F8F7FF",
  card: "#FFFFFF",
  elevatedCard: "#F3F0FF",

  text: "#111827",
  mutedText: "#6B7280",
  subtleText: "#9CA3AF",

  border: "#E5E7EB",
  softBorder: "#EEF2FF",

  primary: "#4F46E5",
  primaryPressed: "#4338CA",
  primarySoft: "#EEF2FF",
  primaryForeground: "#FFFFFF",

  secondary: "#7C3AED",
  secondarySoft: "#F3E8FF",

  success: "#22C55E",
  successSoft: "#DCFCE7",

  warning: "#F59E0B",
  warningSoft: "#FEF3C7",

  danger: "#EF4444",
  dangerSoft: "#FEE2E2",

  aiGlow: "#A855F7",

  progressTrack: "#E0E7FF",
  onPrimarySoft: "rgba(255,255,255,0.18)",
};

export const darkColors = {
  background: "#0B0B0F",
  card: "#15161C",
  elevatedCard: "#1E1B2E",

  text: "#F9FAFB",
  mutedText: "#A1A1AA",
  subtleText: "#71717A",

  border: "#27272A",
  softBorder: "#312E81",

  primary: "#818CF8",
  primaryPressed: "#6366F1",
  primarySoft: "#1E1B4B",
  primaryForeground: "#0B0B0F",

  secondary: "#A78BFA",
  secondarySoft: "#2E1065",

  success: "#4ADE80",
  successSoft: "#14532D",

  warning: "#FBBF24",
  warningSoft: "#451A03",

  danger: "#F87171",
  dangerSoft: "#450A0A",

  aiGlow: "#C084FC",

  progressTrack: "#27272A",
  onPrimarySoft: "rgba(255,255,255,0.16)",
};

export type ThemeColors = typeof lightColors;
export type ThemeMode = "light" | "dark";
