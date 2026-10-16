import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyATXoHKfDF-4BQgt-i_hWjNJg_PRKdRSiI",
  authDomain: "suratbazar-b8521.firebaseapp.com",
  projectId: "suratbazar-b8521",
  storageBucket: "suratbazar-b8521.firebasestorage.app",
  messagingSenderId: "1004162728078",
  appId: "1:1004162728078:web:a3c1dd43b873c2abdfc9df"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const testOrderIds = [
  "SHR-114975",
  "SHR-182258",
  "SHR-245678",
  "SHR-408944",
  "SHR-448261",
  "SHR-501019",
  "SHR-633573",
  "SHR-764314",
  "SHR-818165"
];

async function clearTestOrders() {
  console.log(`Starting cleanup of ${testOrderIds.length} test orders...`);
  let successCount = 0;
  for (const id of testOrderIds) {
    try {
      const orderRef = doc(db, "orders", id);
      const snap = await getDoc(orderRef);
      if (snap.exists()) {
        await updateDoc(orderRef, {
          isDeleted: true,
          deletedAt: new Date().toISOString(),
          status: "Cancelled"
        });
        console.log(`✓ Marked test order ${id} as isDeleted: true`);
        successCount++;
      } else {
        console.log(`- Order ${id} does not exist`);
      }
    } catch (err) {
      console.error(`✗ Failed for order ${id}:`, err.code, err.message);
    }
  }
  console.log(`\nCleanup complete: ${successCount}/${testOrderIds.length} test orders updated.`);
  process.exit(0);
}

clearTestOrders();
