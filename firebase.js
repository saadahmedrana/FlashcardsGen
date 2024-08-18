import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAdIzZUrgOAU8ntnurwpmLLxYr4Q8QD6b4",
  authDomain: "flashcardsgen.firebaseapp.com",
  projectId: "flashcardsgen",
  storageBucket: "flashcardsgen.appspot.com",
  messagingSenderId: "487564457288",
  appId: "1:487564457288:web:e7200b68d9ada1a423ef7d",
  measurementId: "G-YX512T2364"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize Analytics only in browser
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { db, analytics };
