import { useRouter } from "expo-router";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { useHouseholds } from "../../hooks/useHouseholds";
import { db } from "../../src/firebaseConfig";

export default function CreateRecipeScreen() {
  const router = useRouter();
  const { userId } = useAuth();
  const { selectedId: householdId } = useHouseholds(userId);

  const [name, setName] = useState("");
  const [serves, setServes] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [steps, setSteps] = useState<string[]>([]);

  function addIngredient() {
    setIngredients((prev) => [...prev, ""]);
  }

  function updateIngredient(index: number, value: string) {
    setIngredients((prev) => prev.map((item, i) => (i === index ? value : item)));
  }

  function addStep() {
    setSteps((prev) => [...prev, ""]);
  }

  function updateStep(index: number, value: string) {
    setSteps((prev) => prev.map((item, i) => (i === index ? value : item)));
  }

  async function handleSave() {
    if (!name.trim() || !serves.trim() || !householdId) return;

    await addDoc(collection(db, "households", householdId, "recipes"), {
      name: name.trim(),
      serves: parseInt(serves, 10),
      ingredients: ingredients.filter((i) => i.trim() !== ""),
      steps: steps.filter((s) => s.trim() !== ""),
      createdAt: Timestamp.now(),
    });

    router.replace("/recipes"); // ✅ back to list
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.header}>New Recipe</Text>

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

      <Text style={styles.subHeader}>Ingredients</Text>
      <FlatList
        data={ingredients}
        keyExtractor={(_, i) => `ing-${i}`}
        renderItem={({ item, index }) => (
          <TextInput
            style={styles.input}
            placeholder={`Ingredient ${index + 1}`}
            value={item}
            onChangeText={(text) => updateIngredient(index, text)}
          />
        )}
        ListFooterComponent={
          <TouchableOpacity onPress={addIngredient} style={styles.addBtn}>
            <Text style={styles.addBtnText}>+ Add Ingredient</Text>
          </TouchableOpacity>
        }
      />

      <Text style={styles.subHeader}>Steps</Text>
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
            <Text style={styles.addBtnText}>+ Add Step</Text>
          </TouchableOpacity>
        }
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save Recipe</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7", padding: 16 },
  backBtn: { marginBottom: 12 },
  backText: { fontSize: 20, fontWeight: "bold" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  subHeader: { fontSize: 18, fontWeight: "600", marginTop: 20, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  addBtn: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 12,
  },
  addBtnText: { fontSize: 16, fontWeight: "500" },
  saveBtn: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
