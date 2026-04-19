import { router } from "expo-router";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { register } from "../../src/services/auth";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");


  const handleRegister = async () => {

    if(password !== passwordAgain) return console.log("şifreler aynı olmak zorunda")

    try {
      await register(email, password)
    } catch (error) {
      console.log("Register error:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Register Page</Text>

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

      <TextInput
        placeholder="Password Again"
        value={passwordAgain}
        onChangeText={setPasswordAgain}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 12, padding: 12, borderRadius: 8 }}
      />

      <Button title="Register" onPress={handleRegister} />

      <Button title="Go back to Login" onPress={() => router.push("/(auth)/login")} />

    </View>
  );
}