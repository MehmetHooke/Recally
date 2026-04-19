import { useAuth } from "@/src/context/AuthContext";
import "@/src/i18n";
import { Stack } from "expo-router";


export default function RootLayout() {

  const { user, loading } = useAuth();
  if (loading) return null;
  return (
    <Stack>
      {!user ? (
        <Stack.Screen name="(auth)"/>
      ):(
        <Stack.Screen name="(tabs)"/>

      )}
    </Stack>
  );
}
