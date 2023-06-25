import { Button } from "@/components/ui/Button"
import { Typography } from "@/components/ui/Typography"
import { motion, useMotionValue, useScroll, useTransform } from "framer-motion"
import { useEffect, useRef, useState } from "react"

export default function Motion() {
  const [rotate, setRotate] = useState(0)

  //   return (
  //     <main className="relative flex h-screen w-full items-center justify-center bg-green-300">
  //       <motion.div
  //         initial={{
  //           opacity: 0.6,
  //         }}
  //         whileHover={{
  //           opacity: 1,
  //           scale: 2,
  //           transition: {
  //             duration: 1,
  //             ease: "easeIn",
  //           },
  //         }}
  //         className="h-64 w-64 rounded-2xl bg-white shadow-card"
  //       ></motion.div>

  //       <div className="absolute right-4 top-4 w-full max-w-sm rounded-2xl bg-white p-4 shadow-card">
  //         <input
  //           value={rotate}
  //           onChange={(event) => setRotate(Number(event.target.value))}
  //           type="range"
  //           step={1}
  //           min={-180}
  //           max={180}
  //           className="w-full"
  //         />
  //         <span>{rotate}</span>
  //       </div>
  //     </main>
  //   )

  return (
    <>
      <Demo1 />
    </>
  )
}

const Demo1 = () => {
  const { scrollYProgress } = useScroll()
  return (
    <div className="w-full bg-green-200">
      <div className="relative h-[9000] w-full pb-[2000px]">
        <div className="fixed left-0 right-0 top-0">
          <div className="mx-auto max-w-screen-lg px-6">
            <Header />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-screen-lg px-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {Array.from({ length: 24 }).map((i) => (
            <Item
            //  className="aspect-square rounded-2xl bg-white shadow-card"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const Item = () => {
  const ref = useRef<HTMLDivElement>(null)

  //   const [value, setValue] = useState(0)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["end start", "start end"],
  })

  const translateY = useTransform(scrollYProgress, [1, 0.9, 0.1, 0], [200, 0, 0, -100])
  const opacity = useTransform(scrollYProgress, [0.2, 0], [1, 0])
  const scale = useTransform(scrollYProgress, [1, 0.9, 0.1, 0], [0.5, 1, 1, 0.5])
  return (
    <motion.div
      ref={ref}
      className="flex aspect-square items-center justify-center whitespace-pre break-words rounded-2xl bg-white p-5 shadow-card"
      style={{
        translateY,
        opacity,
        scale,
      }}
    ></motion.div>
  )
}

const Header = () => {
  const { scrollY } = useScroll()

  const translateX = useTransform(scrollY, [0, 300], ["0%", "-120%"])
  const opacity = useTransform(scrollY, [0, 300], [1, 0.2])

  return (
    <div className="relative flex py-10">
      <motion.div
        className="basis-1"
        style={{
          translateX: translateX,
          opacity,
        }}
      >
        <Typography className="mb-6" level="h2">
          Join the intergalactic battle.
        </Typography>
        <Typography className="mb-10" as="p" level="body3">
          Play-to-Earn NFT Marketplace
        </Typography>
        <Button size="lg">Join Now</Button>
      </motion.div>
      <div className="absolute right-0 h-[80vh]"></div>
    </div>
  )
}
