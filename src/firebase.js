// Import the functions you need from the SDKs you need
import * as firebase from 'firebase/app'
import { getMessaging, isSupported } from 'firebase/messaging'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

export const initialize = (
  FIREBASE_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MSG_SENDER_ID,
  APP_ID,
  MEASUREMENT_ID
) => {
  const firebaseConfig = {
    apiKey: "AIzaSyC-nxX2NmCHwYT_Jj4cUULJUKS66znaftY",
    authDomain: "web-app-7ee3f.firebaseapp.com",
    projectId: "web-app-7ee3f",
    storageBucket: "web-app-7ee3f.appspot.com",
    messagingSenderId: "377855524444",
    appId: "1:377855524444:web:1916685ff5d1b0fee07099",
    measurementId: "G-KRCX1KE49J"
  };

  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig)
  const messaging = getMessaging(app)
  return messaging
}
export const isFirebaseSupported = async() => {
  return await isSupported()
}
