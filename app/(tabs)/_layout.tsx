
import { LiquidTabBar } from "@/src/components/navigation/LiquidTabBar";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  const { t } = useTranslation("tabs");

  return (
    <Tabs
      tabBar={(props) => <LiquidTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t("navbar.home"),
        }}
      />

      <Tabs.Screen
        name="add"
        options={{
          title: t("navbar.create"),
        }}
      />

      <Tabs.Screen
        name="library"
        options={{
          title: t("navbar.library"),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: t("navbar.settings"),
        }}
      />
    </Tabs>
  );
}