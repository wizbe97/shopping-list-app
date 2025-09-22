import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, Timestamp, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import HomeHeader from "../../components/HomeHeader";
import ScreenWrapper, { AppText } from "../../components/ScreenWrapper";
import { useHouseholdContext } from "../../context/HouseholdContext";
import { useAuth } from "../../hooks/useAuth";
import { db } from "../../src/firebaseConfig";

export default function EditRecipeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { userId } = useAuth();
  const { selectedId: householdId } = useHouseholdContext();

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [serves, setServes] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [steps, setSteps] = useState<string[]>([]);

  useEffect(() => {
    async function fetchRecipe() {
      if (!householdId || !id) return;

      const ref = doc(db, "households", householdId, "recipes", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setName(data.name || "");
        setServes(data.serves?.toString() || "");
        setIngredients(data.ingredients || []);
        setSteps(data.steps || []);
      }

      setLoading(false);
    }

    fetchRecipe();
  }, [householdId, id]);

  function addIngredient() {
    setIngredients((prev) => [...prev, ""]);
  }

  function updateIngredient(index: number, value: string) {
    setIngredients((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    );
  }

  function removeIngredient(index: number) {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  }

  function addStep() {
    setSteps((prev) => [...prev, ""]);
  }

  function updateStep(index: number, value: string) {
    setSteps((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    );
  }

  async function handleSave() {
    if (!name.trim() || !serves.trim() || !householdId || !id) return;

    const ref = doc(db, "households", householdId, "recipes", id);

    await updateDoc(ref, {
      name: name.trim(),
      serves: parseInt(serves, 10),
      ingredients: ingredients.filter((i) => i.trim() !== ""),
      steps: steps.filter((s) => s.trim() !== ""),
      updatedAt: Timestamp.now(),
      updatedBy: userId,
    });

    router.replace("/recipes");
  }

  if (loading) {
    return (
      <ScreenWrapper>
        <ActivityIndicator size="large" />
        <AppText fontSize={16}>Loading recipe...</AppText>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <HomeHeader showBack onBackPress={() => router.back()} />

      <AppText style={styles.header} fontSize={22}>
        Edit Recipe
      </AppText>

      <TextInput
        style={styles.input}
        placeholder="Recipe Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Serves"
        value={serves}
        keyboardType="numeric"
        onChangeText={setServes}
      />

      {/* Ingredients */}
      <AppText style={styles.subHeader} fontSize={18}>
        Ingredients
      </AppText>

      <FlatList
        data={ingredients}
        keyExtractor={(_, i) => `ing-${i}`}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder={`Ingredient ${index + 1}`}
              value={item}
              onChangeText={(text) => updateIngredient(index, text)}
            />
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => removeIngredient(index)}
            >
              <AppText style={styles.deleteText} fontSize={16}>
                ✕
              </AppText>
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={
          <TouchableOpacity onPress={addIngredient} style={styles.addBtn}>
            <AppText style={styles.addBtnText} fontSize={16}>
              + Add Ingredient
            </AppText>
          </TouchableOpacity>
        }
      />

      {/* Steps */}
      <AppText style={styles.subHeader} fontSize={18}>
        Steps
      </AppText>

      <FlatList
        data={steps}
        keyExtractor={(_, i) => `step-${i}`}
        renderItem={({ item, index }) => (
          <TextInput
            style={styles.input}
            placeholder={`Step ${index + 1}`}
            value={item}
            onChangeText={(text) => updateStep(index, text)}
          />
        )}
        ListFooterComponent={
          <TouchableOpacity onPress={addStep} style={styles.addBtn}>
            <AppText style={styles.addBtnText} fontSize={16}>
              + Add Step
            </AppText>
          </TouchableOpacity>
        }
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <AppText style={styles.saveText} fontSize={18}>
          Save Changes
        </AppText>
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    fontWeight: "bold",
    marginBottom: 20,
  },
  subHeader: {
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  deleteBtn: {
    backgroundColor: "red",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 8,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
  addBtn: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 12,
  },
  addBtnText: {
    fontWeight: "500",
  },
  saveBtn: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
