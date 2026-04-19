import { router } from "expo-router";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { login } from "../../src/services/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.push("/(tabs)")
    } catch (error) {
      console.log("Login error:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderWidth: 1, marginBottom: 12, padding: 12, borderRadius: 8 }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 12, padding: 12, borderRadius: 8 }}
      />

      <Button title="Login" onPress={handleLogin} />

      <Button title="register" onPress={()=> router.push("/(auth)/register")} />

    </View>
  );
}