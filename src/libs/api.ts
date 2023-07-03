import qs from "query-string"
import Cookies from "js-cookie"
import fetcher from "./fetcher"
import { BaseListResponse } from "@/types/schema"
import {
  CheckoutDropDto,
  ClaimDto,
  ClaimsControllerGetClaimsByDropData,
  ClaimsControllerGetClaimsByDropParams,
  CreateClaimByEmailDto,
  CreateClaimByWalletDto,
  // CreateClaimDto,
  CreateDropTXDto,
  // CreateNFTDropDto,
  CreateNftDto,
  CreateWebsiteDropDto,
  DropDto,
  LoginPayloadDto,
  NftDto,
  SocialUserRegisterDto,
  UpdateNftDto,
  UserDto,
  WithdrawNFTDto,
} from "@/types/apis"
import { API_BASE_URL, APP_BASE_URL } from "@/config/env"

type Headers = Record<string, string>

class Client {
  headers: Headers = {
    "Content-Type": "application/json",
  }

  setAccessToken(token: string) {
    Cookies.set("accessToken", token)
  }

  getAccessToken() {
    return Cookies.get("accessToken")
  }

  purgeAccessToken() {
    Cookies.remove("accessToken", { path: "/" })
  }

  getPrivateToken() {
    return this.getAccessToken()
      ? {
          ...this.headers,
          Authorization: `Bearer ${this.getAccessToken()}`,
        }
      : this.headers
  }

  privateHeaders: Headers = {
    ...this.headers,
  }

  baseUrl: string = API_BASE_URL

  public get formDataHeaders(): Headers {
    const cloned = Object.assign({}, this.getPrivateToken())
    // Browsers will auto-set Content-Type and other things when formData is used
    // Content-Type must not be present for form data to work
    delete cloned["Content-Type"]
    return cloned
  }

  public async login(email: string, password: string) {
    const response = await fetcher<LoginPayloadDto>(`${this.baseUrl}/auth/login`, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    })
    if (response.token.accessToken) {
      this.setAccessToken(response.token.accessToken)
    }
    return response
  }

  public async signOut() {
    this.purgeAccessToken()
  }

  public async walletLogin(wallet: string) {
    const response = await fetcher<LoginPayloadDto>(`${this.baseUrl}/auth/wallet-login`, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify({
        wallet,
      }),
    })
    if (response.token.accessToken) {
      this.setAccessToken(response.token.accessToken)
    }
    return response
  }

  public socialLogin(dto: SocialUserRegisterDto) {
    return fetcher<LoginPayloadDto>(`${this.baseUrl}/auth/social-login`, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify(dto),
    })
  }

  public loginByMagicLink(email: string, callback?: string, redirect?: string) {
    return fetcher(`${this.baseUrl}/auth/login/magic`, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify({
        destination: email,
        callbackUrl: callback ?? `${APP_BASE_URL}/welcome`,
        redirectUrl: redirect ?? "",
      }),
    })
  }

  public async magicLinkCallback(token: string) {
    const response = await fetcher<LoginPayloadDto>(`${this.baseUrl}/auth/magiclogin/callback?token=${token}`, {
      headers: this.headers,
    })
    if (response.token.accessToken) {
      this.setAccessToken(response.token.accessToken)
    }
    return response
  }

  public getCurrentUser() {
    return fetcher<UserDto>(`${this.baseUrl}/v1/auth/me`, {
      headers: this.getPrivateToken(),
    })
  }

  public getNFTs(userId: string) {
    return fetcher<BaseListResponse<NftDto>>(`${this.baseUrl}/users/${userId}/nfts`, {
      headers: this.getPrivateToken(),
    })
  }

  public createNFT(body: CreateNftDto) {
    return fetcher<NftDto>(`${this.baseUrl}/nfts`, {
      headers: this.getPrivateToken(),
      method: "POST",
      body: JSON.stringify(body),
    })
  }

  public updateNFT(nftId: string, body: UpdateNftDto) {
    return fetcher<NftDto>(`${this.baseUrl}/nfts/${nftId}`, {
      headers: this.getPrivateToken(),
      method: "PUT",
      body: JSON.stringify(body),
    })
  }

  public getNFTDrops(nftId: string) {
    return fetcher<BaseListResponse<DropDto>>(`${this.baseUrl}/nfts/${nftId}/drops`, {
      headers: this.getPrivateToken(),
    })
  }

  public getDrop(dropId: string) {
    return fetcher<DropDto>(`${this.baseUrl}/drops/${dropId}`, {
      headers: this.getPrivateToken(),
    })
  }

  public getNFT(nftId: string) {
    return fetcher<NftDto>(`${this.baseUrl}/nfts/${nftId}`, {
      headers: this.getPrivateToken(),
    })
  }

  public createWebsiteDrop(body: CreateWebsiteDropDto) {
    return fetcher<CheckoutDropDto>(`${this.baseUrl}/drops/website`, {
      headers: this.getPrivateToken(),
      method: "POST",
      body: JSON.stringify(body),
    })
  }

  // public getCreateDropTransaction(body: CreateDropTXDto) {
  //   return fetcher<{ id: string; transaction: string }>(`${this.baseUrl}/transactions/create-drop-transaction`, {
  //     headers: this.getPrivateToken(),
  //     method: "POST",
  //     body: JSON.stringify(body),
  //   })
  // }

  public checkDropSuffix(suffix: string) {
    return fetcher<any>(`${this.baseUrl}/drops/check-drop-suffix/${suffix}`, {
      headers: this.getPrivateToken(),
    })
  }

  public getDropBySlug(slug: string) {
    return fetcher<DropDto>(`${this.baseUrl}/drops/slug/${slug}`, {
      headers: this.headers,
    })
  }

  public claimNFTByWallet(dto: CreateClaimByWalletDto) {
    return fetcher<ClaimDto>(`${this.baseUrl}/claims/wallet`, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify(dto),
    })
  }

  public claimNFTByEmail(dto: CreateClaimByEmailDto) {
    return fetcher<ClaimDto>(`${this.baseUrl}/claims/email`, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify(dto),
    })
  }

  public withdrawNFT(dto: WithdrawNFTDto) {
    return fetcher<ClaimDto>(`${this.baseUrl}/claims/withdraw-nft`, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify(dto),
    })
  }

  public getClaimsByEmail(email: string) {
    return fetcher<ClaimDto[]>(`${this.baseUrl}/claims/${email}`, {
      headers: this.headers,
    })
  }

  public getClaims(query: ClaimsControllerGetClaimsByDropParams) {
    return fetcher<ClaimsControllerGetClaimsByDropData>(`${this.baseUrl}/claims/drops/all?${qs.stringify(query)}`, {
      headers: this.headers,
    })
  }
}

const client = new Client()

export { client }
