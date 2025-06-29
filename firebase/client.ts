import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBzjQrpiNaYZDqLMF1nmeboLy_w3TdfLgU",
  authDomain: "interviewer-d63b1.firebaseapp.com",
  projectId: "interviewer-d63b1",
  storageBucket: "interviewer-d63b1.firebasestorage.app",
  messagingSenderId: "807875558463",
  appId: "1:807875558463:web:32b7c619b9a56438be4c8a",
  measurementId: "G-YF304V1BM8"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) :getApp()

export const auth = getAuth(app);

export const db = getFirestore(app)