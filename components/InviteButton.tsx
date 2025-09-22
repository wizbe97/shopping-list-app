// components/InviteButton.tsx
import React from "react";
import { Button, StyleSheet, View } from "react-native";

export default function InviteButton() {
  return (
    <View style={styles.wrapper}>
      <Button title="➕ Invite Member" onPress={() => alert("Coming soon")} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "center",
    width: "80%",
    marginTop: 12,
  },
});
