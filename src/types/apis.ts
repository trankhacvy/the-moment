/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface UserLoginDto {
  email: string
  password: string
}

export interface UserDto {
  id: string
  /** @format date-time */
  createdAt: string
  /** @format date-time */
  updatedAt: string
  firstName?: string
  lastName?: string
  role?: "USER" | "ADMIN"
  email: string
  avatar?: string
  phone?: string
  isActive?: boolean
}

export interface TokenPayloadDto {
  expiresIn: number
  accessToken: string
}

export interface LoginPayloadDto {
  user: UserDto
  token: TokenPayloadDto
}

export interface UserRegisterDto {
  firstName?: string
  lastName?: string
  email: string
  /** @minLength 6 */
  password: string
  phone?: string
  user_wallet?: string
}

export interface PageMetaDto {
  page: number
  take: number
  itemCount: number
  pageCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface PageDto {
  data: any[][]
  meta: PageMetaDto
}

export type Order = "ASC" | "DESC"

export interface CreateNftDto {
  /** @maxLength 32 */
  name: string
  /**
   * @minLength -1
   * @maxLength 1000
   */
  description?: string
  /** @maxLength 10 */
  symbol: string
  image: string
  isMutable?: boolean
  /**
   * @minLength -1
   * @maxLength 256
   */
  externalUrl?: string
  isCollection?: boolean
  /** @minLength -1 */
  collectionAddress?: string
  sellerFeeBasisPoints?: number
  attributes?: {
    traitType?: string
    value?: string
  }[]
}

export interface NftDto {
  id: string
  /** @format date-time */
  createdAt: string
  /** @format date-time */
  updatedAt: string
  name: string
  /** @minLength -1 */
  description?: string
  /** @minLength -1 */
  symbol?: string
  image: string
  isMutable?: boolean
  /** @minLength -1 */
  externalUrl?: string
  isCollection?: boolean
  /** @minLength -1 */
  collectionAddress?: string
  sellerFeeBasisPoints?: number
  attributes?: object
  drops?: any[][]
}

export interface UpdateNftDto {
  /** @minLength -1 */
  name?: string
  /** @minLength -1 */
  description?: string
  /** @minLength -1 */
  symbol?: string
  /** @minLength -1 */
  image?: string
  isMutable?: boolean
  /** @minLength -1 */
  externalUrl?: string
  isCollection?: boolean
  /** @minLength -1 */
  collectionAddress?: string
  sellerFeeBasisPoints?: number
  attributes?: {
    traitType?: string
    value?: string
  }[]
}

export interface CreateNFTDropDto {
  /** @format uuid */
  nftId: string
  /** @format uuid */
  transactionId: string
  amount: number
  /** @example ["WEBSITE","MINT_LINK","SECRET","WHITELIST"] */
  method: "WEBSITE" | "MINT_LINK" | "SECRET" | "WHITELIST"
  suffix: string
  /**
   * @format date-time
   * @minLength -1
   */
  startAt?: string
  /**
   * @format date-time
   * @minLength -1
   */
  endAt?: string
  signature: string
}

export interface GetCreationDropTransaction {
  /** @format uuid */
  nftId: string
  amount: number
  owner: string
}

export interface DropDto {
  id: string
  /** @format date-time */
  createdAt: string
  /** @format date-time */
  updatedAt: string
  amount: number
  /** @example ["WEBSITE","MINT_LINK","SECRET","WHITELIST"] */
  method: "WEBSITE" | "MINT_LINK" | "SECRET" | "WHITELIST"
  suffix: string
  /**
   * @format date-time
   * @minLength -1
   */
  startAt?: string
  /**
   * @format date-time
   * @minLength -1
   */
  endAt?: string
  nft?: NftDto
}

export interface CreateDropTXDto {
  payer: string
  /** @format uuid */
  nftId: string
  amount: number
  network: string
}

export interface TransactionResponseDto {
  transaction: string
}

export interface SolanaPayPostDto {
  account: string
}

export interface CreateTreeDto {
  creator: string
  feePayer: string
  capacity: number
  network: string
}

export interface TreeDto {
  id: string
  /** @format date-time */
  createdAt: string
  /** @format date-time */
  updatedAt: string
}

export interface CreateClaimDto {
  /** @format uuid */
  dropId: string
  claimant: string
  reference: string
  network: string
}

export interface ClaimDto {
  id: string
  /** @format date-time */
  createdAt: string
  /** @format date-time */
  updatedAt: string
  nftAddress: string
  owner: string
  claimAt: string
  /** @minLength -1 */
  signature?: string
}

export interface SolanaPayClaimGetDto {
  label: string
  icon: string
}

export interface SolanaPayClaimPostDto {
  account: string
}

export type AuthControllerUserLoginData = LoginPayloadDto

export type AuthControllerUserRegisterPayload = UserRegisterDto & {
  /** @format binary */
  avatar?: File
}

export type AuthControllerUserRegisterData = UserDto

export type AuthControllerGetCurrentUserData = UserDto

export interface UserControllerGetUsersParams {
  order?: Order
  /**
   * @min 1
   * @default 1
   */
  page?: number
  /**
   * @min 1
   * @max 50
   * @default 10
   */
  take?: number
  /** @minLength -1 */
  q?: string
}

export type UserControllerGetUsersData = PageDto & {
  results?: PageDto[]
}

export type UserControllerGetUserData = UserDto

export interface UserControllerGetNfTsParams {
  order?: Order
  /**
   * @min 1
   * @default 1
   */
  page?: number
  /**
   * @min 1
   * @max 50
   * @default 10
   */
  take?: number
  /** @minLength -1 */
  q?: string
  id: string
}

export type UserControllerGetNfTsData = UserDto

export type NftControllerCreateNftData = NftDto

export interface NftControllerGetAllNfTsParams {
  order?: Order
  /**
   * @min 1
   * @default 1
   */
  page?: number
  /**
   * @min 1
   * @max 50
   * @default 10
   */
  take?: number
  /** @minLength -1 */
  q?: string
}

export type NftControllerGetAllNfTsData = PageDto & {
  results?: NftDto[]
}

export type NftControllerGetNftData = NftDto

export type NftControllerUpdateNftData = any

export type NftControllerDeleteNftData = any

export interface HealthCheckerControllerCheckData {
  /** @example "ok" */
  status?: string
  /** @example {"database":{"status":"up"}} */
  info?: Record<
    string,
    {
      status?: string
      [key: string]: any
    }
  >
  /** @example {} */
  error?: Record<
    string,
    {
      status?: string
      [key: string]: any
    }
  >
  /** @example {"database":{"status":"up"}} */
  details?: Record<
    string,
    {
      status?: string
      [key: string]: any
    }
  >
}

export type NftDropsControllerGetDropData = DropDto

export type NftDropsControllerGetDropBySuffixData = DropDto

export type NftDropsControllerCheckDropSubfixData = DropDto

export type TransactionControllerGetCreateDropTxData = TransactionResponseDto

export interface TransactionControllerVerifyTransferParams {
  /** @format uuid */
  transactionId: string
  signature: string
  amount: number
}

export type TransactionControllerVerifyTransferData = any

export interface TransactionControllerGetSolanaPayDropInfoParams {
  nftName: string
  nftImage: string
}

export type TransactionControllerGetSolanaPayDropInfoData = any

export interface TransactionControllerGetSolanaPayTransactionParams {
  /** @format uuid */
  dropId: string
}

export type TransactionControllerGetSolanaPayTransactionData = any

export type TreesControllerCreateTreeData = TransactionResponseDto

export type TreesControllerFindTreeData = TreeDto

export type ClaimsControllerClaimNftData = ClaimDto

export interface ClaimsControllerSolanaClaimGetParams {
  label: string
  icon: string
}

export type ClaimsControllerSolanaClaimGetData = SolanaPayClaimGetDto

export interface ClaimsControllerSolanaClaimPostParams {
  /** @format uuid */
  dropId: string
  network: string
  reference: string
}

export type ClaimsControllerSolanaClaimPostData = TransactionResponseDto
