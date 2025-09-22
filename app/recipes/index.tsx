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
  TouchableOpacity,
  View,
} from "react-native";

import AuthDrawer from "../../components/AuthDrawer";
import HomeHeader from "../../components/HomeHeader";
import ScreenWrapper, { AppText } from "../../components/ScreenWrapper";
import { useHouseholdContext } from "../../context/HouseholdContext";
import { useAuth } from "../../hooks/useAuth";
import { db } from "../../src/firebaseConfig";

type Recipe = {
  id: string;
  name: string;
};

export default function RecipesScreen() {
  const router = useRouter();
  const { userId, userName } = useAuth();
  const { selectedId: householdId } = useHouseholdContext();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  let data: (Recipe & { type?: string })[] = [
    { id: "create", name: "＋ Create New Recipe", type: "create" },
    ...recipes,
  ];

  if (data.length % 2 !== 0) {
    data.push({ id: "placeholder", name: "", type: "placeholder" });
  }

  return (
    <ScreenWrapper>
      <HomeHeader
        showBack
        // ✅ Use router.back instead of replace to avoid flicker
        onBackPress={() => router.back()}
        onProfilePress={() => setDrawerOpen(true)}
      />

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
                <AppText style={styles.tileText} fontSize={18}>
                  {item.name}
                </AppText>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              style={styles.tile}
              onPress={() => router.push(`/recipes/${item.id}` as any)}
              activeOpacity={0.8}
            >
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item.id)}
              >
                <AppText style={styles.deleteText} fontSize={14}>
                  ✕
                </AppText>
              </TouchableOpacity>
              <AppText style={styles.tileText} fontSize={18}>
                {item.name}
              </AppText>
            </TouchableOpacity>
          );
        }}
      />

      <AuthDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        userName={userName}
        onLoggedOut={() => {}}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  grid: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
  },
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
    position: "relative",
  },
  tileText: {
    fontWeight: "700",
    textAlign: "center",
  },
  placeholder: {
    backgroundColor: "#e0e0e0",
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
    fontWeight: "bold",
  },
});
