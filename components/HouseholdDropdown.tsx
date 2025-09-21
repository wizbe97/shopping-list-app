// components/HouseholdDropdown.tsx
import React, { useState } from "react";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useHouseholdContext } from "../context/HouseholdContext";

export default function HouseholdDropdown() {
  const { households, selectedId, setSelectedId, createHousehold, leaveHousehold } =
    useHouseholdContext();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");

  const selected = households.find((h) => h.id === selectedId) ?? null;
  const MAX_LENGTH = 30;

  return (
    <View style={{ width: "100%", alignItems: "center" }}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setDropdownOpen(!dropdownOpen)}
      >
        <Text style={[styles.name, styles.selectedName]}>
          {selected ? selected.name : "Select Household"}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      {dropdownOpen && (
        <View style={styles.dropdown}>
          {households
            .filter((h) => h.id !== selectedId)
            .map((h) => (
              <View key={h.id} style={styles.itemRow}>
                <Pressable
                  style={({ hovered }) => [
                    styles.item,
                    hovered && { backgroundColor: "#f0f0f0" },
                  ]}
                  onPress={() => {
                    setSelectedId(h.id);
                    setDropdownOpen(false);
                  }}
                >
                  <Text style={styles.itemText}>{h.name}</Text>
                </Pressable>

                <TouchableOpacity
                  style={styles.leaveButton}
                  onPress={() => leaveHousehold(h.id)}
                >
                  <Text style={styles.leaveButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}

          {!adding ? (
            <TouchableOpacity style={styles.add} onPress={() => setAdding(true)}>
              <Text>➕ Add a new household</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.addRow}>
              <TextInput
                style={styles.input}
                placeholder="Household name"
                value={newName}
                onChangeText={(text) => {
                  if (text.length <= MAX_LENGTH) setNewName(text);
                }}
                maxLength={MAX_LENGTH}
              />
              <Button
                title="Create"
                onPress={() => {
                  createHousehold(newName.trim().slice(0, MAX_LENGTH));
                  setNewName("");
                  setAdding(false);
                }}
                disabled={newName.trim().length < 1}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: { flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 10, borderWidth: 1, borderRadius: 6, backgroundColor: "#fff", width: "100%" },
  name: { flex: 1, textAlign: "center" },
  selectedName: { fontWeight: "bold" },
  arrow: { position: "absolute", right: 10 },
  dropdown: { marginTop: 6, borderWidth: 1, borderRadius: 6, backgroundColor: "#fff", width: "100%" },
  itemRow: { flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#eee" },
  item: { flex: 1, padding: 10 },
  itemText: { textAlign: "center" },
  leaveButton: { backgroundColor: "red", paddingHorizontal: 10, paddingVertical: 6, borderTopRightRadius: 4, borderBottomRightRadius: 4, marginRight: 4 },
  leaveButtonText: { color: "white", fontWeight: "bold" },
  add: { padding: 10, alignItems: "center", backgroundColor: "#f9f9f9" },
  addRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 8 },
  input: { flex: 1, borderWidth: 1, padding: 6, marginRight: 6, textAlign: "center" },
});
