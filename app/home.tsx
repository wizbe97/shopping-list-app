import React, { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AuthDrawer from "../components/AuthDrawer";
import AuthForm from "../components/AuthForm";
import HouseholdDropdown from "../components/HouseholdDropdown";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { userId, userName } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!userId) {
    return <AuthForm onSuccess={() => {}} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.tilesWrapper}>
          <HouseholdDropdown userId={userId} />
        </View>

        <TouchableOpacity
          style={styles.profile}
          onPress={() => setDrawerOpen(true)}
        >
          <Text style={{ fontSize: 22 }}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Invite button now matches dropdown width */}
      <View style={styles.tilesWrapper}>
        <Button title="➕ Invite Member" onPress={() => alert("Coming soon")} />
      </View>

      {/* Actual tiles row */}
      <View style={styles.tilesWrapper}>
        <View style={styles.tilesRow}>
          <View style={styles.tile}><Text>🍲 Recipes</Text></View>
          <View style={styles.tile}><Text>🛒 Shopping List</Text></View>
        </View>
      </View>

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
  topRow: { flexDirection: "row", justifyContent: "center", padding: 16 },
  tilesWrapper: {
    alignSelf: "center",
    width: "80%", // shared width for dropdown + invite + tiles
    marginTop: 12,
  },
  profile: { position: "absolute", top: 16, right: 16 },
  tilesRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  tile: {
    flex: 1,
    padding: 40,
    marginHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
  },
});
