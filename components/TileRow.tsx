import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function TileRow() {
  const router = useRouter();

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {/* Shopping List on the left */}
        <TouchableOpacity
          style={styles.tile}
          onPress={() => router.push("/shoppingList" as any)}
        >
          <Text style={styles.tileText}>🛒 Shopping List</Text>
        </TouchableOpacity>

        {/* Recipes on the right */}
        <TouchableOpacity
          style={styles.tile}
          onPress={() => router.push("/recipes" as any)}
        >
          <Text style={styles.tileText}>🍲 Recipes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignSelf: "center", width: "80%", marginTop: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  tile: {
    flex: 1,
    aspectRatio: 1,
    marginHorizontal: 10,
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
    fontSize: 20, // bumped up
    fontWeight: "700",
    textAlign: "center",
  },
});
