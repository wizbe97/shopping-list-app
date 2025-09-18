import { signOut } from "firebase/auth";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Button,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { auth } from "../src/firebaseConfig";

const SCREEN_WIDTH = Dimensions.get("window").width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.25;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  userName: string | null;
  onLoggedOut: () => void;
};

export default function AuthDrawer({ isOpen, onClose, userName, onLoggedOut }: Props) {
  const slideX = useRef(new Animated.Value(DRAWER_WIDTH)).current;

  useEffect(() => {
    Animated.timing(slideX, {
      toValue: isOpen ? 0 : DRAWER_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  async function handleLogout() {
    await signOut(auth);
    onLoggedOut();
    onClose();
  }

  if (!isOpen) return null;

  return (
    <>
      {/* overlay */}
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1} />

      {/* drawer */}
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateX: slideX }],
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi {userName ?? "Friend"} 👋</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
        </View>

        <Button title="LOGOUT" color="red" onPress={handleLogout} />
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    zIndex: 999,
  },
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    width: DRAWER_WIDTH,
    backgroundColor: "#fff",
    padding: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    zIndex: 1000,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  greeting: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    right: 0,
    padding: 8,
  },
  close: {
    fontSize: 22,
  },
});
