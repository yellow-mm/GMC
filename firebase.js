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
const db  = getFirestore(app);

const collectionName = "projectTasks";

// ── LINE Messaging API config (ใช้ร่วมกันทั้ง app) ──────────────────
const LINE_GROUP_ID = "C1709f44e14f0581ad25ff9803255b4e6";

export { db, collectionName, LINE_GROUP_ID };
