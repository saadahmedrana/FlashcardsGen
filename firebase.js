import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCz2kKiEnCGeEO2jP9zi0csa-aevISwJPA",
    authDomain: "flashcard-saas-ec404.firebaseapp.com",
    projectId: "flashcard-saas-ec404",
    storageBucket: "flashcard-saas-ec404.appspot.com",
    messagingSenderId: "584732940291",
    appId: "1:584732940291:web:f571aa2158443b54f55636",
    measurementId: "G-D9D8LTWD73"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export default db;