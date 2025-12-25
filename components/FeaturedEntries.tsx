"use client"

import { useEffect, useState } from "react"

interface Entry {
  id: string
  title: string | null
  lines: string[]
  author: string
  neighborhood: string
  date: string
  rotation: string
}

interface Reflection {
  id: string
  title: string | null
  reflection: string
  neighborhood: string
  featured: boolean
  created_at: string
}

const rotations = ["rotate-[-1deg]", "rotate-[0.5deg]", "rotate-[1deg]", "rotate-[-0.5deg]", "rotate-[0.75deg]"]

export function FeaturedEntries() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeaturedEntries() {
      try {
        const response = await fetch("/api/reflections?featured=true")
        const result = await response.json()

        if (result.error) {
          console.error("API error:", result.error)
          setEntries([])
          return
        }

        if (result.data && Array.isArray(result.data)) {
          // Transform reflections into entries format
          const transformedEntries: Entry[] = result.data.map((reflection: Reflection, index: number) => {
            // Split reflection text into lines
            const lines = reflection.reflection
              .split("\n")
              .map((line) => line.trim())
              .filter((line) => line.length > 0)

            // Format date from created_at
            const formatDate = (dateString: string) => {
              try {
                const date = new Date(dateString)
                const month = String(date.getMonth() + 1).padStart(2, '0')
                const day = String(date.getDate()).padStart(2, '0')
                const year = date.getFullYear()
                return `${month}.${day}.${year}`
              } catch {
                return '—'
              }
            }

            return {
              id: reflection.id,
              title: reflection.title || "Untitled",
              lines,
              author: reflection.title || "Untitled",
              neighborhood: reflection.neighborhood,
              date: formatDate(reflection.created_at),
              rotation: rotations[index % rotations.length],
            }
          })

          setEntries(transformedEntries)
        } else {
          setEntries([])
        }
      } catch (error) {
        console.error("Error fetching featured entries:", error)
        setEntries([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedEntries()
  }, [])

  const scrollToJournal = () => {
    const element = document.getElementById("journal")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="featured" className="py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10 md:mb-14">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
            Reflections
          </h2>
          <button
            onClick={scrollToJournal}
            className="text-primary hover:text-[color:var(--teal-900)] font-medium text-sm md:text-base transition-colors underline underline-offset-4 decoration-2 focus:outline-none focus:ring-2 focus:ring-primary/40 rounded-lg px-3 py-2"
          >
            Add yours
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-20">
              <p className="text-foreground/60">Loading featured entries...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="col-span-full flex items-center justify-center py-20">
              <p className="text-foreground/60">No featured entries yet. Check back soon!</p>
            </div>
          ) : (
            entries.map((entry) => (
            <div
              key={entry.id}
              className={`bg-background rounded-2xl p-8 md:p-10 shadow-md border border-border/50 transition-all duration-300 motion-safe:hover:-translate-y-2 motion-safe:hover:shadow-2xl hover:border-primary/30 ${entry.rotation} relative group`}
            >
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-6 rounded-sm shadow-md"
                style={{ backgroundColor: "var(--muted)" }}
              />

              <div className="space-y-5">
                <h3 className="font-serif text-xl md:text-2xl font-semibold text-foreground">{entry.title}</h3>

                <div className="space-y-2.5">
                  {entry.lines.slice(0, 7).map((line, idx) => (
                    <p key={idx} className="text-foreground/75 leading-relaxed text-[15px]">
                      {line}
                    </p>
                  ))}
                </div>

                <div className="pt-4 space-y-2">
                  <svg
                    className="w-24 h-1.5 text-primary opacity-30"
                    viewBox="0 0 100 6"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 3C15 1.5 30 4.5 50 3C70 1.5 85 4.5 98 3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  <p className="text-sm text-foreground/60 italic font-serif">{entry.author}</p>
                  <p className="text-sm text-foreground/60 italic font-serif">{entry.neighborhood}</p>
                  <p className="text-sm text-foreground/60 italic font-serif">{entry.date}</p>
                </div>
              </div>
            </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
