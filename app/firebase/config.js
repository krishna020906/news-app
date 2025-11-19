// // firebase/config.js
// import { initializeApp, getApps, getApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
// };

// const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// // Only initialize analytics in the browser
// let analytics;
// if (typeof window !== "undefined") {
//   try {
//     analytics = getAnalytics(app);
//   } catch (err) {
//     // analytics might fail on SSR or with missing measurementId; ignore safely
//     console.warn("Firebase analytics not initialized:", err);
//   }
// }

// const auth = getAuth(app);

// export { app, auth, analytics };





// Import the functions you need from the SDKs you need
import { initializeApp , getApps , getApp , } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FREBASE_MESSAGING_SENDER_ID,
  appId:process.env.NEXT_PUBLIC_FREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FREBASE_MEASUREMENT_ID
};

// Initialize Firebase


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app)

export {app, auth}