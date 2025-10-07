import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { ApiShowcase } from "@/components/landing/api-showcase"
import { Pricing } from "@/components/landing/pricing"
import { CTA } from "@/components/landing/cta"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <div className="dark min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <ApiShowcase />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
