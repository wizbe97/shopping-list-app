import { useRouter } from "expo-router";
import React from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type Recipe = {
  id: string;
  name: string;
};

export default function RecipesScreen() {
  const router = useRouter();
  const recipes: Recipe[] = []; // start empty

  // Always render "Create New Recipe" plus placeholders for a grid layout
  const data = [
    { id: "create", name: "＋ Create New Recipe" },
    ...recipes,
  ];

  // Pad data so grid always has at least 2 slots
  while (data.length < 2) {
    data.push({ id: `empty-${data.length}`, name: "" });
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Recipes</Text>
      </View>

      {/* Grid of tiles */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => {
          if (item.id === "create") {
            return (
              <TouchableOpacity
                style={styles.tile}
                onPress={() => console.log("Create recipe")}
              >
                <Text style={styles.tileText}>{item.name}</Text>
              </TouchableOpacity>
            );
          }
          if (item.name === "") {
            return <View style={[styles.tile, styles.emptyTile]} />;
          }
          return (
            <TouchableOpacity
              style={styles.tile}
              onPress={() => console.log("Open recipe", item.id)}
            >
              <Text style={styles.tileText}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7", padding: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backBtn: { marginRight: 12, padding: 4 },
  backText: { fontSize: 20, fontWeight: "bold" },
  headerText: { fontSize: 22, fontWeight: "bold" },
  grid: { paddingBottom: 20 },
  row: { justifyContent: "space-between" },
  tile: {
    flex: 1,
    aspectRatio: 1,
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
  emptyTile: {
    backgroundColor: "#eee",
  },
  tileText: {
    fontSize: 18, // bumped up
    fontWeight: "700",
    textAlign: "center",
  },
});
