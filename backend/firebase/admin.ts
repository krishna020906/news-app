// backend/firebase/admin.ts
import admin from "firebase-admin";

let privateKey = process.env.FIREBASE_PRIVATE_KEY;
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

if (!projectId || !clientEmail || !privateKey) {
  throw new Error("Missing Firebase admin env vars");
}

// Convert escaped newlines in private key
if (privateKey.includes("\\n")) {
  privateKey = privateKey.replace(/\\n/g, "\n");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

export default admin;
