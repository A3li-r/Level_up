import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../lib/firebase'

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  isAnonymous: boolean
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  configured: boolean
  loginWithGoogle: () => Promise<void>
  loginWithEmail: (email: string, password: string) => Promise<void>
  registerWithEmail: (email: string, password: string, username: string) => Promise<void>
  continueAsGuest: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function toAuthUser(u: FirebaseUser): AuthUser {
  return {
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    photoURL: u.photoURL,
    isAnonymous: u.isAnonymous,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u ? toAuthUser(u) : null)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const loginWithGoogle = async () => {
    if (!auth) throw new Error('auth-not-configured')
    await signInWithPopup(auth, new GoogleAuthProvider())
  }

  const loginWithEmail = async (email: string, password: string) => {
    if (!auth) throw new Error('auth-not-configured')
    await signInWithEmailAndPassword(auth, email, password)
  }

  const registerWithEmail = async (email: string, password: string, username: string) => {
    if (!auth) throw new Error('auth-not-configured')
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName: username })
  }

  const continueAsGuest = async () => {
    if (!auth) throw new Error('auth-not-configured')
    await signInAnonymously(auth)
  }

  const logout = async () => {
    if (!auth) return
    await signOut(auth)
  }

  const value: AuthContextValue = {
    user,
    loading,
    configured: isFirebaseConfigured,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    continueAsGuest,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
