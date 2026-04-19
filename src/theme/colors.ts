export const lightColors = {
  background: "#F7F7F5",
  card: "#FFFFFF",
  text: "#111111",
  mutedText: "#6B7280",
  border: "#E5E7EB",
  primary: "#3B82F6",
  primaryForeground: "#FFFFFF",
};

export const darkColors = {
  background: "#0B0B0C",
  card: "#151618",
  text: "#F3F4F6",
  mutedText: "#9CA3AF",
  border: "#26272B",
  primary: "#60A5FA",
  primaryForeground: "#0B0B0C",
};

export type ThemeColors = typeof lightColors;
export type ThemeMode = "light" | "dark";
