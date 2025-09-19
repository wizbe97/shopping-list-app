import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../hooks/useAuth";

type AuthFormProps = {
  onSuccess?: () => void;
};

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit() {
    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Auth error:", err);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {isRegister && (
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>
            {isRegister ? "Register" : "Login"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsRegister(!isRegister)}
          style={styles.toggle}
        >
          <Text style={styles.toggleText}>
            {isRegister
              ? "Already have an account? Login"
              : "Need an account? Register"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  card: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#2196F3",
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  toggle: {
    marginTop: 16,
  },
  toggleText: {
    color: "#2196F3",
    textAlign: "center",
    fontWeight: "600",
  },
});
