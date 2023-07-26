// import { Connection, Keypair, Transaction, sendAndConfirmTransaction } from "@solana/web3.js"
// import * as bs58 from "bs58"
// import { NextApiRequest, NextApiResponse } from "next"
// import { MASTER_WALLET, SOLANA_RPC_URL } from "@/config/env"
// import { mintCNft } from "@/libs/shyft"
// import { Supabase } from "@/libs/supabase"

// export type ClaimNftBody = {
//   eventId: string
//   walletAddress: string
// }

// interface ExtendedNextApiRequest extends NextApiRequest {
//   body: ClaimNftBody
// }

// export default async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") {
//     res.setHeader("Allow", ["POST"])
//     return res.send("Method not allowed.")
//   }

//   const { eventId, walletAddress } = req.body

//   if (!eventId || !walletAddress) {
//     res.status(400).json({ error: "No reference provided" })
//     return
//   }

//   try {
//     const { data: event, error: getEventError } = await Supabase.from("poap_events")
//       .select("*,poap_event_drops(*)")
//       .eq("id", eventId)
//       .maybeSingle()
//     // @ts-ignore
//     if (!event || !event.poap_event_drops || getEventError) {
//       res.status(500).json({ error: "Server error" })
//       return
//     }
//     // @ts-ignore
//     const eventDrop = event.poap_event_drops?.[0]

//     const { data: nft, error: getNftError } = await Supabase.from("poap_nfts")
//       .select("*")
//       .eq("event_drop_id", eventDrop.id)
//       .maybeSingle()

//     if (!nft || getNftError) {
//       res.status(500).json({ error: "Server error" })
//       return
//     }

//     const keypair = Keypair.fromSecretKey(bs58.decode(MASTER_WALLET))
//     const response = await mintCNft(keypair.publicKey.toBase58(), eventDrop.tree_address!, walletAddress, nft.uri ?? "")
//     const transaction = Transaction.from(Buffer.from(response?.result?.encoded_transaction ?? "", "base64"))
//     const connection = new Connection(SOLANA_RPC_URL, "processed")
//     const signature = await sendAndConfirmTransaction(connection, transaction, [keypair])

//     const { data: claimResult, error: claimError } = await Supabase.from("poap_claims")
//       .insert({
//         claim_method: "connect_wallet",
//         event_drop_id: eventDrop.id,
//         nft_address: response?.result?.mint ?? "",
//         owner: walletAddress,
//       })
//       .select("*")
//       .maybeSingle()

//     if (!claimResult || claimError) {
//       res.status(500).json({ error: "Server error" })
//       return
//     }

//     return res.status(200).json({
//       success: true,
//       data: {
//         signature,
//         image: nft.image,
//       },
//     })
//   } catch (error: any) {
//     console.error(error)
//     return res.status(500).json({ success: false, error: error?.message })
//   }
// }
