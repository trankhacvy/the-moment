import bs58 from "bs58"
import GitHubProvider, { GithubProfile } from "next-auth/providers/github"
import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { NEXTAUTH_SECRET } from "@/config/env"
import { SigninMessage } from "@/utils/SigninMessage"
import { client } from "@/libs/api"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { useCallback, useEffect, useState } from "react"
import { getCsrfToken, signIn } from "next-auth/react"

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
    session: async ({ session, token }) => {
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
        try {
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
        } catch (error) {
          console.error(error)
          return false
        }
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
  debug: process.env.NODE_ENV === "development",
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

export function useWalletLogin(callbackUrl?: string) {
  const { connected, publicKey, signMessage } = useWallet()
  const { setVisible } = useWalletModal()
  const [openModal, setOpenModal] = useState(false)

  const login = useCallback(async () => {
    try {
      if (!connected) {
        setOpenModal(true)
        setVisible(true)
      }
      const csrf = await getCsrfToken()
      if (!publicKey || !csrf || !signMessage) return

      const message = new SigninMessage({
        domain: window.location.host,
        publicKey: publicKey?.toBase58(),
        statement: `Sign this message to sign in to the app.`,
        nonce: csrf,
      })

      const data = new TextEncoder().encode(message.prepare())
      const signature = await signMessage(data)
      const serializedSignature = bs58.encode(signature)

      await signIn("credentials", {
        message: JSON.stringify(message),
        signature: serializedSignature,
        callbackUrl,
      })
    } catch (error) {
      console.error(error)
    }
  }, [connected, publicKey])

  useEffect(() => {
    if (connected && openModal) {
      login()
    }
  }, [openModal, connected])

  return login
}
