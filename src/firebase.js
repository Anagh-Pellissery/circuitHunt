// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-1MFjf6trEEIaLjB19A1ape4-id_vAYM",
  authDomain: "sellbuy-e0661.firebaseapp.com",
  projectId: "sellbuy-e0661",
  storageBucket: "sellbuy-e0661.firebasestorage.app",
  messagingSenderId: "385522383388",
  appId: "1:385522383388:web:390dd95e078c4cee933dd9",
  measurementId: "G-SJS3M2VWF8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
