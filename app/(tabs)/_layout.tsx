import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{headerShown:false, title: "Home" }} />
      <Tabs.Screen name="add" options={{headerShown:false, title: "Add" }} />
      <Tabs.Screen name="library" options={{headerShown:false, title: "Library" }} />
      <Tabs.Screen name="settings" options={{headerShown:false, title: "Settings" }} />
    </Tabs>
  );
}