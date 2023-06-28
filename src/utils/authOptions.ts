import GitHubProvider, { GithubProfile } from "next-auth/providers/github"
import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { NEXTAUTH_SECRET } from "@/config/env"
import { SigninMessage } from "@/utils/SigninMessage"
import { client } from "@/libs/api"

const providers = [
  CredentialsProvider({
    name: "Solana",
    credentials: {
      message: {
        label: "Message",
        type: "text",
      },
      signature: {
        label: "Signature",
        type: "text",
      },
    },
    authorize: async (credentials) => {
      try {
        console.log("check use valid credentials", credentials)
        // @ts-ignore
        const signinMessage = new SigninMessage(JSON.parse(credentials?.message || "{}"))
        // @ts-ignore
        // const nextAuthUrl = new URL(process.env.NEXTAUTH_URL)
        // if (signinMessage.domain !== nextAuthUrl.host) {
        //   return null
        // }

        // if (signinMessage.nonce !== (await getCsrfToken({ req }))) {
        //   return null
        // }
        console.log("check use valid")
        const validationResult = await signinMessage.validate(credentials?.signature || "")

        if (!validationResult) throw new Error("Could not validate the signed message")

        const response = await client.walletLogin(signinMessage.publicKey)

        if (!response) new Error("User not found")
        console.log("user", response)
        return response as any
      } catch (e) {
        console.error(e)
        return null
      }
    },
  }),
  GitHubProvider({
    id: "github",
    clientId: process.env.GITHUB_ID!,
    clientSecret: process.env.GITHUB_SECRET!,
  }),
]

export const authOptions: AuthOptions = {
  providers,
  session: {
    strategy: "jwt",
  },
  secret: NEXTAUTH_SECRET,
  callbacks: {
    session: async ({ session, token, user }) => {
      session.user = token.user
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore
        if (user.me) {
          // @ts-ignore
          token.user = user.me
        } else {
          token.user = user
        }
      }
      return token
    },
    async signIn({ user, profile, account }) {
      if (account?.provider === "github") {
        const githubUser = profile as GithubProfile
        // @ts-ignore
        user.me = await client.socialLogin({
          firstName: githubUser?.name ?? "",
          lastName: githubUser?.name ?? "",
          email: githubUser.email ?? "",
          avatar: githubUser.avatar_url,
          password: Date.now().toString(),
          socialId: account.providerAccountId,
          provider: account.provider,
        })
      }
      return true
    },
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      if (process.env.NODE_ENV !== "production") {
        if (url.includes("https")) {
          url = url.replaceAll("https", "http")
        }
        if (baseUrl.includes("https")) {
          baseUrl = baseUrl.replaceAll("https", "http")
        }
      }
      console.log({ url, baseUrl })
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  debug: process.env.NODE_ENV === 'development',
  useSecureCookies: false,
  // logger: {
  //   error(code, metadata) {
  //     console.log({ type: "inside error logger", code, metadata })
  //   },
  //   warn(code) {
  //     console.log({ type: "inside warn logger", code })
  //   },
  //   debug(code, metadata) {
  //     console.log({ type: "inside debug logger", code, metadata })
  //   },
  // },
}
