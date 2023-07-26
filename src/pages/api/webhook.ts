// import { NextApiRequest, NextApiResponse } from "next"
// import { Supabase } from "@/libs/supabase"

// interface ExtendedNextApiRequest extends NextApiRequest {
//   body: any
// }

// export default async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") {
//     res.setHeader("Allow", ["POST"])
//     return res.send("Method not allowed.")
//   }
//   console.log("webhook", req.body.signatures)
//   const { type, status, actions, signatures } = req.body

//   try {
//     if (
//       type === "COMPRESSED_NFT_MINT" &&
//       status === "Success" &&
//       Array.isArray(actions) &&
//       actions.length > 0 &&
//       signatures
//     ) {
//       const action = actions[0] as any
//       if (action.info && action.type === "COMPRESSED_NFT_MINT" && action.info.nft_address && action.info.merkle_tree) {
//         const { data, error } = await Supabase.from("poap_claims")
//           .select("*")
//           .eq("nft_address", action.info.nft_address)
//           .maybeSingle()

//         if (data && !error) {
//           await Supabase.from("poap_claims")
//             .update({
//               staus: "success",
//             })
//             .eq("id", data.id)
//         }
//       }
//     }

//     return res.status(200).json({ success: true })
//   } catch (error: any) {
//     console.error(error)
//     return res.status(500).json({ success: false, error: error?.message })
//   }
// }
