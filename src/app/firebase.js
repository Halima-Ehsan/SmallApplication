// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUCKFXFd5QIq-HKxAQnqMaGXbi7aCHr2Y",
  authDomain: "small-application-38e5f.firebaseapp.com",
  projectId: "small-application-38e5f",
  storageBucket: "small-application-38e5f.appspot.com",
  messagingSenderId: "268394763624",
  appId: "1:268394763624:web:377c7d13c4e3aaddfd72dd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);