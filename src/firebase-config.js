//handles connecting to firebase database

import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBSwcSwOnA2sPppSfgSJH0fURcu6zPDyHQ",
  authDomain: "project-db-f51c8.firebaseapp.com",
  projectId: "project-db-f51c8",
  storageBucket: "project-db-f51c8.appspot.com",
  messagingSenderId: "981692791011",
  appId: "1:981692791011:web:9ed4422b7f288f197a6dd6",
  measurementId: "G-0TK9DGLJ0X"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);