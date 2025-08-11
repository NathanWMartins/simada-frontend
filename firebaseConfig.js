import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

//Credenciais nao estao reais, apos criar o banco de dados, atualizar
const firebaseConfig = {
    apiKey: "AIzaSyB8ZfiabXx2GAwmjSRv6a9ULI59T7UtaKs",
    authDomain: "prova2-b0988.firebaseapp.com",
    projectId: "prova2-b0988",
    storageBucket: "prova2-b0988.firebasestorage.app",
    messagingSenderId: "677657132468",
    appId: "1:677657132468:web:8f26c829d9e1f950eb46e1",
    measurementId: "G-NE2DLZ9KJZ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };