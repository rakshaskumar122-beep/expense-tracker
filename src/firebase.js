import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDsaam0g2RuvREuPj434K4q-uvKX4s9q7Y",
  authDomain: "expense-tracker-5b92f.firebaseapp.com",
  projectId: "expense-tracker-5b92f",
  storageBucket: "expense-tracker-5b92f.firebasestorage.app",
  messagingSenderId: "145580839719",
  appId: "1:145580839719:web:dfbd2ae41f093591d78f02"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();