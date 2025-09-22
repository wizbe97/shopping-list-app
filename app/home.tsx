import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";

import AuthDrawer from "../components/AuthDrawer";
import AuthForm from "../components/AuthForm";
import HomeHeader from "../components/HomeHeader";
import InviteButton from "../components/InviteButton"; // 👈 import
import ScreenWrapper, { AppText } from "../components/ScreenWrapper";
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

        {/* 👇 Invite button placed under dropdown/header */}
        <InviteButton />

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
              <AppText style={styles.tileText} fontSize={20}>
                {item.label}
              </AppText>
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
  grid: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
  },
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
  tileText: {
    fontWeight: "700",
    textAlign: "center",
  },
});
