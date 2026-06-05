// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB1UPePTn6um9cLis674WQQqFU2cF5iXD4",
  authDomain: "project-tracker-9dfe9.firebaseapp.com",
  projectId: "project-tracker-9dfe9",
  storageBucket: "project-tracker-9dfe9.firebasestorage.app",
  messagingSenderId: "695229859490",
  appId: "1:695229859490:web:ea6678492cbfe25002f9fb",
  measurementId: "G-HT7VPSSPBT"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const collectionName = "projectTasks";

export { db, collectionName };