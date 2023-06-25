import { Header } from "@/components/Header"
import { AspectRatio } from "@/components/ui/AspectRatio"
import { Button } from "@/components/ui/Button"
import { Typography } from "@/components/ui/Typography"
import Image from "next/image"

const HomePage = () => {
  return (
    <>
      <Header />
      <main className="flex flex-col overflow-hidden bg-gray-900 py-28 pb-20 lg:min-h-screen lg:items-center lg:justify-center lg:pb-28">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-6">
          <div className="flex flex-col items-center justify-between lg:flex-row">
            <div className="w-full grow-0 text-center lg:w-1/2 lg:text-left xl:w-5/12">
              <Typography as="h1" level="h2" className="mb-6 font-bold text-white">
                Get The Career you deserve
              </Typography>
              <Typography as="p" className="text-white">
                Etiam sollicitudin, ipsum eu pulvinar rutrum, tellus ipsum laoreet sapien, quis venenatis ante odio sit
                amet eros.
              </Typography>
              <Button className="mt-10">Try Now</Button>
            </div>
            <div className="w-full grow-0 lg:flex lg:w-1/2 lg:justify-end">
              <div className="w-full max-w-[564px] overflow-hidden rounded-2xl">
                <AspectRatio>
                  <Image src="/assets/hero.jpg" alt="logo" fill />
                </AspectRatio>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

// import { AspectRatio } from "@/components/ui/AspectRatio"
// import { Typography } from "@/components/ui/Typography"
// import { ArrowRightIcon } from "lucide-react"
// import Image from "next/image"
// import Link from "next/link"

// const HomePage = () => {
//   return (
//     <div className="relative min-h-screen w-full">
//       <div className="absolute inset-0">
//         <Image className="z-[-1]" alt="banner" src="/assets/background.jpg" fill />
//       </div>
//       <div className="container mx-auto px-6 py-10">
//         <div className="glass-card flex min-h-[600px] flex-wrap items-center rounded-[40px]">
//           <div className="w-[calc(100%*6/12)] grow-0 basis-[auto] pl-6">
//             <div className="py-24">
//               <Typography as="h1" level="h2" className="mb-6 font-bold leading-tight text-white">
//                 Mint POAPs
//                 <br /> Without Paying Fees
//                 <br /> With Moment
//               </Typography>
//               <Typography level="body1" className="mb-10 text-white">
//                 The Moment is the first gasless POAP dispenser on
//                 <br /> Solana blockchain
//               </Typography>
//               <Link href="/login">
//                 <button className="v relative inline-flex items-center gap-2 rounded-2xl bg-white/25 px-8 py-2.5 font-bold text-white hover:bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0)_100%)]">
//                   Create now
//                   <ArrowRightIcon />
//                 </button>
//               </Link>
//             </div>
//           </div>
//           <div className="w-[calc(100%*6/12)] grow-0 basis-[auto] px-6">
//             <div className="mx-auto w-[80%]">
//               <AspectRatio className="overflow-hidden rounded-3xl">
//                 <Image className="z-[-1]" alt="hero" src="/assets/hero.jpg" fill />
//               </AspectRatio>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

export default HomePage
