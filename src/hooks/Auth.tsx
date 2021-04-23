import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import api from '../services/api'
import AsyncStorage from '@react-native-community/async-storage'

interface User {
  id: string
  name: string
  email: string
  avatar_url: string
}

interface AuthState {
  token: string
  user: User
}

interface SignInCredentials {
  email: string
  password: string
}

interface AuthContextData {
  user: User
  loading: boolean
  updateUser(user: User): void
  signIn(credentials: SignInCredentials): Promise<void>
  signOut(): void
}

const Auth = createContext<AuthContextData>({} as AuthContextData)

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      const [token, user] = await AsyncStorage.multiGet([
        '@gobarber:token',
        '@gobarber:user'
      ])

      if (token[1] && user[1]) {
        setData({
          token: token[1],
          user: JSON.parse(user[1])
        })
        api.defaults.headers.authorization = `Bearer ${token[1]}`
      }

      setLoading(false)
    }

    loadStorageData()
  }, [])

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password
    })

    const { token, user } = response.data

    await AsyncStorage.multiSet([
      ['@gobarber:token', token],
      ['@gobarber:user', JSON.stringify(user)]
    ])

    api.defaults.headers.authorization = `Bearer ${token}`

    setData({ token: token, user })
  }, [])

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@gobarber:token', '@gobarber:user'])

    setData({} as AuthState)
  }, [])

  const updateUser = useCallback(
    async (user: User) => {
      await AsyncStorage.setItem('@gobarber:user', JSON.stringify(user))

      setData({
        token: data.token,
        user
      })
    },
    [setData, data.token]
  )

  return (
    <Auth.Provider
      value={{ user: data.user, signIn, signOut, updateUser, loading }}
    >
      {children}
    </Auth.Provider>
  )
}

function useAuth(): AuthContextData {
  const context = useContext(Auth)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}

export { AuthProvider, useAuth }
