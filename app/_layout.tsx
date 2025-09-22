// app/_layout.tsx
import { Stack } from "expo-router";
import AuthForm from "../components/AuthForm";
import { HouseholdProvider } from "../context/HouseholdContext";
import { useAuth } from "../hooks/useAuth";

export default function RootLayout() {
  const { userId } = useAuth();

  if (!userId) {
    return <AuthForm onSuccess={() => {}} />;
  }

  return (
    <HouseholdProvider userId={userId}>
      <Stack screenOptions={{ headerShown: false }} />
    </HouseholdProvider>
  );
}
