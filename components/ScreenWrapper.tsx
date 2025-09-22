// components/ScreenWrapper.tsx
import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  children: React.ReactNode;
};

export default function ScreenWrapper({ children }: Props) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    paddingHorizontal: "10%", // 👈 now all screens get 10% side margins
    paddingVertical: 12,
  },
});

