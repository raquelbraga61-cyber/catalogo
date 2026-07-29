import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyByrdxab4lT8wvZAD9mpjUhMwNM4KWCN0U",
  authDomain: "sacolao-f7cfe.firebaseapp.com",
  projectId: "sacolao-f7cfe",
  storageBucket: "sacolao-f7cfe.firebasestorage.app",
  messagingSenderId: "777051963146",
  appId: "1:777051963146:web:d924c0b9267b126b92c4f3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
