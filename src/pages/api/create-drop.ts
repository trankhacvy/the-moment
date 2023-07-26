// import { keypairIdentity, Metaplex, toMetaplexFile, bundlrStorage, BundlrStorageDriver } from "@metaplex-foundation/js"
// import { Connection, Keypair } from "@solana/web3.js"
// import * as bs58 from "bs58"
// import { BUNDLR_NETWORK_URL, MASTER_WALLET, SOLANA_RPC_URL } from "@/config/env"
// import { NextApiRequest, NextApiResponse } from "next"
// import { Supabase } from "@/libs/supabase"

// export type CreateDropBody = {
//   owner: string
//   eventDrop: {
//     eventId: string
//     amount: number
//     startDate?: string
//     endDate?: string
//     treeAddress: string
//   }
//   nft: {
//     name: string
//     symbol: string
//     description: string
//     image: string
//     transferable: boolean
//     nftPerWallet: number
//     attrs?: Array<{ name: string; value: string }>
//   }
// }

// interface ExtendedNextApiRequest extends NextApiRequest {
//   body: CreateDropBody
// }

// export default async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") {
//     res.setHeader("Allow", ["POST"])
//     return res.send("Method not allowed.")
//   }

//   const { eventDrop, nft, owner } = req.body

//   if (!eventDrop || !nft || !owner) {
//     return res.status(400).json({ success: false, error: "Invalid parameters" })
//   }

//   const { eventId, amount, startDate, endDate, treeAddress } = eventDrop
//   const { name, symbol, description, image, transferable, nftPerWallet, attrs = [] } = nft

//   try {
//     const { data: event, error: getEventError } = await Supabase.from("poap_events")
//       .select("*")
//       .eq("id", eventId)
//       .maybeSingle()
//     if (getEventError || !event) {
//       return res.status(404).json({ success: false, error: "Event not found" })
//     }

//     const { data: eventDrop, error: insertEventDropError } = await Supabase.from("poap_event_drops")
//       .insert({
//         event_id: eventId,
//         amount: amount,
//         start_date: startDate,
//         end_date: endDate,
//         tree_address: treeAddress,
//       })
//       .select("*")
//       .maybeSingle()

//     if (insertEventDropError || !eventDrop) {
//       console.log("insertEventDropError", insertEventDropError)
//       return res.status(500).json({ success: false, error: "Server error" })
//     }

//     const keypair = Keypair.fromSecretKey(bs58.decode(MASTER_WALLET))
//     const nftUri = await uploadMetadata(
//       name,
//       symbol,
//       description,
//       image,
//       attrs ?? [],
//       event.website ?? "",
//       owner,
//       keypair
//     )

//     const { error: insertNftError } = await Supabase.from("poap_nfts").insert({
//       event_drop_id: eventDrop.id,
//       is_mutable: true,
//       transferable,
//       nft_per_wallet: nftPerWallet,
//       uri: nftUri,
//       image: image,
//     })

//     if (insertNftError) {
//       console.log("insertNftError", insertNftError)
//       return res.status(500).json({ success: false, error: "Server error" })
//     }

//     return res.status(200).json({ success: true })
//   } catch (error: any) {
//     console.error(error)
//     return res.status(500).json({ success: false, error: error?.message })
//   }
// }

// const uploadMetadata = async (
//   name: string,
//   symbol: string,
//   description: string,
//   image: string,
//   attrs: { name: string; value: string }[],
//   externalUrl: string,
//   owner: string,
//   payer: Keypair
// ) => {
//   console.log("Start upload metadata")
//   const connection = new Connection(SOLANA_RPC_URL, "processed")

//   const metaplex = Metaplex.make(connection)
//     .use(keypairIdentity(payer))
//     .use(
//       bundlrStorage({
//         address: BUNDLR_NETWORK_URL,
//         providerUrl: SOLANA_RPC_URL,
//         timeout: 60000,
//       })
//     )

//   const driver = metaplex.storage().driver() as BundlrStorageDriver

//   const response = await fetch(image)
//   const blob = await response.blob()
//   const arrayBuffer = await blob.arrayBuffer()
//   const buffer = Buffer.from(arrayBuffer)

//   const metaplexFile = toMetaplexFile(buffer as any, `image.png`)
//   const imageUri = await driver.upload(metaplexFile)
//   console.log("imageUri", imageUri)

//   const { uri } = await metaplex.nfts().uploadMetadata({
//     name,
//     image: imageUri,
//     description: description,
//     external_url: externalUrl,
//     seller_fee_basis_points: 500,
//     symbol: symbol,
//     attributes:
//       attrs.length > 0
//         ? attrs.map((attr) => ({
//             trait_type: attr.name,
//             value: attr.value,
//           }))
//         : [
//             {
//               trait_type: "kind",
//               value: "poa",
//             },
//           ],
//     properties: {
//       creators: [
//         {
//           address: owner,
//           share: 100,
//         },
//       ],
//       files: [
//         {
//           type: "image/png",
//           uri: imageUri,
//         },
//       ],
//       category: "image",
//     },
//   })

//   console.log("upload metadata success: ", uri)
//   return uri
// }
