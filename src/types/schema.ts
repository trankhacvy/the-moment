export type BaseResponse<T> = {
  success: boolean
  message: string
  result?: T
}

export type CreateTreeResponseData = {
  encoded_transaction: string
  tree: string
  signers: string[]
}

export type MintNFTResponseData = {
  encoded_transaction: string
  mint: string
  signers: string[]
}
