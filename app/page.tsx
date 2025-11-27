import { Header } from "@/components/Header"
import { Hero } from "@/components/Hero"
import { ReelStrip } from "@/components/ReelStrip"
import { FeaturedEntries } from "@/components/FeaturedEntries"
import { JournalForm } from "@/components/JournalForm"
import { Manifesto } from "@/components/Manifesto"
import { Footer } from "@/components/Footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <div className="space-y-8 md:space-y-12">
        <ReelStrip />
        <FeaturedEntries />
        <JournalForm />
        <Manifesto />
      </div>
      <Footer />
    </main>
  )
}
