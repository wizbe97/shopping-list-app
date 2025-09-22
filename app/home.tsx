// app/home.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import AuthDrawer from "../components/AuthDrawer";
import AuthForm from "../components/AuthForm";
import HomeHeader from "../components/HomeHeader";
import ScreenWrapper from "../components/ScreenWrapper";
import { HouseholdProvider } from "../context/HouseholdContext";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { userId, userName } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  if (!userId) {
    return <AuthForm onSuccess={() => {}} />;
  }

  const data = [
    { id: "shopping", label: "🛒 Shopping List", route: "/shoppingList" },
    { id: "recipes", label: "🍲 Recipes", route: "/recipes" },
  ];

  return (
    <HouseholdProvider userId={userId}>
      <ScreenWrapper>
        <HomeHeader onProfilePress={() => setDrawerOpen(true)} />

        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.tile}
              onPress={() => router.push(item.route as any)}
            >
              <Text style={styles.tileText}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />

        <AuthDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          userName={userName}
          onLoggedOut={() => {}}
        />
      </ScreenWrapper>
    </HouseholdProvider>
  );
}

const styles = StyleSheet.create({
  grid: { paddingBottom: 20 },
  row: { justifyContent: "space-between" },
  tile: {
    flex: 1,
    aspectRatio: 2,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  tileText: { fontSize: 20, fontWeight: "700", textAlign: "center" },
});
