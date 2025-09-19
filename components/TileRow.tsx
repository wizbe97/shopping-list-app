import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function TileRow() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <View style={styles.tile}><Text>🍲 Recipes</Text></View>
        <View style={styles.tile}><Text>🛒 Shopping List</Text></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignSelf: "center", width: "80%", marginTop: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  tile: {
    flex: 1,
    padding: 40,
    marginHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
  },
});
