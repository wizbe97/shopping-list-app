import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import AuthDrawer from "../components/AuthDrawer";
import AuthForm from "../components/AuthForm";
import HomeHeader from "../components/HomeHeader";
import InviteButton from "../components/InviteButton";
import TileRow from "../components/TileRow";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { userId, userName } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!userId) {
    return <AuthForm onSuccess={() => {}} />;
  }

  return (
    <View style={styles.container}>
      <HomeHeader onProfilePress={() => setDrawerOpen(true)} userId={userId} />

      <InviteButton />

      <TileRow />

      <AuthDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        userName={userName}
        onLoggedOut={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7" },
});
