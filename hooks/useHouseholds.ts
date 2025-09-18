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

type Household = { id: string; name: string; members: string[] };

export function useHouseholds(userId: string | null) {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setHouseholds([]);
      setSelectedId(null);
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
      if (!selectedId && list.length > 0) {
        setSelectedId(list[0].id);
      }
    });

    return () => unsub();
  }, [userId]);

  async function createHousehold(name: string) {
    if (!userId || !name.trim()) return;
    const docRef = await addDoc(collection(db, "households"), {
      name: name.trim(),
      members: [userId],
      createdAt: Timestamp.now(),
    });
    setSelectedId(docRef.id);
  }

  async function leaveHousehold(householdId: string) {
    if (!userId) return;
    const ref = doc(db, "households", householdId);
    await updateDoc(ref, {
      members: arrayRemove(userId),
    });
    if (selectedId === householdId) {
      setSelectedId(null);
    }
  }

  return {
    households,
    selectedId,
    setSelectedId,
    createHousehold,
    leaveHousehold,
  };
}
