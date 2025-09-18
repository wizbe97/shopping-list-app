// src/firebaseConfig.js

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
    getAuth,
    getReactNativePersistence,
    initializeAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCly_D8aKZ1fYvzTOq6VQRGcFkRf6swpzI",
  authDomain: "shopping-list-75e89.firebaseapp.com",
  projectId: "shopping-list-75e89",
  storageBucket: "shopping-list-75e89.firebasestorage.app",
  messagingSenderId: "554223237238",
  appId: "1:554223237238:web:c45b7ecec0f3fbe72a0757",
  measurementId: "G-P8YBQ4FD0V",
};

// Avoid re-initializing if already initialized
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth setup
// On native (Android/iOS), we need AsyncStorage for auth persistence
const auth =
  Platform.OS === "web"
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });

// Firestore
const db = getFirestore(app);

export { app, auth, db };

