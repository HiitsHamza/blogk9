"use client"

import { useState, useEffect } from "react"

interface Reel {
  id: string
  video: string
  title: string
}

export function ReelStrip() {
  const [reels, setReels] = useState<Reel[]>([])

  useEffect(() => {
    const demoReels: Reel[] = [
      { id: "1", video: "/Toby & Jen Ventz.mov", title: "Toby" },
      { id: "2", video: "/Morty & Kathleen.mov", title: "Morty" },
      { id: "3", video: "/Koda & Taylor.mov", title: "Koda" },
      { id: "4", video: "/Bubu & Estivalli.mov", title: "Bubu" },
      { id: "5", video: "/RYDER cinematic.mov", title: "Ryder" },
    ]
    setReels(demoReels)
  }, [])

  if (reels.length === 0) return null

  return (
    <section id="cinema" className="py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium mb-6 md:mb-8">
          Featured Cinema.
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
          {reels.map((reel) => (
            <div
              key={reel.id}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group vignette shadow-md hover:shadow-xl transition-all duration-300"
            >
              <div
                className="absolute inset-0 z-10 opacity-[0.20] pointer-events-none mix-blend-overlay"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
              />
              <video
                src={reel.video}
                className="w-full h-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
                loop
                muted
                playsInline
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => {
                  e.currentTarget.pause()
                  e.currentTarget.currentTime = 0
                }}
              />

              <div className="absolute top-3 left-3 bg-accent text-accent-foreground px-3 py-1.5 rounded-full text-xs font-medium z-20 shadow-sm">
                {reel.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
