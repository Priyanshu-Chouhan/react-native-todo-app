import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDKzo7xw7Kr2Bud6fw9JQg3beQKXzApbcI",
  authDomain: "todo-app-rn-3981b.firebaseapp.com",
  projectId: "todo-app-rn-3981b",
  storageBucket: "todo-app-rn-3981b.firebasestorage.app",
  messagingSenderId: "555963418419",
  appId: "1:555963418419:web:42f945704764eccd37e046",
  measurementId: "G-2DLN53EJQ9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);