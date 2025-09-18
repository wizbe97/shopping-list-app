// import React, { useState } from "react";
// import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
// import { db, auth } from "../src/firebaseConfig";
// import { doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
// import { useRouter } from "expo-router";
// import { v4 as uuidv4 } from "uuid"; // install with: npm install uuid

// export default function CreateHousehold() {
//   const [householdName, setHouseholdName] = useState("");
//   const router = useRouter();

//   async function handleCreate() {
//     if (!householdName.trim()) {
//       Alert.alert("Please enter a household name");
//       return;
//     }

//     try {
//       const householdId = uuidv4(); // generate a unique ID
//       const user = auth.currentUser;

//       if (!user) {
//         Alert.alert("You must be logged in to create a household.");
//         return;
//       }

//       // 1. Create household doc
//       await setDoc(doc(db, "households", householdId), {
//         name: householdName,
//         createdBy: user.uid,
//         members: [user.uid],
//         recurringItems: [],
//         recipes: {},
//         shoppingList: [],
//         createdAt: new Date(),
//       });

//       // 2. Update user doc
//       await updateDoc(doc(db, "users", user.uid), {
//         households: arrayUnion(householdId),
//         lastHousehold: householdId,
//       });

//       Alert.alert("Household created!", `Welcome to ${householdName}`);
//       router.replace("/home"); // go to the home screen
//     } catch (e: any) {
//       Alert.alert("Error creating household", e.message);
//     }
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Create Your Household</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Enter household name"
//         placeholderTextColor="#666"
//         value={householdName}
//         onChangeText={setHouseholdName}
//       />
//       <Button title="Create Household" onPress={handleCreate} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//     backgroundColor: "#fff",
//   },
//   title: {
//     fontSize: 22,
//     marginBottom: 20,
//     fontWeight: "600",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 10,
//     width: "80%",
//     borderRadius: 6,
//     marginBottom: 20,
//   },
// });
