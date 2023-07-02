import { useCurrentUser } from "@/hooks/useCurrentUser"
import { UserDto } from "@/types/apis"
import React, { createContext, ReactElement } from "react"
import { KeyedMutator } from "swr"

interface UserContextValues {
  user?: UserDto
  isUserLoading: boolean
  mutateUser: KeyedMutator<UserDto>
}

export const UserContext = createContext<UserContextValues>({} as UserContextValues)

export const UserProvider = ({ children }: { children: ReactElement }) => {
  const { data, isLoading, error, mutate } = useCurrentUser()

  return (
    <UserContext.Provider
      value={{
        user: error ? undefined : data,
        isUserLoading: isLoading,
        mutateUser: mutate,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
