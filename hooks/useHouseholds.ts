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

  async function createHousehold(name: string) {
    if (!userId || !name.trim()) return;
    await addDoc(collection(db, "households"), {
      name: name.trim(),
      members: [userId],
      createdAt: Timestamp.now(),
    });
  }

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
