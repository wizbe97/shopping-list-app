// context/HouseholdContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Household, useHouseholds } from "../hooks/useHouseholds";

type HouseholdContextType = {
  households: Household[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  createHousehold: (name: string) => Promise<void>;
  leaveHousehold: (id: string) => Promise<void>;
};

const HouseholdContext = createContext<HouseholdContextType | undefined>(undefined);

export function HouseholdProvider({
  userId,
  children,
}: {
  userId: string | null;
  children: React.ReactNode;
}) {
  const { households, createHousehold, leaveHousehold } = useHouseholds(userId);
  const [selectedId, setSelectedIdState] = useState<string | null>(null);

  // Load last household from storage on mount
  useEffect(() => {
    if (!userId) {
      setSelectedIdState(null);
      return;
    }

    (async () => {
      const stored = await AsyncStorage.getItem(`lastHousehold_${userId}`);
      if (stored) {
        setSelectedIdState(stored);
      }
    })();
  }, [userId]);

  // Save when it changes
  const setSelectedId = (id: string | null) => {
    setSelectedIdState(id);
    if (userId && id) {
      AsyncStorage.setItem(`lastHousehold_${userId}`, id);
    }
  };

  // Ensure we always have a household selected if available
  useEffect(() => {
    if (!selectedId && households.length > 0) {
      setSelectedId(households[0].id);
    }
  }, [households]);

  return (
    <HouseholdContext.Provider
      value={{
        households,
        selectedId,
        setSelectedId,
        createHousehold,
        leaveHousehold,
      }}
    >
      {children}
    </HouseholdContext.Provider>
  );
}

export function useHouseholdContext() {
  const ctx = useContext(HouseholdContext);
  if (!ctx) throw new Error("useHouseholdContext must be used inside HouseholdProvider");
  return ctx;
}
