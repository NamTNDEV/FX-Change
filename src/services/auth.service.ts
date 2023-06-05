import { getSignInProvider } from '@/libs/auth'
import axiosClient from '@/libs/axios-client'
import { app } from '@/libs/firebase'
import { AuthResponse, User as UserState } from '@/types/model'
import { GoogleAuthProvider, User, getAuth, signInWithPopup, signOut } from 'firebase/auth'

class AuthServices {
  async signInWithProvider() {
    const auth = getAuth(app)
    const provider = getSignInProvider()
    await signInWithPopup(auth, provider)
  }
  async signInWithServer(token: string, userCredential?: User): Promise<UserState> {
    const result: AuthResponse = await axiosClient.post('auth/login', { idToken: token })

    return {
      email: result.data.email as string,
      full_name: result.data.full_name || null,
      photo_url: result.data.photo_url || null,
      role: result.data.role,
      uid: result.data.uid,
    }
  }
}

export default new AuthServices()

// export const AuthServices = {
//   signInWithProvider: async () => {
//     const auth = getAuth(app)
//     try {
//       const provider = getSignInProvider()
//       await signInWithPopup(auth, provider)
//     } catch (error) {
//       console.log('🚀 ~ file: auth.ts:31 ~ signInWithProvider: ~ error:', error)
//       signOut(auth)
//     }
//   },
//   signInWithServer: async (token: string, userCredential?: User): Promise<UserState> => {
//     const result: AuthResponse = await axiosClient.post('auth/login', { idToken: token })
//     console.log('🚀 ~ file: auth.ts:31 ~ signInWithServer: ~ result:', result)

//     return {
//       email: result.data.email as string,
//       full_name: result.data.full_name || null,
//       photo_url: result.data.photo_url || null,
//       role: result.data.role,
//       uid: result.data.uid,
//     }
//   },
// }
