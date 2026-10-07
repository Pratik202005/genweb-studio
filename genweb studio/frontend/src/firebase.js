import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyDummyKeyForStartupTesting123456",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "genweb-studio.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "genweb-studio",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "genweb-studio.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup, signOut };
