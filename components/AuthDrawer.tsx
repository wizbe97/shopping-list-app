import { signOut } from "firebase/auth";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../src/firebaseConfig";
import { AppText } from "./ScreenWrapper";

const SCREEN_WIDTH = Dimensions.get("window").width;
const DRAWER_WIDTH = SCREEN_WIDTH / 3;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  userName: string | null;
  onLoggedOut: () => void;
};

export default function AuthDrawer({
  isOpen,
  onClose,
  userName,
  onLoggedOut,
}: Props) {
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
      <TouchableOpacity
        style={styles.overlay}
        onPress={onClose}
        activeOpacity={1}
      />

      <Animated.View
        style={[
          styles.drawer,
          { transform: [{ translateX: slideX }] },
        ]}
      >
        {/* Red Close button with white X */}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <AppText style={styles.closeText} fontSize={20}>
            ✕
          </AppText>
        </TouchableOpacity>

        {/* Greeting */}
        <View style={styles.greetingWrapper}>
          <AppText fontSize={18}>Hi {userName ?? "Friend"} 👋</AppText>
        </View>

        {/* Logout button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <AppText style={styles.logoutText} fontSize={18}>
            LOGOUT
          </AppText>
        </TouchableOpacity>
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
    top: 0, bottom: 0, right: 0,
    width: DRAWER_WIDTH,
    backgroundColor: "#fff",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    zIndex: 1000,
    paddingHorizontal: 16,
    paddingTop: "10%",
  },
  closeBtn: {
    backgroundColor: "red",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: "2%", // slight drop from top
  },
  closeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  greetingWrapper: {
    marginTop: 30,
    alignItems: "center",
  },
  logoutBtn: {
    position: "absolute",
    bottom: "5%",
    left: 16,
    right: 16,
    backgroundColor: "red",
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
