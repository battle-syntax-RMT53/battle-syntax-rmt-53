import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB8Yk6OXVNnKz-3Uw7VWKaY78-XAFv8lVE",
  authDomain: "battle-syntax-rmt53.firebaseapp.com",
  databaseURL:
    "https://battle-syntax-rmt53-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "battle-syntax-rmt53",
  storageBucket: "battle-syntax-rmt53.appspot.com",
  messagingSenderId: "982495258081",
  appId: "1:982495258081:web:7b8f18a270c75b210a5ea0",
  measurementId: "G-0TBDEHL23K",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default db;
