// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDiDqEgSwNePLJpDFIYrdhWbvj6IW2EtOQ",
  authDomain: "cissa-sodiq.firebaseapp.com",
  projectId: "cissa-sodiq",
  storageBucket: "cissa-sodiq.firebasestorage.app",
  messagingSenderId: "189303698771",
  appId: "1:189303698771:web:1980e5169e98b99a811da6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app