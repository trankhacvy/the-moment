export type PageMeta = {
  page: number
  take: number
  itemCount: number
  pageCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export type BaseListResponse<T> = {
  data: T[]
  meta: PageMeta
}

export type LoginResponse = {
  user: User
  token: Token
}

export type User = {
  id: string
  createdAt: string
  updatedAt: string
  firstName?: string
  lastName?: string
  email: string
  avatar?: string
  phone?: string
}

export type Token = {
  expiresIn: number
  accessToken: string
}

export type CreateDropRequest = {
  amount: number
  startAt?: string
  endAt?: string
  distributionMethod: string
  nft: {
    name: string
    description?: string
    symbol?: string
    image: string
    externalUrl?: string
    collectionAddress?: string
    attributes?: Array<{
      traitType: string
      value: string
    }>
  }
}

export type CreateNFTRequest = {
  name: string
  description?: string
  symbol?: string
  image: string
  externalUrl?: string
  collectionAddress?: string
  attributes?: Array<{
    traitType: string
    value: string
  }>
}

export type GetCreateDropTXRequest = {
  nftId: string
  amount: number
  publicKey: string
}

export type NFTDrop = {
  id: string
  createdAt: string
  updatedAt: string
  amount: number
  startAt?: string
  endAt?: string
  status: string
  distributionMethod: string
  nft: {
    id: string
    createdAt: string
    updatedAt: string
    name: string
    description: string
    symbol: string
    image: string
    isMutable: boolean
    sellerFeeBasisPoints: number
    attributes: Array<any>
  }
}

export type NFTMetadata = {
  id: string
  createdAt: string
  updatedAt: string
  name: string
  description: string
  symbol: string
  image: string
  isMutable: boolean
  sellerFeeBasisPoints: number
  attributes: Array<any>
}

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
