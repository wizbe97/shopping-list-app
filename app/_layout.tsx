// app/_layout.tsx
import { Stack } from "expo-router";
import { HouseholdProvider } from "../context/HouseholdContext";
import { useAuth } from "../hooks/useAuth";

export default function RootLayout() {
  const { userId } = useAuth();

  return (
    <HouseholdProvider userId={userId}>
      <Stack screenOptions={{ headerShown: false }} />
    </HouseholdProvider>
  );
}
