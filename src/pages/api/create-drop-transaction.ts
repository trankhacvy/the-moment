// import { Keypair, Transaction } from "@solana/web3.js"
// import * as bs58 from "bs58"
// import { NextApiRequest, NextApiResponse } from "next"
// import { MASTER_WALLET } from "@/config/env"
// import { createTree } from "@/libs/shyft"
// import { getTreeOptions } from "@/utils/getTreeOptions"

// export type CreateDropTransactionBody = {
//   creator: string
//   amount: number
// }

// interface ExtendedNextApiRequest extends NextApiRequest {
//   body: CreateDropTransactionBody
// }

// export default async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") {
//     res.setHeader("Allow", ["POST"])
//     return res.send("Method not allowed.")
//   }

//   const { creator, amount } = req.body

//   if (!creator || !amount) {
//     return res.status(400).json({ success: false, error: "Invalid parameters" })
//   }

//   try {
//     const keypair = Keypair.fromSecretKey(bs58.decode(MASTER_WALLET))
//     console.log("master wallet", keypair.publicKey.toBase58())
//     const { maxDepth, maxBufferSize, canopyDepth } = getTreeOptions(amount)
//     console.log("start create tree")
//     const response = await createTree(keypair.publicKey.toBase58(), creator, maxDepth, maxBufferSize, canopyDepth)
//     console.log("create transaction success")
//     if (response.success && response.result) {
//       console.log("create tree success: ", response.result.tree)
//       const tx = Transaction.from(Buffer.from(response.result.encoded_transaction, "base64"))
//       tx.partialSign(keypair)
//       const serializedTransaction = tx.serialize({
//         requireAllSignatures: false,
//       })

//       return res.json({
//         success: true,
//         data: {
//           encoded_transaction: serializedTransaction.toString("base64"),
//           tree: response.result?.tree,
//           signers: response.result?.signers,
//         },
//       })
//     }

//     return res.status(500).json({ success: false, error: "Unknown error" })
//   } catch (error: any) {
//     console.error(error)
//     return res.status(500).json({ success: false, error: error?.message })
//   }
// }
