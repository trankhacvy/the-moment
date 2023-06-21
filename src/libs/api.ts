import { BASE_API_URL } from "@/config/common"
import fetcher from "./fetcher"
import {
  BaseListResponse,
  CreateDropRequest,
  CreateNFTRequest,
  GetCreateDropTXRequest,
  LoginResponse,
  NFTDrop,
  NFTMetadata,
  User,
} from "@/types/schema"

type Headers = Record<string, string>

export class Client {
  headers: Headers = {
    "Content-Type": "application/json",
  }

  privateHeaders: Headers = {
    ...this.headers,
  }

  baseUrl: string = BASE_API_URL

  public get formDataHeaders(): Headers {
    const cloned = Object.assign({}, this.privateHeaders)
    // Browsers will auto-set Content-Type and other things when formData is used
    // Content-Type must not be present for form data to work
    delete cloned["Content-Type"]
    return cloned
  }

  public setAuthToken(token: string) {
    this.privateHeaders = {
      ...this.privateHeaders,
      Authorization: `Bearer ${token}`,
    }
  }

  public clearAuthToken() {
    this.privateHeaders = { ...this.headers }
  }

  public login(email: string, password: string) {
    return fetcher<LoginResponse>(`${this.baseUrl}/auth/login`, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    })
  }

  public getCurrentUser() {
    return fetcher<User>(`${this.baseUrl}/v1/auth/me`, {
      headers: this.privateHeaders,
    })
  }

  public getNFTDrops(userId: string) {
    return fetcher<BaseListResponse<NFTDrop>>(`${this.baseUrl}/users/${userId}/nft-drops`, {
      headers: this.privateHeaders,
    })
  }

  public getNFTs(userId: string) {
    return fetcher<BaseListResponse<NFTMetadata>>(`${this.baseUrl}/users/${userId}/nfts`, {
      headers: this.privateHeaders,
    })
  }

  public createNFTDrop(body: CreateDropRequest) {
    return fetcher<NFTDrop>(`${this.baseUrl}/nft-drops`, {
      headers: this.privateHeaders,
      method: "POST",
      body: JSON.stringify(body),
    })
  }

  public createNFT(body: CreateNFTRequest) {
    return fetcher<NFTMetadata>(`${this.baseUrl}/nfts`, {
      headers: this.privateHeaders,
      method: "POST",
      body: JSON.stringify(body),
    })
  }

  public getNFTDrop(dropId: string) {
    return fetcher<NFTDrop>(`${this.baseUrl}/nft-drops/${dropId}`, {
      headers: this.privateHeaders,
    })
  }

  public getNFT(nftId: string) {
    return fetcher<NFTMetadata>(`${this.baseUrl}/nfts/${nftId}`, {
      headers: this.privateHeaders,
    })
  }

  public getCreateDropTransaction(body: GetCreateDropTXRequest) {
    return fetcher<{ transaction: string }>(`${this.baseUrl}/drop-methods/get-create-transaction`, {
      headers: this.privateHeaders,
      method: "POST",
      body: JSON.stringify(body),
    })
  }
}

const client = new Client()

export { client }
