// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
    getAuth,
    initializeAuth,
    getReactNativePersistence,
} from "firebase/auth";
import * as SecureStore from 'expo-secure-store';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Persistor for React Native using Secure Storage

const secureStoragePersistor = getReactNativePersistence({
  async getItem(key) {
    return SecureStore.getItemAsync(replaceNonAlphaNumericValues(key));
  },
  setItem(key, value) {
    return SecureStore.setItemAsync(replaceNonAlphaNumericValues(key), value);
  },
  removeItem(key) {
    return SecureStore.deleteItemAsync(replaceNonAlphaNumericValues(key));
  },
});

const firebaseConfig = {
  apiKey: "AIzaSyBFc87-oHl_0WBt3oWc-yIlYcNIvoKaqHY",
  authDomain: "fitpic-59ecb.firebaseapp.com",
  projectId: "fitpic-59ecb",
  storageBucket: "fitpic-59ecb.appspot.com",
  messagingSenderId: "359106368965",
  appId: "1:359106368965:web:fe17c80a280e4c3a63e7ac",
  measurementId: "G-VGERV3C0ZP"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
initializeAuth(app, {
    persistence: secureStoragePersistor,
});
export const auth = getAuth(app);
