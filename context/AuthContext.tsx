import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
  User,
} from "firebase/auth";
import { auth } from "../src/firebaseConfig";

type AuthContextType = {
  userId: string | null;
  userName: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u: User | null) => {
      if (u) {
        try {
          await u.reload();
        } catch (err) {
          console.warn("Failed to reload user", err);
        }
        setUserId(u.uid);
        setUserName(u.displayName?.trim() || u.email || "Friend");
      } else {
        setUserId(null);
        setUserName(null);
      }
      setLoading(false);
    });

    return unsub;
  }, []);

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  }

  async function register(name: string, email: string, password: string) {
    const cred = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );

    if (cred.user && name.trim()) {
      await updateProfile(cred.user, { displayName: name.trim() });
      await cred.user.reload();
      setUserId(cred.user.uid);
      setUserName(name.trim());
    }
  }

  return (
    <AuthContext.Provider value={{ userId, userName, loading, login, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
