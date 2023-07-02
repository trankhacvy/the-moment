import { DropDto, NftDto } from "@/types/apis"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { useNFTDrops } from "@/hooks/use-nft-drops"
import { Badge } from "../ui/badge"
import Link from "next/link"
import { Routes } from "@/config/routes"
import { useRouter } from "next/router"

type DropListProps = {
  nft?: NftDto
}

export const DropList = ({ nft }: DropListProps) => {
  const { drops, isLoading } = useNFTDrops(nft?.id)
  if (isLoading) return <p>loading...</p>

  const paidDrops = drops?.filter((drop) => drop.checkout.status === "PAID")
  const draftDrops = drops?.filter((drop) => drop.checkout.status === "INIT")
  const failedDrops = drops?.filter((drop) => drop.checkout.status === "FAILED")

  return (
    <div className="mx-auto max-w-screen-xl">
      <Tabs defaultValue="all" className="w-full overflow-hidden rounded-2xl bg-white shadow-card">
        <TabsList className="mt-2 w-full px-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="failed">Payment failed</TabsTrigger>
        </TabsList>
        <TabsContent value="all">{drops && <DropsTable nftId={nft?.id ?? ""} drops={drops} />}</TabsContent>
        <TabsContent value="paid">{paidDrops && <DropsTable nftId={nft?.id ?? ""} drops={paidDrops} />}</TabsContent>
        <TabsContent value="draft">{draftDrops && <DropsTable nftId={nft?.id ?? ""} drops={draftDrops} />}</TabsContent>
        <TabsContent value="failed">
          {failedDrops && <DropsTable nftId={nft?.id ?? ""} drops={failedDrops} />}
        </TabsContent>
      </Tabs>
    </div>
  )
}

const DropsTable = ({ nftId, drops }: { nftId: string; drops: DropDto[] }) => {
  const { push } = useRouter()
  return (
    <table className="w-full table-fixed border-collapse">
      <thead className="bg-gray-200">
        <tr>
          <th className="border-b px-4 py-3 text-left font-medium text-gray-500">No.</th>
          <th className="border-b px-4 py-3 text-left font-medium text-gray-500">Num of NFTs</th>
          <th className="border-b px-4 py-3 text-left font-medium text-gray-500">Method</th>
          <th className="border-b px-4 py-3 text-left font-medium text-gray-500">Status</th>
        </tr>
      </thead>
      <tbody>
        {drops?.map((drop, idx) => (
          <tr onClick={() => push(Routes.DROP_DETAIL(nftId, drop.id))} className="cursor-pointer" key={drop.id}>
            <td className="p-4">{`#${idx + 1}`}</td>
            <td className="p-4">{drop.amount}</td>
            <td className="p-4">{drop.method}</td>
            <td className="p-4">
              {drop.checkout.status === "INIT" && <Badge>Draft</Badge>}
              {drop.checkout.status === "FAILED" && <Badge variant="success">Paid</Badge>}
              {drop.checkout.status === "PAID" && <Badge variant="error">Payment failed</Badge>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
