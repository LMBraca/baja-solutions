// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "baja-solutions.firebaseapp.com",
  projectId: "baja-solutions",
  storageBucket: "baja-solutions.firebasestorage.app",
  messagingSenderId: "209385219426",
  appId: "1:209385219426:web:a265da59715d79f672783b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);