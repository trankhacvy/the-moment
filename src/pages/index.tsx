import { SiteHeader } from "@/components/sites/SiteHeader"
import { HeroSection } from "@/components/sites/hero"

const HomePage = () => {
  return (
    <>
      <SiteHeader />
      <main className="h-full w-full">
        <HeroSection />
      </main>
    </>
  )
}

export default HomePage
