import axios from "axios"
import { APP_BASE_URL, SHYFT_API_KEY, SHYFT_BASE_URL } from "@/config/env"
import { BaseResponse, CreateTreeResponseData, MintNFTResponseData } from "@/types/schema"

export const getNFT = async (address: string) => {
  const response = await axios<any>({
    url: `${SHYFT_BASE_URL}/v1/nft/read?network=devnet&token_address=${address}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": SHYFT_API_KEY,
      Accept: "*/*",
      "Access-Control-Allow-Origin": "*",
    },
  })

  return response.data
}

export const createTree = async (
  creatorAddress: string,
  feePayer: string,
  maxDepth: number,
  maxBufferSize: number,
  canopyDepth: number
) => {
  const response = await axios<BaseResponse<CreateTreeResponseData>>({
    url: `${SHYFT_BASE_URL}/v1/nft/compressed/create_tree`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": SHYFT_API_KEY,
    },
    data: {
      network: "devnet",
      wallet_address: creatorAddress,
      max_depth_size_pair: {
        max_depth: maxDepth,
        max_buffer_size: maxBufferSize,
      },
      canopy_depth: canopyDepth,
      fee_payer: feePayer,
    },
  })
  return response.data
}

export const mintCNft = async (creatorAddress: string, treeAddress: string, receiverAddress: string, uri: string) => {
  const response = await axios<BaseResponse<MintNFTResponseData>>({
    url: `${SHYFT_BASE_URL}/v1/nft/compressed/mint`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": SHYFT_API_KEY,
    },
    data: {
      network: "devnet",
      creator_wallet: creatorAddress,
      metadata_uri: uri,
      merkle_tree: treeAddress,
      is_delegate_authority: true,
      is_mutable: true,
      receiver: receiverAddress,
      fee_payer: creatorAddress,
    },
  })
  return response.data
}

export const createCallback = async (treeAddress: string) => {
  const response = await axios<BaseResponse<any>>({
    url: `${SHYFT_BASE_URL}/v1/callback/create`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": SHYFT_API_KEY,
    },
    data: {
      network: "devnet",
      addresses: [treeAddress],
      callback_url: `${APP_BASE_URL}/api/webhook`,
      events: ["COMPRESSED_NFT_MINT"],
    },
  })
  return response.data
}
