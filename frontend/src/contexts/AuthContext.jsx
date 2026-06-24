import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getUserFromToken, initKeycloak, keycloak } from '@/services/keycloak.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [ready, setReady] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    let mounted = true

    initKeycloak()
      .then((authenticated) => {
        if (!mounted) return
        setUser(authenticated ? getUserFromToken() : null)
      })
      .finally(() => {
        if (mounted) setReady(true)
      })

    return () => {
      mounted = false
    }
  }, [])

  function login() {
    keycloak.login({ redirectUri: `${window.location.origin}/dashboard` })
  }

  function register() {
    keycloak.register({ redirectUri: `${window.location.origin}/dashboard` })
  }

  function logout() {
    keycloak.logout({ redirectUri: `${window.location.origin}/login` })
  }

  const value = useMemo(
    () => ({ ready, user, login, register, logout, token: keycloak.token }),
    [ready, user]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
