import { client } from "@/libs/api"
import { ClaimDto } from "@/types/apis"
import useSWR from "swr"

const SWR_KEY = "/clams/drop/:id"

export function useClaims(dropId?: string) {
  const { data, ...rest } = useSWR(dropId ? [SWR_KEY, dropId] : null, () => client.getClaims(dropId as string))

  return {
    claims: data?.data as unknown as ClaimDto[],
    ...rest,
  }
}
