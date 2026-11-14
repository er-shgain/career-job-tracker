import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDPpUiTJpv5wpHncXOtkC1n6UL11aMMuXQ",
  authDomain: "career-job-tracker-c4b1b.firebaseapp.com",
  projectId: "career-job-tracker-c4b1b",
  storageBucket: "career-job-tracker-c4b1b.firebasestorage.app",
  messagingSenderId: "877631517771",
  appId: "1:877631517771:web:6f9050f2eefe8f3be7c9ce",
  measurementId: "G-PZQTP1P8Y4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);