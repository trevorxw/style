// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGmFQhYtncUzTpYnDT_CnHgBoHhfLJ2Bg",
  authDomain: "style-d2141.firebaseapp.com",
  projectId: "style-d2141",
  storageBucket: "style-d2141.appspot.com",
  messagingSenderId: "72632551221",
  appId: "1:72632551221:web:a9816062dae503740bee7c",
  measurementId: "G-BBMHPZS2H4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);