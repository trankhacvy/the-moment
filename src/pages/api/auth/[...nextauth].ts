import NextAuth from "next-auth"
import { authOptions } from "@/utils/authOptions"

export default async function auth(req: any, res: any) {
  // const isDefaultSigninPage = req.method === "GET" && req.query.nextauth.includes("signin")

  // if (isDefaultSigninPage) {
  //   authOptions.providers.pop()
  // }

  return await NextAuth(req, res, authOptions)
}
