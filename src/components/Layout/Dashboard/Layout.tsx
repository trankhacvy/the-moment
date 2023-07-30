import { PropsWithChildren } from "react"
import { DashboardHeader } from "./Header"
import { DashboardNav } from "./Nav"
import { useCurrentUser } from "@/hooks/useCurrentUser"
import { useRouter } from "next/router"

export const DashboardLayout = ({ children }: PropsWithChildren) => {
  const { asPath, push } = useRouter()
  const { error, isLoading } = useCurrentUser()

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="w-40">
          <svg
            id="L6"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 100 100"
            enableBackground="new 0 0 100 100"
            xmlSpace="preserve"
          >
            <rect fill="none" className="stroke-primary-500" strokeWidth={4} x={25} y={25} width={50} height={50}>
              <animateTransform
                attributeName="transform"
                dur="0.5s"
                from="0 50 50"
                to="180 50 50"
                type="rotate"
                id="strokeBox"
                attributeType="XML"
                begin="rectBox.end"
              />
            </rect>
            <rect x={27} y={27} className="fill-primary-500" width={46} height={50}>
              <animate
                attributeName="height"
                dur="1.3s"
                attributeType="XML"
                from={50}
                to={0}
                id="rectBox"
                fill="freeze"
                begin="0s;strokeBox.end"
              />
            </rect>
          </svg>
        </div>
      </div>
    )
  }

  if (error) {
    const redirectTo = asPath

    push(`/?next=${redirectTo}`)
    return null
  }

  return (
    <>
      <DashboardHeader />
      <div className="flex min-h-full w-full bg-blur-image">
        <DashboardNav />
        <main className="w-full py-[72px] lg:w-[calc(100vw-160px)] lg:grow lg:px-4 lg:py-[100px]">
          <div className="w-full px-4 md:px-6 2xl:mx-auto 2xl:max-w-screen-2xl">{children}</div>
        </main>
      </div>
    </>
  )
}
