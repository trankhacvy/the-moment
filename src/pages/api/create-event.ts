// import { Keypair, Transaction } from "@solana/web3.js"
// import * as bs58 from "bs58"
// import { NextApiRequest, NextApiResponse } from "next"
// import { MASTER_WALLET } from "@/config/env"
// import { createTree } from "@/libs/shyft"
// import { Supabase } from "@/libs/supabase"
// import { getTreeOptions } from "@/utils/getTreeOptions"

// export type CreateEventBody = {
//   eventId: string
//   creator: string
//   amount: number
//   transferable: boolean
//   poapPerWallet: boolean
//   startAt: string
//   endAt: string
//   uri: string
//   treeAddress?: string
// }

// interface ExtendedNextApiRequest extends NextApiRequest {
//   body: CreateEventBody
// }

// export default async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") {
//     res.setHeader("Allow", ["POST"])
//     return res.send("Method not allowed.")
//   }

//   const { eventId, creator, amount, transferable, poapPerWallet, startAt, endAt, treeAddress, uri } = req.body

//   try {
//     const keypair = Keypair.fromSecretKey(bs58.decode(MASTER_WALLET))
//     console.log("master wallet", keypair.publicKey.toBase58())
//     if (!treeAddress) {
//       const { data: event, error } = await Supabase.from("poap_events").select("*").eq("id", eventId).maybeSingle()
//       if (error || !event) {
//         return res.status(404).json({ success: false, error: "Event not found" })
//       }

//       const nftUri = "" //await uploadMetadata(event, creator, keypair)

//       const { maxDepth, maxBufferSize, canopyDepth } = getTreeOptions(amount)
//       console.log("start create tree")
//       const response = await createTree(keypair.publicKey.toBase58(), creator, maxDepth, maxBufferSize, canopyDepth)
//       console.log("create transaction success")
//       if (response.success && response.result) {
//         console.log("create tree success: ", response.result.tree)
//         const tx = Transaction.from(Buffer.from(response.result.encoded_transaction, "base64"))
//         tx.partialSign(keypair)
//         const serializedTransaction = tx.serialize({
//           requireAllSignatures: false,
//         })

//         return res.json({
//           success: true,
//           data: {
//             encoded_transaction: serializedTransaction.toString("base64"),
//             tree: response.result?.tree,
//             signers: response.result?.signers,
//             uri: nftUri,
//           },
//         })
//       }

//       return res.status(500).json({ success: false, error: "Unknown error" })
//     } else {
//       const { error } = await Supabase.from("poap_event_distributions").insert({
//         event_id: eventId,
//         amount: amount,
//         creator: keypair.publicKey.toBase58(),
//         transferable,
//         poap_per_wallet: Number(poapPerWallet),
//         start_at: startAt,
//         end_at: endAt,
//         tree_address: treeAddress,
//         nft_uri: uri,
//       })
//       if (error) {
//         return res.status(500).json({ success: false, error: error?.message })
//       }
//       return res.json({ success: true })
//     }
//   } catch (error: any) {
//     console.error(error)
//     return res.status(500).json({ success: false, error: error?.message })
//   }
// }
