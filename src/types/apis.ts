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
  wallet: string
}

export interface TokenPayloadDto {
  expiresIn: number
  accessToken: string
}

export interface LoginPayloadDto {
  user: UserDto
  token: TokenPayloadDto
}

export interface MagicLinkLogin {
  destination: string
  /** @minLength -1 */
  callbackUrl?: string
  /** @minLength -1 */
  redirectUrl?: string
}

export interface WalletLoginDto {
  wallet: string
}

export type SocialProviderTypes = "github"

export interface SocialUserRegisterDto {
  firstName?: string
  lastName?: string
  email: string
  /** @minLength 6 */
  password: string
  phone?: string
  socialId: string
  /** @minLength -1 */
  avatar?: string
  provider: SocialProviderTypes
}

export interface UserRegisterDto {
  firstName?: string
  lastName?: string
  email: string
  /** @minLength 6 */
  password: string
  phone?: string
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
  data: Array<Array<any>>
  meta: PageMetaDto
}

export type Order = "ASC" | "DESC"

export interface UpdateUserDto {
  /** @minLength -1 */
  firstName?: string
  /** @minLength -1 */
  lastName?: string
  /** @minLength -1 */
  phone?: string
  /** @minLength -1 */
  avatar?: string
  /** @minLength -1 */
  wallet?: string
  /** @minLength -1 */
  socialId?: string
  /** @minLength -1 */
  email?: string
  provider?: SocialProviderTypes
}

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
  isMutable?: boolean
  /**
   * @minLength -1
   * @maxLength 256
   */
  externalUrl?: string
  sellerFeeBasisPoints?: number
  attributes?: Array<{
    traitType?: string
    value?: string
  }>
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
  sellerFeeBasisPoints?: number
  attributes?: Array<{
    traitType?: string
    value?: string
  }>
  drops?: Array<Array<any>>
}

export interface UpdateNftDto {
  /** @minLength -1 */
  name?: string
  /** @minLength -1 */
  description?: string
  /** @minLength -1 */
  symbol?: string
  isMutable?: boolean
  /** @minLength -1 */
  externalUrl?: string
  sellerFeeBasisPoints?: number
  attributes?: Array<{
    traitType?: string
    value?: string
  }>
}

export type DropDuration = "FIFTEEN_MIN" | "THIRTY_MIN" | "ONE_HOUR" | "CUSTOM"

export interface CreateWebsiteDropDto {
  /** @format uuid */
  nftId: string
  amount: number
  /** @minLength -1 */
  callback?: string
  /**
   * @minLength 3
   * @maxLength 128
   */
  slug?: string
  /**
   * @format date-time
   * @minLength -1
   */
  startAt?: string
  duration?: DropDuration
  /**
   * @format date-time
   * @minLength -1
   */
  endAt?: string
}

export interface CheckoutDropDto {
  /** @format uuid */
  dropId: string
  paymentUrl: string
}

export interface UpdateWebsiteDropDto {
  /**
   * @minLength 3
   * @maxLength 128
   */
  slug?: string
  /**
   * @format date-time
   * @minLength -1
   */
  startAt?: string
  duration?: DropDuration
  /**
   * @format date-time
   * @minLength -1
   */
  endAt?: string
}

export interface WebsiteDropDto {
  id: string
  /** @format date-time */
  createdAt: string
  /** @format date-time */
  updatedAt: string
  slug: string
  /**
   * @format date-time
   * @minLength -1
   */
  startAt?: string
  duration?: DropDuration
  /**
   * @format date-time
   * @minLength -1
   */
  endAt?: string
}

export interface CreateSecretDropDto {
  /** @format uuid */
  nftId: string
  amount: number
  /** @minLength -1 */
  callback?: string
  /**
   * @minLength 3
   * @maxLength 128
   */
  slug?: string
  /**
   * @format date-time
   * @minLength -1
   */
  startAt?: string
  duration?: DropDuration
  /**
   * @format date-time
   * @minLength -1
   */
  endAt?: string
  /**
   * @minLength 3
   * @maxLength 32
   */
  password: string
}

export interface CreateMintLinkDropDto {
  /** @format uuid */
  nftId: string
  amount: number
  /** @minLength -1 */
  callback?: string
}

export interface DropCheckoutDto {
  id: string
  /** @example ["INIT","PAID","FAILED"] */
  status: "INIT" | "PAID" | "FAILED"
  amount: number
}

export interface MintLinkDto {
  id: string
  /** @format date-time */
  createdAt: string
  /** @format date-time */
  updatedAt: string
  link: string
  /** @format date-time */
  expiredAt: string
}

export interface MintLinkDropDto {
  id: string
  /** @format date-time */
  createdAt: string
  /** @format date-time */
  updatedAt: string
  mintLinks?: Array<MintLinkDto>
}

export interface DropDto {
  id: string
  /** @format date-time */
  createdAt: string
  /** @format date-time */
  updatedAt: string
  approvedAmount: number
  requestedAmount: number
  /** @example ["WEBSITE","MINT_LINK","SECRET","WHITELIST"] */
  method: "WEBSITE" | "MINT_LINK" | "SECRET" | "WHITELIST"
  /** @example ["WAITING_FOR_PAYMENT","PAYMENT_FAILED","PROCESSING","ACTIVE","ENDED"] */
  status: "WAITING_FOR_PAYMENT" | "PAYMENT_FAILED" | "PROCESSING" | "ACTIVE" | "ENDED"
  nft?: NftDto
  minted: number
  request: DropCheckoutDto
  websiteDrop: WebsiteDropDto
  mintLinkDrop: MintLinkDropDto
}

export interface RequestDropAmountDto {
  amount: number
  /** @minLength -1 */
  callback?: string
}

export interface RepayDto {
  sessionId: string
}

export type WebhookStatus = "transaction.successful" | "transaction.failed"

export type Network = "devnet" | "testnet" | "mainnet-beta"

export interface WebhookDto {
  customer: string
  customer_email: string
  event: WebhookStatus
  items: Array<string>
  metadata: object
  network: Network
  order_id: string
  payment_amount: number
  payment_currency: string
  session_id: string
  signature: string
  timestamp: string
}

export interface CreateTreeDto {
  creator: string
  feePayer: string
  capacity: number
  network: string
}

export interface TransactionResponseDto {
  transaction: string
}

export interface TreeDto {
  id: string
  /** @format date-time */
  createdAt: string
  /** @format date-time */
  updatedAt: string
}

export interface CreateClaimByWalletDto {
  /** @format uuid */
  dropId: string
  network: string
  claimant: string
}

export interface ClaimDto {
  id: string
  /** @format date-time */
  createdAt: string
  /** @format date-time */
  updatedAt: string
  nftAddress: string
  /** @minLength -1 */
  email?: string
  /** @minLength -1 */
  wallet?: string
  claimAt: string
  /** @example ["QR_CODE","WALLET","EMAIL"] */
  method: "QR_CODE" | "WALLET" | "EMAIL"
  /** @minLength -1 */
  signature?: string
  /** @example ["QR_CODE","WALLET","EMAIL"] */
  drop: "QR_CODE" | "WALLET" | "EMAIL"
}

export interface WithdrawNFTDto {
  email: string
  claimant: string
  /** @format uuid */
  dropId: string
  network: string
}

export interface SolanaPayClaimGetDto {
  label: string
  icon: string
}

export type AuthControllerUserLoginData = LoginPayloadDto

export type AuthControllerLoginByMagicLinkData = any

export type AuthControllerMagicCallbackData = any

export type AuthControllerWalletLoginData = LoginPayloadDto

export type AuthControllerSocialRegisterData = LoginPayloadDto

export type AuthControllerUserRegisterPayload = UserRegisterDto & {
  /** @format binary */
  avatar?: File
}

export type AuthControllerUserRegisterData = UserDto

export type AuthControllerLogoutData = UserDto

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
  results?: Array<PageDto>
}

export type UserControllerUpdateUderData = any

export type UserControllerGetUserData = UserDto

export interface UserControllerGetNfTsV1Params {
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

export type UserControllerGetNfTsV1Data = UserDto

export type NftControllerCreateNftPayload = CreateNftDto & {
  /** @format binary */
  image?: File
}

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
  results?: Array<PageDto>
}

export type NftControllerGetNftData = NftDto

export type NftControllerUpdateNftPayload = UpdateNftDto & {
  /** @format binary */
  image?: File
}

export type NftControllerUpdateNftData = any

export type NftControllerDeleteNftData = any

export interface NftControllerGetDropsByNftParams {
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

export type NftControllerGetDropsByNftData = PageDto

export type NftDropsControllerCreateWebsiteDropData = CheckoutDropDto

export type NftDropsControllerUpdateWebsiteDropData = WebsiteDropDto

export type NftDropsControllerCreateSecretDropData = CheckoutDropDto

export type NftDropsControllerCreateMintLinksDropData = CheckoutDropDto

export type NftDropsControllerGetDropData = DropDto

export type NftDropsControllerGetDropBySlugData = DropDto

export type NftDropsControllerGetDropByMintLinkData = DropDto

export type NftDropsControllerRequestAmountData = CheckoutDropDto

export type NftDropsControllerRepayData = CheckoutDropDto

export type CheckoutControllerWebhookData = any

export type CheckoutControllerSimulateWebhookData = any

export type CheckoutControllerRepayData = CheckoutDropDto

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

export type TreesControllerCreateTreeData = TransactionResponseDto

export type TreesControllerFindTreeData = TreeDto

export type ClaimsControllerClaimByWalletData = ClaimDto

export type ClaimsControllerClaimByQrData = ClaimDto

export type ClaimsControllerWithdrawNftData = ClaimDto

export type ClaimsControllerGetNfTsData = Array<ClaimDto>

export interface ClaimsControllerSolanaClaimGetParams {
  label: string
  icon: string
}

export type ClaimsControllerSolanaClaimGetData = SolanaPayClaimGetDto

export interface ClaimsControllerGetClaimsByDropParams {
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
  dropId: string
}

export type ClaimsControllerGetClaimsByDropData = PageDto & {
  results?: Array<ClaimDto>
}
