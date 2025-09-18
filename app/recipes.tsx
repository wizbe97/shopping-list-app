import { View, Text, StyleSheet } from "react-native";

export default function Recipes() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🍲 Recipes screen coming soon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, fontWeight: "600" },
});
