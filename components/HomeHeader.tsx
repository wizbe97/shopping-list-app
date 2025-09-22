// components/HomeHeader.tsx
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import HouseholdDropdown from "./HouseholdDropdown";
import InviteButton from "./InviteButton";

type Props = {
  showBack?: boolean;
  onBackPress?: () => void;
  onProfilePress?: () => void;
};

export default function HomeHeader({ showBack, onBackPress, onProfilePress }: Props) {
  return (
    <View style={styles.container}>
      {/* Row: Back button (optional) + Dropdown + Profile */}
      <View style={styles.topRow}>
        {showBack ? (
          <TouchableOpacity onPress={onBackPress} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} /> // spacer if no back button
        )}

        <View style={styles.dropdownWrapper}>
          <HouseholdDropdown />
        </View>

        <TouchableOpacity onPress={onProfilePress} style={styles.profileBtn}>
          <Ionicons name="person-circle" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Centered Invite button */}
      <View style={styles.inviteWrapper}>
        <InviteButton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: { padding: 4, marginRight: 8 },
  backText: { fontSize: 20, fontWeight: "bold" },
  dropdownWrapper: { flex: 1, marginHorizontal: 8 },
  profileBtn: { padding: 4, marginLeft: 8 },
  inviteWrapper: {
    marginTop: 12,
    alignItems: "center", // 👈 centers Invite button
  },
});
