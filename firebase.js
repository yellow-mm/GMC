// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBszQ6ZdHCXr5WHLyb6KrBympclbe_vO_Y",
  authDomain: "projecttask-4ebcd.firebaseapp.com",
  projectId: "projecttask-4ebcd",
  storageBucket: "projecttask-4ebcd.firebasestorage.app",
  messagingSenderId: "1050303424719",
  appId: "1:1050303424719:web:437488df778fe719e36fba"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

const collectionName = "projectTasks";

// ── LINE Messaging API config (ใช้ร่วมกันทั้ง app) ──────────────────
const LINE_GROUP_ID = "C1709f44e14f0581ad25ff9803255b4e6";

export { db, collectionName, LINE_GROUP_ID };
