import type { User } from "@/types/schema"
import { withIronSessionApiRoute } from "iron-session/next"
import { sessionOptions } from "@/libs/session"
import { NextApiRequest, NextApiResponse } from "next"
import { client } from "@/libs/api"

export default withIronSessionApiRoute(loginRoute, sessionOptions)

export type LoginBody = {
  email: string
  password: string
}

interface ExtendedNextApiRequest extends NextApiRequest {
  body: LoginBody
}

async function loginRoute(req: ExtendedNextApiRequest, res: NextApiResponse) {
  const { email, password } = await req.body

  try {
    const response = await client.login(email, password)
    client.setAuthToken(response.token.accessToken)
    const user = response.user
    req.session.user = user

    await req.session.save()
    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: (error as Error).message })
  }
}
