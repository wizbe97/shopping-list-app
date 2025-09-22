import { Stack } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import AuthForm from "../components/AuthForm";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { HouseholdProvider } from "../context/HouseholdContext";

function RootLayoutInner() {
  const { userId, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <HouseholdProvider userId={userId || ""}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Always mount the stack — AuthForm becomes a screen */}
        {!userId && (
          <Stack.Screen
            name="auth"
            options={{ headerShown: false }}
          />
        )}
      </Stack>
      {!userId && <AuthForm onSuccess={() => {}} />}
    </HouseholdProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutInner />
    </AuthProvider>
  );
}
