
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAZXYlzR20MNfqoXGFkwnw2y1wevaKCmUE",
  authDomain: "senacwork-f1a39.firebaseapp.com",
  projectId: "senacwork-f1a39",
  storageBucket: "senacwork-f1a39.firebasestorage.app",
  messagingSenderId: "305560512304",
  appId: "1:305560512304:web:cd6d9a3321aeb783ff8af5",
};

const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
