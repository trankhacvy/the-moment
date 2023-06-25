import { User } from "@/types/schema"
import React, { PropsWithChildren, createContext, useCallback, useEffect, useState, useContext } from "react"
import { client } from "./api"
import { FetcherError } from "./fetcher"
import { useRouter } from "next/router"

const AUTH_TOKEN_KEY = "the-moment-token"

interface AuthContextValues {
  isLoggedIn: boolean
  isLoading: boolean
  user?: User
  login: (email: string, password: string) => void
  logout: () => void
}

const Context = createContext<AuthContextValues | undefined>(undefined)
Context.displayName = "Auth"

export function useAuthContext() {
  const context = useContext(Context)

  return context as AuthContextValues
}

const unprotectedPaths = ["/", "/login", "/register"]

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { pathname, replace } = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(!unprotectedPaths.includes(pathname) || !pathname.startsWith("/claim/"))
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User>()

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await client.login(email, password)
      if (response.token) {
        client.setAuthToken(response.token.accessToken)
        window.localStorage.setItem(AUTH_TOKEN_KEY, response.token.accessToken)
        setIsLoggedIn(true)
      }
    } catch (error) {
      console.error(error)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      client.clearAuthToken()
      window.localStorage.removeItem(AUTH_TOKEN_KEY)
      setIsLoggedIn(false)
      setUser(undefined)
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    setIsLoggedIn(!!window.localStorage.getItem(AUTH_TOKEN_KEY))
  }, [])

  useEffect(() => {
    if (!isLoggedIn) return

    const token = window.localStorage.getItem(AUTH_TOKEN_KEY)

    if (!token) {
      return
    }
    client.setAuthToken(token)

    const fetchUser = async () => {
      try {
        const user = await client.getCurrentUser()
        if (user) {
          setUser(user)
          setIsLoading(false)
        } else {
          logout()
        }
      } catch (error) {
        const { statusCode } = error as FetcherError

        if (statusCode === 401 || statusCode === 403) {
          return logout()
        }
      }
    }

    fetchUser()
  }, [isLoggedIn, logout])

  useEffect(() => {
    console.log("isLoggedIn", isLoggedIn)
    if (!isLoggedIn && !unprotectedPaths.includes(pathname) && !pathname.startsWith("/claim/")) {
      replace("/")
    }
  }, [isLoading, replace, pathname])

  return <Context.Provider value={{ isLoggedIn, isLoading, user, login, logout }}>{children}</Context.Provider>
}
