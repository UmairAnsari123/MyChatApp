
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBL9xJEHHfe5ATAhrAFBqlSbzROQCZ_DLw",
  authDomain: "mychatapp-1c009.firebaseapp.com",
  projectId: "mychatapp-1c009",
  storageBucket: "mychatapp-1c009.appspot.com",
  messagingSenderId: "591023850717",
  appId: "1:591023850717:web:8299152567e6a3c52ec734"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const storage = getStorage(app)
export const db =  getFirestore(app)