"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

interface Reflection {
  id: string
  email: string
  neighborhood: string
  reflection: string
  created_at: string
}

export default function ExplorePage() {
  const [reflections, setReflections] = useState<Reflection[]>([])
  const [filteredReflections, setFilteredReflections] = useState<Reflection[]>([])
  const [neighborhoods, setNeighborhoods] = useState<string[]>([])
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReflections = async () => {
      try {
        const response = await fetch("/api/reflections")
        const { data } = await response.json()

        if (data) {
          // Shuffle reflections randomly
          const shuffled = [...data].sort(() => Math.random() - 0.5)
          setReflections(shuffled)

          // Extract unique neighborhoods
          const uniqueNeighborhoods = Array.from(new Set(data.map((r: Reflection) => r.neighborhood))) as string[]
          setNeighborhoods(uniqueNeighborhoods.sort())

          setFilteredReflections(shuffled)
        }
      } catch (error) {
        console.error("[v0] Error fetching reflections:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReflections()
  }, [])

  const handleNeighborhoodChange = (neighborhood: string) => {
    setSelectedNeighborhood(neighborhood)

    if (neighborhood === "all") {
      setFilteredReflections([...reflections].sort(() => Math.random() - 0.5))
    } else {
      const filtered = reflections.filter((r) => r.neighborhood === neighborhood)
      setFilteredReflections([...filtered].sort(() => Math.random() - 0.5))
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {/* Header Section */}
          <div className="space-y-6 mb-12">
            <div className="space-y-3">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground">
                Explore reflections
              </h1>
              <p className="text-foreground/70 leading-relaxed text-base md:text-lg max-w-2xl">
                Discover moments shared by dog lovers near you. Read stories about the joy, comfort, and connection
                found with our furry companions.
              </p>
            </div>

            {/* Neighborhood Filter */}
            <div className="flex flex-wrap gap-3 pt-4">
              <button
                onClick={() => handleNeighborhoodChange("all")}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedNeighborhood === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                All neighborhoods
              </button>
              {neighborhoods.map((neighborhood) => (
                <button
                  key={neighborhood}
                  onClick={() => handleNeighborhoodChange(neighborhood)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    selectedNeighborhood === neighborhood
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {neighborhood}
                </button>
              ))}
            </div>
          </div>

          {/* Reflections Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-foreground/60">Loading reflections...</p>
            </div>
          ) : filteredReflections.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-foreground/60">No reflections found. Be the first to share one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReflections.map((reflection) => (
                <div
                  key={reflection.id}
                  className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-secondary/50 hover:shadow-xl transition-shadow"
                >
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-primary mb-1">{reflection.neighborhood}</p>
                      <p className="text-xs text-foreground/50">
                        {new Date(reflection.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <p className="text-foreground leading-relaxed line-clamp-6">{reflection.reflection}</p>

                    <p className="text-xs text-foreground/50">{reflection.reflection.split(/\s+/).length} words</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
