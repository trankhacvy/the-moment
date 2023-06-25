import { BASE_API_URL } from "@/config/common"
import fetcher from "./fetcher"
import { BaseListResponse } from "@/types/schema"
import {
  ClaimDto,
  CreateClaimDto,
  CreateDropTXDto,
  CreateNFTDropDto,
  CreateNftDto,
  DropDto,
  LoginPayloadDto,
  NftDto,
  UpdateNftDto,
  UserDto,
} from "@/types/apis"

type Headers = Record<string, string>

class Client {
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
    return fetcher<LoginPayloadDto>(`${this.baseUrl}/auth/login`, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    })
  }

  public getCurrentUser() {
    return fetcher<UserDto>(`${this.baseUrl}/v1/auth/me`, {
      headers: this.privateHeaders,
    })
  }

  public getNFTs(userId: string) {
    return fetcher<BaseListResponse<NftDto>>(`${this.baseUrl}/users/${userId}/nfts`, {
      headers: this.privateHeaders,
    })
  }

  public createNFT(body: CreateNftDto) {
    return fetcher<NftDto>(`${this.baseUrl}/nfts`, {
      headers: this.privateHeaders,
      method: "POST",
      body: JSON.stringify(body),
    })
  }

  public updateNFT(nftId: string, body: UpdateNftDto) {
    return fetcher<NftDto>(`${this.baseUrl}/nfts/${nftId}`, {
      headers: this.privateHeaders,
      method: "PUT",
      body: JSON.stringify(body),
    })
  }

  public getNFTDrop(dropId: string) {
    return fetcher<DropDto>(`${this.baseUrl}/nft-drops/${dropId}`, {
      headers: this.privateHeaders,
    })
  }

  public getNFT(nftId: string) {
    return fetcher<NftDto>(`${this.baseUrl}/nfts/${nftId}`, {
      headers: this.privateHeaders,
    })
  }

  public createDrop(body: CreateNFTDropDto) {
    return fetcher<any>(`${this.baseUrl}/drops`, {
      headers: this.privateHeaders,
      method: "POST",
      body: JSON.stringify(body),
    })
  }

  public getCreateDropTransaction(body: CreateDropTXDto) {
    return fetcher<{ id: string; transaction: string }>(`${this.baseUrl}/transactions/create-drop-transaction`, {
      headers: this.privateHeaders,
      method: "POST",
      body: JSON.stringify(body),
    })
  }

  public checkDropSuffix(suffix: string) {
    return fetcher<any>(`${this.baseUrl}/drops/check-drop-suffix/${suffix}`, {
      headers: this.privateHeaders,
    })
  }

  public getDropBySuffix(suffix: string) {
    return fetcher<DropDto>(`${this.baseUrl}/drops/suffix/${suffix}`, {
      headers: this.headers,
    })
  }

  public claimNFT(dto: CreateClaimDto) {
    return fetcher<ClaimDto>(`${this.baseUrl}/claims`, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify(dto),
    })
  }
}

const client = new Client()

export { client }
