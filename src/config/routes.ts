export const Routes = {
  INDEX: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  NEW_NFT_DROP: "/dashboard/new-nft-drop",
  NFT_DROP_DETAIL: (dropId: string) => `/dashboard/${dropId}`,
}
