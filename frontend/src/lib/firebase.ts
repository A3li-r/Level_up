import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'levelup-533c4.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'levelup-533c4',
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// The login screen only activates when a real web config is present.
// With placeholders (or no key) the app keeps running exactly as before.
export const isFirebaseConfigured =
  typeof firebaseConfig.apiKey === 'string' &&
  firebaseConfig.apiKey.length > 0 &&
  firebaseConfig.apiKey !== 'YOUR_API_KEY' &&
  typeof firebaseConfig.appId === 'string' &&
  firebaseConfig.appId.length > 0 &&
  firebaseConfig.appId !== 'YOUR_APP_ID'

let app: FirebaseApp | null = null
let auth: Auth | null = null

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
}

export { auth }
