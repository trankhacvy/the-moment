import { SOLANA_NETWORK } from "@/config/env"

export const getTransactionUrl = (signature: string, network = SOLANA_NETWORK) =>
  `https://translator.shyft.to/tx/${signature}?cluster=${network}`
