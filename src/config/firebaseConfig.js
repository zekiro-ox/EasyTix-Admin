// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGB8n15ba9HlEGiFREJPCYTacNby1SXtk",
  authDomain: "easytix-24a63.firebaseapp.com",
  projectId: "easytix-24a63",
  storageBucket: "easytix-24a63.appspot.com",
  messagingSenderId: "1038735170459",
  appId: "1:1038735170459:web:5d67f0e73ef41e68809f3e",
  measurementId: "G-LLH64NKSFF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
