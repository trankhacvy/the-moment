import { Keypair, PublicKey, Transaction } from "@solana/web3.js"
import * as bs58 from "bs58"
import { NextApiRequest, NextApiResponse } from "next"
import { MASTER_WALLET } from "@/config/env"
import { createCallback, mintCNft } from "@/libs/shyft"
import { Supabase } from "@/libs/supabase"

export type MakeTransactionInputData = {
  account: string
}

type MakeTransactionGetResponse = {
  label: string
  icon: string
}

export type MakeTransactionOutputData = {
  transaction: string
  message: string
}

type ErrorOutput = {
  error: string
}

export type TransactionBody = {
  eventId: string
  creator: string
  amount: number
  distributeType: string
  startAt: string
  endAt: string
  treeAddress?: string
}

interface ExtendedNextApiRequest extends NextApiRequest {
  body: TransactionBody
}

function get(req: NextApiRequest, res: NextApiResponse<MakeTransactionGetResponse>) {
  console.log("res", req.query)
  res.status(200).json({
    label: req.query.name as string,
    icon: req.query.logo as string,
  })
}

async function post(req: NextApiRequest, res: NextApiResponse<MakeTransactionOutputData | ErrorOutput>) {
  try {
    // We pass the reference to use in the query
    console.log("query", req.query)
    console.log("body", req.body)
    const { eventId } = req.query

    if (!eventId) {
      res.status(400).json({ error: "No eventId provided" })
      return
    }

    // We pass the buyer's public key in JSON body
    const { account } = req.body as MakeTransactionInputData
    if (!account) {
      res.status(40).json({ error: "No account provided" })
      return
    }

    const { data: event, error } = await Supabase.from("poap_events")
      .select("*,poap_event_drops(*,poap_nfts(*))")
      .eq("id", eventId)
      .maybeSingle()

    console.log("event", event)

    if (!event || error) {
      res.status(500).json({ error: "error creating transaction" })
      return
    }

    const eventDrop = event?.poap_event_drops?.[0]
    const nft = eventDrop?.poap_nfts?.[0]

    if (!eventDrop || !nft) {
      res.status(500).json({ error: "error creating transaction" })
      return
    }

    console.log("eventDrop", eventDrop)

    const keypair = Keypair.fromSecretKey(bs58.decode(MASTER_WALLET))
    const response = await mintCNft(keypair.publicKey.toBase58(), eventDrop.tree_address!, account, nft.uri ?? "")

    console.log("response", response.result)

    const tx = Transaction.from(Buffer.from(response?.result?.encoded_transaction ?? "", "base64"))

    const ix = tx.instructions
    if (ix.length > 0) {
      ix[0].keys.push({
        pubkey: new PublicKey(account),
        isSigner: true,
        isWritable: false,
      })
    }

    tx.feePayer = keypair.publicKey
    tx.partialSign(keypair)

    // const connection = new Connection(SOLANA_RPC_URL, "processed")
    // const { blockhash } = await (connection.getLatestBlockhash('finalized'))
    // tx.recentBlockhash = blockhash;

    const serializedTransaction = tx.serialize({
      verifySignatures: false,
      requireAllSignatures: false,
    })

    const signature = tx.signatures.find((s) => s.publicKey.toBase58() === keypair.publicKey.toBase58())
    if (!signature?.signature) {
      throw new Error("cannot sign")
    }

    // update db
    await Supabase.from("poap_claims").upsert({
      claim_method: "qr",
      event_drop_id: eventDrop.id,
      nft_address: response?.result?.mint,
      owner: account,
      staus: "new",
    })

    await createCallback(eventDrop.tree_address!)

    // Return the serialized transaction
    res.status(200).json({
      transaction: serializedTransaction.toString("base64"),
      message: "Thank you for participating in our event",
    })
  } catch (err) {
    console.error(err)

    res.status(500).json({ error: "error creating transaction" })
    return
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MakeTransactionGetResponse | MakeTransactionOutputData | ErrorOutput>
) {
  if (req.method === "GET") {
    return get(req, res)
  } else if (req.method === "POST") {
    return await post(req, res)
  } else {
    return res.status(405).json({ error: "Method not allowed" })
  }
}
