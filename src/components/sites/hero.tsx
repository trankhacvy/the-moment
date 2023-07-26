import { AspectRatio } from "@/components/ui/AspectRatio"
import { Button } from "@/components/ui/Button"
import { Routes } from "@/config/routes"
import { ArrowRightIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export const HeroSection = () => {
  return (
    <div className="overflow-hidden bg-blur-image bg-center bg-no-repeat">
      <div className="mx-auto block max-w-screen-xl px-4 py-20 md:px-6 lg:flex lg:min-h-screen lg:items-center">
        <div className="jusify-center flex w-full flex-row flex-wrap items-center justify-between py-10">
          <div className="w-full min-w-0 grow-0 basis-[auto] p-4 md:p-6 lg:w-1/2">
            <div className="-mx-4 flex flex-col items-center md:-mx-6 lg:items-start">
              <h1 className="mb-4 text-center text-4xl font-extrabold leading-none tracking-tight text-gray-800 dark:text-white md:text-5xl lg:text-left xl:text-6xl">
                Gasless <span className="text-primary-500">POAP</span> Dispenser on Solana
              </h1>
              <p className="mb-6 text-center text-gray-600 dark:text-white md:text-lg lg:mb-8 lg:text-left lg:text-xl">
                Effortlessly create and distribute POAPs with cost-effective compressed NFT
              </p>
              <Link href={Routes.LOGIN}>
                <Button size="lg" className="px-5" endDecorator={<ArrowRightIcon />}>
                  Get started
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden w-full min-w-0 grow-0 basis-[auto] p-4 md:p-6 lg:block lg:w-1/2">
            <div className="w-5/6">
              <AspectRatio ratio={1485 / 1368}>
                <Image alt="hero" fill src="/assets/hero1.png" />
              </AspectRatio>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
