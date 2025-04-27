// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAC7Kf8QIsHAexX2Mx0DPTNLSK6HULFwNc",
  authDomain: "yourmood-app.firebaseapp.com",
  projectId: "yourmood-app",
  storageBucket: "yourmood-app.firebasestorage.app",
  messagingSenderId: "471481821360",
  appId: "1:471481821360:web:bd51836929c12b7b1af375"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export initialized instances and utilities
export { auth, db, storage, getDownloadURL, ref };
