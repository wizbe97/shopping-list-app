import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import HouseholdDropdown from "./HouseholdDropdown";

type Props = {
  showBack?: boolean;
  onBackPress?: () => void;
  onProfilePress?: () => void;
};

export default function HomeHeader({
  showBack,
  onBackPress,
  onProfilePress,
}: Props) {
  return (
    <View style={styles.container}>
      {/* Back button + Dropdown */}
      <View style={styles.row}>
        {showBack ? (
          <TouchableOpacity onPress={onBackPress} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 28 }} /> // spacer
        )}

        <View style={styles.dropdownWrapper}>
          <HouseholdDropdown />
        </View>
      </View>

      {/* Profile button stays pinned top-right */}
      <TouchableOpacity onPress={onProfilePress} style={styles.profileBtn}>
        <Ionicons name="person-circle" size={36} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    position: "relative", // needed for absolute child
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start", // 👈 align to top instead of center
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
  },
  dropdownWrapper: {
    flex: 1,
    marginRight: 48, // leave space so profile button doesn’t overlap
  },
  profileBtn: {
    position: "absolute",
    top: 0, // 👈 pinned to top
    right: 0,
    padding: 4,
  },
});
