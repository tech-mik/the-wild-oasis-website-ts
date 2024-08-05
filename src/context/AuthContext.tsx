'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { useSession, signOut as authSignOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { User } from 'next-auth'

interface IAuthContext {
  user: User | null
  loading: boolean
  signOut: () => void
}

const AuthContext = createContext<IAuthContext | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true)
    } else {
      setUser(session?.user || null)
      setLoading(false)
    }
  }, [session, status])

  async function signOut() {
    await authSignOut({ redirect: true, callbackUrl: '/' })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
