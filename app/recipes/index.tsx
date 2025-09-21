// app/recipes/index.tsx
import { useRouter } from "expo-router";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import HouseholdDropdown from "../../components/HouseholdDropdown";
import { useHouseholdContext } from "../../context/HouseholdContext";
import { useAuth } from "../../hooks/useAuth";
import { db } from "../../src/firebaseConfig";

type Recipe = {
  id: string;
  name: string;
};

export default function RecipesScreen() {
  const router = useRouter();
  const { userId } = useAuth();
  const { selectedId: householdId } = useHouseholdContext();

  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    if (!householdId) {
      setRecipes([]);
      return;
    }

    const q = query(
      collection(db, "households", householdId, "recipes"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const list: Recipe[] = [];
      snap.forEach((doc) =>
        list.push({ id: doc.id, ...(doc.data() as any) })
      );
      setRecipes(list);
    });

    return () => unsub();
  }, [householdId]);

  async function handleDelete(recipeId: string) {
    if (!householdId) return;
    await deleteDoc(doc(db, "households", householdId, "recipes", recipeId));
  }

  // Always start with "create" tile
  let data: (Recipe & { type?: string })[] = [
    { id: "create", name: "＋ Create New Recipe", type: "create" },
    ...recipes,
  ];

  // If odd, add placeholder tile
  if (data.length % 2 !== 0) {
    data.push({ id: "placeholder", name: "", type: "placeholder" });
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/home")}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        {/* Household Dropdown */}
        {userId && (
          <View style={styles.dropdownWrapper}>
            <HouseholdDropdown />
          </View>
        )}
      </View>

      {/* Grid */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => {
          if (item.type === "placeholder") {
            return <View style={[styles.tile, styles.placeholder]} />;
          }

          if (item.type === "create") {
            return (
              <TouchableOpacity
                style={styles.tile}
                onPress={() => router.push("/recipes/create" as any)}
              >
                <Text style={styles.tileText}>{item.name}</Text>
              </TouchableOpacity>
            );
          }

          return (
            <View style={styles.tile}>
              {/* Delete button */}
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.deleteText}>✕</Text>
              </TouchableOpacity>

              {/* Recipe name (tap to edit) */}
              <TouchableOpacity
                style={styles.tileContent}
                onPress={() => router.push(`/recipes/${item.id}` as any)}
              >
                <Text style={styles.tileText}>{item.name}</Text>
              </TouchableOpacity>
            </View>
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
  dropdownWrapper: {
    flex: 1,
    marginLeft: 8,
  },
  grid: { paddingBottom: 20 },
  row: { justifyContent: "space-between" },
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
    position: "relative", // needed for delete button
  },
  tileContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tileText: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  placeholder: {
    backgroundColor: "#e0e0e0", // slightly darker than recipes
  },
  deleteBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "red",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 1,
  },
  deleteText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
