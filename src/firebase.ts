import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBX4Bla_hbRja6N7iTaEkNCL3M3AAdjZnY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "kiosk-6b105.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "kiosk-6b105",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "kiosk-6b105.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "700718255587",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:700718255587:web:376866215716ceddf7e4d6",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-2HKF6JKTY7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth and sign in anonymously
export const auth = getAuth(app);
signInAnonymously(auth).catch((error) => {
  console.warn("Client Firebase anonymous sign-in failed:", error);
});

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
