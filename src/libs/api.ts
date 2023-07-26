import axios from "axios"
import Cookies from "js-cookie"
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
  UpdateWebsiteDropDto,
  UserDto,
  WithdrawNFTDto,
} from "@/types/apis"
import { API_BASE_URL, APP_BASE_URL } from "@/config/env"

type Headers = Record<string, string>
const AUTH_COOKIE_KEY = "minions-access-token"

const unAuthorizedStatus = [401]
const nonValidatedRoutes = ["/", "/login", "/welcome", "/claim"]

const validateRouteCheck = (route: string): boolean => {
  let validationToggle = false
  const routeCheck = nonValidatedRoutes.find((_route: string) =>
    _route === "/" ? _route === route : route.startsWith(_route)
  )
  if (routeCheck) validationToggle = true
  return validationToggle
}

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("errr", error)
    const { status }: any = error.response
    if (!validateRouteCheck(window.location.pathname)) {
      if (unAuthorizedStatus.includes(status)) {
        // Cookies.remove("refreshToken", { path: "/" })
        Cookies.remove(AUTH_COOKIE_KEY, { path: "/" })
        window.location.href = `/?next_url=${window.location.pathname}`
      }
    }
    return Promise.reject(error)
  }
)

class Client {
  headers: Headers = {
    "Content-Type": "application/json",
  }

  setAccessToken(token: string) {
    Cookies.set(AUTH_COOKIE_KEY, token)
  }

  getAccessToken() {
    return Cookies.get(AUTH_COOKIE_KEY)
  }

  purgeAccessToken() {
    Cookies.remove(AUTH_COOKIE_KEY, { path: "/" })
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

  public async signOut() {
    this.purgeAccessToken()
  }

  public loginByMagicLink(email: string, callback?: string, redirect?: string) {
    return axios({
      method: "POST",
      url: `${this.baseUrl}/auth/login/magic`,
      data: {
        destination: email,
        callbackUrl: callback ?? `${APP_BASE_URL}/welcome`,
        redirectUrl: redirect ?? "",
      },
      headers: this.headers,
    })
      .then((response) => response.data)
      .catch((error) => {
        throw error?.response?.data
      })
  }

  public async magicLinkCallback(token: string) {
    return axios<LoginPayloadDto>({
      method: "GET",
      url: `${this.baseUrl}/auth/magiclogin/callback?token=${token}`,
      headers: this.headers,
    })
      .then((response) => {
        if (response.status === 200) {
          this.setAccessToken(response.data.token.accessToken)
          return response.data
        }
      })
      .catch((error) => {
        throw error?.response?.data
      })
  }

  public getCurrentUser() {
    return axios<UserDto>({
      method: "GET",
      url: `${this.baseUrl}/v1/auth/me`,
      headers: this.getPrivateToken(),
    })
      .then((response) => response.data)
      .catch((error) => {
        throw error?.response?.data
      })
  }

  public getNFTs(userId: string) {
    return axios<BaseListResponse<NftDto>>({
      method: "GET",
      url: `${this.baseUrl}/users/${userId}/nfts`,
      headers: this.getPrivateToken(),
    })
      .then((response) => response.data)
      .catch((error) => {
        throw error?.response?.data
      })
  }

  public createNFT(data: FormData) {
    return axios<NftDto>({
      method: "POST",
      url: `${this.baseUrl}/nfts`,
      data,
      headers: this.getPrivateToken(),
    })
      .then((response) => response.data)
      .catch((error) => {
        throw error?.response?.data
      })
  }

  public updateNFT(nftId: string, data: FormData) {
    return axios<NftDto>({
      method: "PUT",
      url: `${this.baseUrl}/nfts/${nftId}`,
      data,
      headers: this.getPrivateToken(),
    })
      .then((response) => response.data)
      .catch((error) => {
        throw error?.response?.data
      })
  }

  public getNFTDrops(nftId: string) {
    return axios<BaseListResponse<DropDto>>({
      method: "GET",
      url: `${this.baseUrl}/nfts/${nftId}/drops`,
      headers: this.getPrivateToken(),
    })
      .then((response) => response.data)
      .catch((error) => {
        throw error?.response?.data
      })
  }

  public getDrop(dropId: string) {
    return axios<DropDto>({
      method: "GET",
      url: `${this.baseUrl}/drops/${dropId}`,
      headers: this.getPrivateToken(),
    })
      .then((response) => response.data)
      .catch((error) => {
        throw error?.response?.data
      })
  }

  public getNFT(nftId: string) {
    return axios<NftDto>({
      method: "GET",
      url: `${this.baseUrl}/nfts/${nftId}`,
      headers: this.getPrivateToken(),
    })
      .then((response) => response.data)
      .catch((error) => {
        throw error?.response?.data
      })
  }

  public createWebsiteDrop(data: CreateWebsiteDropDto) {
    return axios<CheckoutDropDto>({
      method: "POST",
      url: `${this.baseUrl}/drops/website`,
      data,
      headers: this.getPrivateToken(),
    })
      .then((response) => response.data)
      .catch((error) => {
        throw error?.response?.data
      })
  }

  public updateWebsiteDrop(dropId: string, data: UpdateWebsiteDropDto) {
    return axios<CheckoutDropDto>({
      method: "PUT",
      url: `${this.baseUrl}/drops/website/${dropId}`,
      data,
      headers: this.getPrivateToken(),
    })
      .then((response) => response.data)
      .catch((error) => {
        throw error?.response?.data
      })
  }

  public deleteDrop(dropId: string) {
    return axios({
      method: "DELETE",
      url: `${this.baseUrl}/drops/${dropId}`,
      headers: this.getPrivateToken(),
    })
      .then((response) => response.data)
      .catch((error) => {
        throw error?.response?.data
      })
  }

  public getDropBySlug(slug: string) {
    return axios<DropDto>({
      method: "GET",
      url: `${this.baseUrl}/drops/slug/${slug}`,
      headers: this.headers,
    })
      .then((response) => response.data)
      .catch((error) => {
        throw error?.response?.data
      })
  }

  public repayDrop(dropId: string, callbackURL: string) {
    return axios<CheckoutDropDto>({
      method: "POST",
      url: `${this.baseUrl}/drops/${dropId}/repay`,
      data: {
        callback: callbackURL,
      },
      headers: this.getPrivateToken(),
    })
      .then((response) => response.data)
      .catch((error) => {
        throw error?.response?.data
      })
  }

  public claimNFTByWallet(dto: CreateClaimByWalletDto) {
    return axios<ClaimDto>({
      method: "POST",
      url: `${this.baseUrl}/claims/wallet`,
      data: dto,
      headers: this.headers,
    })
      .then((response) => response.data)
      .catch((error) => {
        throw error?.response?.data
      })
  }

  public claimNFTByEmail(dto: CreateClaimByEmailDto) {
    return axios<ClaimDto>({
      method: "POST",
      url: `${this.baseUrl}/claims/email`,
      data: dto,
      headers: this.headers,
    })
      .then((response) => response.data)
      .catch((error) => {
        throw error?.response?.data
      })
  }

  public withdrawNFT(dto: WithdrawNFTDto) {
    return axios<ClaimDto>({
      method: "POST",
      url: `${this.baseUrl}/claims/withdraw-nft`,
      data: dto,
      headers: this.headers,
    })
      .then((response) => response.data)
      .catch((error) => {
        throw error?.response?.data
      })
  }

  public getClaimsByEmail(email: string) {
    // return fetcher<ClaimDto[]>(`${this.baseUrl}/claims/${email}`, {
    //   headers: this.headers,
    // })
  }

  public getClaims(dropId: string) {
    // return fetcher<ClaimsControllerGetClaimsByDropData>(`${this.baseUrl}/claims/drops/${dropId}`, {
    //   headers: this.headers,
    // })
  }
}

const client = new Client()

export { client }
