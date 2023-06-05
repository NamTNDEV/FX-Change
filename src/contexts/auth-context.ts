import type { User } from '@/types/model'
import { createContext, useContext } from 'react'

type AuthStateType = {
  user: User | null
  isValidating?: boolean
  signOut: () => void
  signIn: () => void
  redirectToLogin: () => void
}

const initialState: AuthStateType = {
  user: null,
  isValidating: false,
  signOut: () => {},
  signIn: () => {},
  redirectToLogin: () => {},
}

export const AuthContext = createContext(initialState)
export const AuthProvider = AuthContext.Provider

export const useAuth = () => {
  return useContext(AuthContext)
}
