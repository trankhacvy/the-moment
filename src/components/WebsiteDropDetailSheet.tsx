import Link from "next/link"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/Sheet"
import { useClaims } from "@/hooks/useClaims"
import { truncate } from "@/utils/truncate"
import dayjs from "dayjs"

type WebsiteDropDetailSheetProps = {
  trigger: React.ReactNode
  dropId: string
}

export const WebsiteDropDetailSheet = ({ trigger, dropId }: WebsiteDropDetailSheetProps) => {
  // TODO skeleton
  const { claims = [] } = useClaims(dropId)

  console.log("claims", claims)

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent position="right" className="!max-w-xl w-full !px-0">
        <SheetHeader className="px-6">
          <SheetTitle>Website drop</SheetTitle>
        </SheetHeader>
        <div className="py-4 overflow-x-scroll overflow-y-hidden">
          <table className="w-full min-w-[600px] border-collapse">
            <thead className="bg-gray-200 table-header-group">
              <tr className="table-row align-middle">
                <th className="text-sm border-b p-4 text-left font-semibold text-gray-500">No.</th>
                <th className="text-sm border-b p-4 text-left font-semibold text-gray-500">NFT</th>
                <th className="text-sm border-b p-4 text-left font-semibold text-gray-500">User</th>
                <th className="text-sm border-b p-4 text-left font-semibold text-gray-500">Method</th>
                <th className="text-sm border-b p-4 text-left font-semibold text-gray-500">Claim At</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((claim, idx) => (
                <tr>
                  <td className="text-sm p-4">{idx + 1}</td>
                  <td className="text-sm p-4">{truncate(claim.nftAddress, 12, true)}</td>
                  <td className="text-sm p-4">{truncate(claim.wallet ?? claim.email ?? "", 12, true)}</td>
                  <td className="text-sm p-4">Wallet</td>
                  <td className="text-sm p-4">{dayjs(claim.claimAt).format("DD/MM/YYYY")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SheetContent>
    </Sheet>
  )
}
