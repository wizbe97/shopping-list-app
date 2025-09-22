import { useRouter } from "expo-router";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import React, { useState } from "react";
import {
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

type Ingredient = { name: string; quantity: string };

export default function CreateRecipeScreen() {
  const router = useRouter();
  const { userId } = useAuth();
  const { selectedId: householdId } = useHouseholdContext();

  const [name, setName] = useState("");
  const [serves, setServes] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<string[]>([]);

  function addIngredient() {
    setIngredients((prev) => [...prev, { name: "", quantity: "" }]);
  }

  function updateIngredientName(index: number, value: string) {
    setIngredients((prev) =>
      prev.map((ing, i) => (i === index ? { ...ing, name: value } : ing))
    );
  }

  function updateIngredientQuantity(index: number, value: string) {
    setIngredients((prev) =>
      prev.map((ing, i) => (i === index ? { ...ing, quantity: value } : ing))
    );
  }

  function removeIngredient(index: number) {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  }

  function addStep() {
    setSteps((prev) => [...prev, ""]);
  }

  function updateStep(index: number, value: string) {
    setSteps((prev) => prev.map((s, i) => (i === index ? value : s)));
  }

  async function handleSave() {
    if (!name.trim() || !serves.trim() || !householdId) return;

    await addDoc(collection(db, "households", householdId, "recipes"), {
      name: name.trim(),
      serves: parseInt(serves, 10),
      ingredients: ingredients.filter(
        (i) => i.name.trim() !== "" && i.quantity.trim() !== ""
      ),
      steps: steps.filter((s) => s.trim() !== ""),
      createdAt: Timestamp.now(),
      createdBy: userId,
    });

    router.replace("/recipes");
  }

  return (
    <ScreenWrapper>
      <HomeHeader showBack onBackPress={() => router.back()} />

      <AppText style={styles.header} fontSize={22}>
        New Recipe
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

      <AppText style={styles.subHeader} fontSize={18}>
        Ingredients
      </AppText>

      <FlatList
        data={ingredients}
        keyExtractor={(_, i) => `ing-${i}`}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            {/* Ingredient name */}
            <TextInput
              style={[styles.input, styles.flexInput]}
              placeholder={`Ingredient ${index + 1}`}
              value={item.name}
              onChangeText={(text) => updateIngredientName(index, text)}
            />

            {/* Quantity */}
            <TextInput
              style={[styles.input, styles.qtyInput]}
              placeholder="Qty"
              value={item.quantity}
              keyboardType="numeric"
              onChangeText={(text) => updateIngredientQuantity(index, text)}
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

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <AppText style={styles.saveText} fontSize={18}>
          Save Recipe
        </AppText>
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: { fontWeight: "bold", marginBottom: 20 },
  subHeader: { fontWeight: "600", marginTop: 20, marginBottom: 8 },
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
  flexInput: { flex: 2, marginBottom: 0, marginRight: 8 },
  qtyInput: { flex: 1, marginBottom: 0 },
  deleteBtn: {
    backgroundColor: "red",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 8,
  },
  deleteText: { color: "#fff", fontWeight: "bold" },
  addBtn: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 12,
  },
  addBtnText: { fontWeight: "500" },
  saveBtn: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveText: { color: "#fff", fontWeight: "bold" },
});
