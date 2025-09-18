import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import {
    addDoc,
    collection,
    onSnapshot,
    query,
    Timestamp,
    where,
} from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import {
    Button,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import AuthDrawer from "../components/AuthDrawer";
import { auth, db } from "../src/firebaseConfig";

const SCREEN_WIDTH = Dimensions.get("window").width;
const TILE_SIZE = 150;
const TILE_GAP = 20;
const BLOCK_WIDTH = TILE_SIZE * 2 + TILE_GAP;

type Household = { id: string; name: string; members: string[] };

export default function Home() {
  // auth state
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  // login/register form
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // drawer
  const [drawerOpen, setDrawerOpen] = useState(false);

  // households
  const [households, setHouseholds] = useState<Household[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [addingInline, setAddingInline] = useState(false);
  const [newHouseholdName, setNewHouseholdName] = useState("");
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string | null>(null);

  const selectedHousehold = useMemo(
    () => households.find((h) => h.id === selectedHouseholdId) ?? null,
    [households, selectedHouseholdId]
  );

  // Listen to auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUserId(u.uid);
        setUserName(u.displayName ?? u.email ?? "Friend");

        const q = query(
          collection(db, "households"),
          where("members", "array-contains", u.uid)
        );
        const live = onSnapshot(q, (snap) => {
          const list: Household[] = [];
          snap.forEach((d) => list.push({ id: d.id, ...(d.data() as any) }));
          setHouseholds(list);
          if (!selectedHouseholdId && list.length > 0) {
            setSelectedHouseholdId(list[0].id);
          }
        });
        return () => live();
      } else {
        setUserId(null);
        setUserName(null);
        setHouseholds([]);
        setSelectedHouseholdId(null);
      }
    });
    return unsub;
  }, []);

  // ---------- Auth ----------
  async function handleLogin() {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setErrorMessage(null);
      resetForm();
    } catch (e: any) {
      setErrorMessage("Invalid email or password.");
    }
  }

  async function handleRegister() {
    try {
      const cred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      if (cred.user && name.trim()) {
        await updateProfile(cred.user, { displayName: name.trim() });
        await cred.user.reload();
      }
      setErrorMessage(null);
      resetForm();
    } catch (e: any) {
      setErrorMessage(e.message);
    }
  }

  function resetForm() {
    setName("");
    setEmail("");
    setPassword("");
    setIsLogin(true);
  }

  // ---------- Households ----------
  async function handleCreateHouseholdInline() {
    if (!userId || !newHouseholdName.trim()) return;
    const docRef = await addDoc(collection(db, "households"), {
      name: newHouseholdName.trim(),
      members: [userId],
      createdAt: Timestamp.now(),
    });
    setNewHouseholdName("");
    setAddingInline(false);
    setSelectedHouseholdId(docRef.id);
  }

  // ---------- UI ----------
  if (!userId) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={styles.centered}
      >
        <Text style={styles.welcome}>Welcome to Wiz Shopping</Text>

        <View style={styles.authCard}>
          {!isLogin && (
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="#666"
              value={name}
              onChangeText={setName}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

          <View style={styles.buttonGroup}>
            <Button
              title={isLogin ? "Login" : "Register"}
              onPress={isLogin ? handleLogin : handleRegister}
            />
            <View style={{ height: 10 }} />
            <Button
              title={
                isLogin
                  ? "Need an account? Register"
                  : "Already have an account? Login"
              }
              onPress={() => {
                setIsLogin(!isLogin);
                setErrorMessage(null);
                setName("");
                setEmail("");
                setPassword("");
              }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={{ width: 32 }} />
        <View style={styles.householdArea}>
          <TouchableOpacity
            style={[
              styles.householdButton,
              { width: BLOCK_WIDTH },
              selectedHousehold && styles.householdSelected,
            ]}
            onPress={() => setDropdownOpen(!dropdownOpen)}
            activeOpacity={0.8}
          >
            <Text style={styles.householdText} numberOfLines={1}>
              {selectedHousehold ? selectedHousehold.name : "Select Household"}
            </Text>
            <Text style={styles.chev}>▼</Text>
          </TouchableOpacity>

          {dropdownOpen && (
            <View style={[styles.dropdownPanel, { width: BLOCK_WIDTH }]}>
              {households
                .filter((h) => h.id !== selectedHouseholdId) // hide current household
                .map((h) => (
                  <Pressable
                    key={h.id}
                    style={({ hovered, pressed }) => [
                      styles.dropdownItem,
                      (hovered || pressed) && styles.dropdownHover,
                    ]}
                    onPress={() => {
                      setSelectedHouseholdId(h.id);
                      setDropdownOpen(false);
                      setAddingInline(false);
                    }}
                  >
                    <Text>{h.name}</Text>
                  </Pressable>
                ))}

              {!addingInline ? (
                <TouchableOpacity
                  style={styles.addRow}
                  onPress={() => setAddingInline(true)}
                  activeOpacity={0.6}
                >
                  <Text style={{ color: "#666" }}>➕ Add a new household</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.inlineAdd}>
                  <TextInput
                    style={styles.inlineInput}
                    placeholder="Household name"
                    value={newHouseholdName}
                    onChangeText={setNewHouseholdName}
                  />
                  <Button
                    title="Create"
                    onPress={handleCreateHouseholdInline}
                    disabled={newHouseholdName.trim().length < 1}
                  />
                </View>
              )}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.profileBtn}
          onPress={() => setDrawerOpen(true)}
        >
          <Text style={{ fontSize: 22 }}>👤</Text>
        </TouchableOpacity>
      </View>

      {selectedHousehold && (
        <View style={styles.inviteWrap}>
          <Button
            title="➕ Invite Member"
            onPress={() => alert("Invite flow coming soon")}
          />
        </View>
      )}

      <View style={styles.tilesRow}>
        <TouchableOpacity
          style={[styles.tile, { width: TILE_SIZE, height: TILE_SIZE }]}
        >
          <Text style={styles.tileText}>🍲{"\n"}Recipes</Text>
        </TouchableOpacity>
        <View style={{ width: TILE_GAP }} />
        <TouchableOpacity
          style={[styles.tile, { width: TILE_SIZE, height: TILE_SIZE }]}
        >
          <Text style={styles.tileText}>🛒{"\n"}Shopping List</Text>
        </TouchableOpacity>
      </View>

      <AuthDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        userName={userName}
        onLoggedOut={() => {
          setDropdownOpen(false);
          setAddingInline(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7F7F7" },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 24,
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  householdArea: { alignItems: "center" },
  householdButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  householdSelected: {
    backgroundColor: "#f2f2f2", // highlight selected at top
  },
  householdText: {
    fontSize: 16,
    fontWeight: "600",
    maxWidth: BLOCK_WIDTH - 30,
    textAlign: "center",
  },
  chev: { marginLeft: 8, fontSize: 12 },
  dropdownPanel: {
    marginTop: 6,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 4,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownHover: {
    backgroundColor: "#f9f9f9", // hover/press feedback
  },
  addRow: {
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  inlineAdd: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
  },
  inlineInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#fff",
    marginRight: 8,
  },
  profileBtn: { width: 32, alignItems: "flex-end" },
  inviteWrap: { alignItems: "center", marginTop: 12 },
  tilesRow: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  tile: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e4e4e4",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  tileText: { textAlign: "center", fontSize: 16, fontWeight: "600" },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    padding: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  authCard: {
    width: "90%",
    maxWidth: 400,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  error: { color: "red", marginBottom: 10, textAlign: "center" },
  buttonGroup: { marginTop: 6 },
});
