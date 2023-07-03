import { NftDto } from "@/types/apis"
import { Skeleton } from "../ui/Skeleton"

type NFTCardProps = {
  nft: NftDto
}

export const NFTCard = ({ nft }: NFTCardProps) => {
  return <div>{nft.name}</div>
}

export const NFTCardSkeleton = () => {
  return <Skeleton className="h-10 w-10" />
}

// type NFTItemProps = {
//     claim: ClaimDto
//     nft: NftDto
//     nftDrop: DropDto
//     onSuccess?: VoidFunction
//   }

//   export const NFTItem = ({ claim, nft, nftDrop, onSuccess }: NFTItemProps) => {
//     const { connected, publicKey } = useWallet()

//     return (
//       <div className="overflow-hidden rounded-2xl bg-white shadow-card">
//         <AspectRatio>
//           <Image src={nft.image} alt={nft.name} fill />
//         </AspectRatio>
//         <div className="p-5">
//           <Typography className="mb-2 font-semibold">{nft.name}</Typography>
//           <Typography color="secondary" level="body4" className="line-clamp-2 text-ellipsis">
//             {nft.description}
//           </Typography>
//           <div className="mt-4 flex justify-end">
//             {claim.owner ? (
//               <Button variant="outline" disabled>
//                 Claimed
//               </Button>
//             ) : (
//               <>
//                 {connected && publicKey ? (
//                   <WithdrawNFTModal
//                     nftDrop={nftDrop}
//                     trigger={
//                       <Button className="" size="sm">
//                         Withdraw
//                       </Button>
//                     }
//                     onSuccess={onSuccess}
//                   />
//                 ) : (
//                   <ConnectWalletButton />
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     )
//   }
