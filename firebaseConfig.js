// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBlfxQBwAIZeXlQ3VpG4rZSLy2zoLo0qZI",
  authDomain: "atlas-lumigram-3f535.firebaseapp.com",
  projectId: "atlas-lumigram-3f535",
  storageBucket: "atlas-lumigram-3f535.firebasestorage.app",
  messagingSenderId: "654245998605",
  appId: "1:654245998605:web:3a8e4c9f6e401054dd6544",
  measurementId: "G-5YYWL7VW1T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);