import { StyleSheet, Text, View } from "react-native";

export default function ShoppingList() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🛒 Shopping List screen coming soon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
  },
});
