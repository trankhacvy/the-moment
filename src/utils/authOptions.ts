import GitHubProvider from "next-auth/providers/github"

const providers = [
  GitHubProvider({
    clientId: process.env.GITHUB_ID!,
    clientSecret: process.env.GITHUB_SECRET!,
  }),
]

export const authOptions = {
  providers,
}

// import { AuthOptions } from "next-auth"
// import CredentialsProvider from "next-auth/providers/credentials"
// import { DEFAULT_USER_AVATAR } from "@/config/common"
// import { NEXTAUTH_SECRET } from "@/config/env"
// import { SigninMessage } from "@/utils/SigninMessage"
// // import { getCsrfToken } from "next-auth/react"

// const providers = [
//   CredentialsProvider({
//     name: "Solana",
//     credentials: {
//       message: {
//         label: "Message",
//         type: "text",
//       },
//       signature: {
//         label: "Signature",
//         type: "text",
//       },
//     },
//     async authorize(credentials, req) {
//       try {
//         console.log("authorize", credentials)
//         // @ts-ignore
//         const signinMessage = new SigninMessage(JSON.parse(credentials?.message || "{}"))
//         // @ts-ignore
//         // const nextAuthUrl = new URL(process.env.NEXTAUTH_URL)
//         // if (signinMessage.domain !== nextAuthUrl.host) {
//         //   return null
//         // }

//         // if (signinMessage.nonce !== (await getCsrfToken({ req }))) {
//         //   return null
//         // }

//         const validationResult = await signinMessage.validate(credentials?.signature || "")

//         if (!validationResult) throw new Error("Could not validate the signed message")

//         return {
//           id: signinMessage.publicKey,
//         }
//       } catch (e) {
//         console.error(e)
//         return null
//       }
//     },
//   }),
// ]

// export const authOptions: AuthOptions = {
//   providers,
//   session: {
//     strategy: "jwt",
//   },
//   secret: NEXTAUTH_SECRET,
//   callbacks: {
//     async session({ session, token }: { session: any; token: any }) {
//       session.address = token.sub
//       session.user.name = ""
//       session.user.email = ""
//       session.user.image = DEFAULT_USER_AVATAR
//       return session
//     },
//     async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
//       if (process.env.NODE_ENV !== "production") {
//         if (url.includes("https")) {
//           url = url.replaceAll("https", "http")
//         }
//         if (baseUrl.includes("https")) {
//           baseUrl = baseUrl.replaceAll("https", "http")
//         }
//       }
//       console.log({ url, baseUrl })
//       if (url.startsWith("/")) return `${baseUrl}${url}`
//       // Allows callback URLs on the same origin
//       else if (new URL(url).origin === baseUrl) return url
//       return baseUrl
//     },
//   },
//   debug: true,
//   useSecureCookies: false,
//   logger: {
//     error(code, metadata) {
//       console.log({ type: "inside error logger", code, metadata })
//     },
//     warn(code) {
//       console.log({ type: "inside warn logger", code })
//     },
//     debug(code, metadata) {
//       console.log({ type: "inside debug logger", code, metadata })
//     },
//   },
// }
