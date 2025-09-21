import { useRouter } from "expo-router";
import {
    collection,
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
import { useAuth } from "../../hooks/useAuth";
import { useHouseholds } from "../../hooks/useHouseholds";
import { db } from "../../src/firebaseConfig";

type Recipe = {
  id: string;
  name: string;
};

export default function RecipesScreen() {
  const router = useRouter();
  const { userId } = useAuth();
  const { selectedId: householdId } = useHouseholds(userId);

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

  const data = [{ id: "create", name: "＋ Create New Recipe" }, ...recipes];

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
            <HouseholdDropdown userId={userId} />
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
          if (item.id === "create") {
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
            <TouchableOpacity
              style={styles.tile}
              onPress={() => router.push(`/recipes/${item.id}` as any)}
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
  },
  tileText: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
});
