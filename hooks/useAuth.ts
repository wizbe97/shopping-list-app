import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../src/firebaseConfig";

export function useAuth() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          // ✅ Always reload to get the latest displayName
          await u.reload();
        } catch (err) {
          console.warn("Failed to reload user", err);
        }
        setUserId(u.uid);
        setUserName(u.displayName ?? u.email ?? "Friend");
      } else {
        setUserId(null);
        setUserName(null);
      }
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

      // ✅ Immediately update local state so UI shows name instead of email
      setUserId(cred.user.uid);
      setUserName(name.trim());
    }
  }

  return { userId, userName, login, register };
}
