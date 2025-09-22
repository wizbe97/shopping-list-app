// hooks/useHouseholds.ts
import {
  addDoc,
  arrayRemove,
  collection,
  doc,
  onSnapshot,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../src/firebaseConfig";

export type Household = { id: string; name: string; members: string[] };

export function useHouseholds(userId: string | null) {
  const [households, setHouseholds] = useState<Household[]>([]);

  useEffect(() => {
    if (!userId) {
      setHouseholds([]);
      return;
    }

    const q = query(
      collection(db, "households"),
      where("members", "array-contains", userId)
    );

    const unsub = onSnapshot(q, (snap) => {
      const list: Household[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...(d.data() as any) }));
      setHouseholds(list);
    });

    return () => unsub();
  }, [userId]);

  /**
   * Create a new household for this user and return its ID.
   */
  async function createHousehold(name: string): Promise<string | null> {
    if (!userId || !name.trim()) return null;

    const docRef = await addDoc(collection(db, "households"), {
      name: name.trim(),
      members: [userId],
      createdAt: Timestamp.now(),
    });

    return docRef.id; // 👈 return the ID so HouseholdContext can auto-select it
  }

  /**
   * Remove this user from a household.
   */
  async function leaveHousehold(householdId: string) {
    if (!userId) return;
    const ref = doc(db, "households", householdId);
    await updateDoc(ref, {
      members: arrayRemove(userId),
    });
  }

  return {
    households,
    createHousehold,
    leaveHousehold,
  };
}
