// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCW4G1nCSW1hw07twsmAOHRy2JLGcBjozc",
  authDomain: "skillswap-89d45.firebaseapp.com",
  databaseURL: "https://skillswap-89d45-default-rtdb.firebaseio.com",
  projectId: "skillswap-89d45",
  storageBucket: "skillswap-89d45.firebasestorage.app",
  messagingSenderId: "713329513565",
  appId: "1:713329513565:web:1f9975122f6e0266a7a9b4",
  measurementId: "G-PFM6L0RJCB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
export { database };
