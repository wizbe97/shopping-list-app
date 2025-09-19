import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import HouseholdDropdown from "./HouseholdDropdown";

type Props = {
  onProfilePress: () => void;
  userId: string;
};

export default function HomeHeader({ onProfilePress, userId }: Props) {
  return (
    <View style={styles.topRow}>
      <View style={styles.dropdownWrapper}>
        <HouseholdDropdown userId={userId} />
      </View>

      <TouchableOpacity style={styles.profile} onPress={onProfilePress}>
        <Text style={{ fontSize: 22 }}>👤</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: "row", justifyContent: "center", padding: 16 },
  dropdownWrapper: {
    alignSelf: "center",
    width: "80%",
  },
  profile: { position: "absolute", top: 16, right: 16 },
});
