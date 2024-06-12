
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getStorage} from "firebase/storage";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyDx_5FIl4pbt46ImnhIknUcyINp_u8LKUc",
  authDomain: "prochat-8b98e.firebaseapp.com",
  projectId: "prochat-8b98e",
  storageBucket: "prochat-8b98e.appspot.com",
  messagingSenderId: "442604449719",
  appId: "1:442604449719:web:16ea4242d898ad405e0232"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
