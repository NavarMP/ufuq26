// Firebase Client SDK Configuration
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDm6MoYqynJKskgnyBf_JVXivI4MajILZ0",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "ufuq26-adsa.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ufuq26-adsa",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "ufuq26-adsa.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "788772576685",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:788772576685:web:72fbcfc102a59a352b1524",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-7FV9KENMVD",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize analytics safely on browser only if supported
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      try {
        getAnalytics(app);
      } catch (e) {
        // Ignore analytics initialization errors in private/blocked modes
      }
    }
  });
}

export { app, auth, db, storage, firebaseConfig };
