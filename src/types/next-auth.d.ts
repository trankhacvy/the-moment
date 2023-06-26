import "next-auth/jwt"
import NextAuth from "next-auth"
import { LoginPayloadDto, UserDto, TokenPayloadDto } from "./apis"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: LoginPayloadDto
  }

  interface User {
    user: UserDto
    token: TokenPayloadDto
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: LoginPayloadDto
  }
}
