"use client"

export function Hero() {
  const scrollToJournal = () => {
    const element = document.getElementById("journal")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="postcard-frame relative min-h-[85vh] flex items-center overflow-hidden p-10 md:p-10 rounded-[26px] mt-6 md:mt-8 mx-6 md:mx-10 mb-10 md:mb-10">
      <div className="absolute inset-0 vignette-soft rounded-[26px] overflow-hidden">
        <div
          className="absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(to right, var(--overlay) 0%, rgba(15,95,91,0.45) 33%, rgba(15,95,91,0.25) 66%, rgba(15,95,91,0.15) 100%), linear-gradient(to bottom, rgba(15,95,91,0.10) 0%, rgba(15,95,91,0.35) 100%)",
          }}
        />
        <div
          className="absolute inset-0 z-[11] opacity-[0.18] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        <img
          src="/golden-hour-city-park-with-dog-silhouette-bokeh.jpg"
          alt="Golden hour in urban park with dog silhouette and bokeh effect"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-6 lg:px-28 py-20 md:py-28 relative z-20">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left side - Main content */}
          <div className="space-y-8">
            <h1
              className="font-serif text-5xl md:text-6xl font-semibold text-white leading-[1.05] tracking-tight text-balance max-w-[14ch]"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}
            >
              Urban Pet Wellness, written together
            </h1>

            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-xl text-pretty">
              An evolving archive of how our dogs anchor us, guide us, and reshape our lives in the city.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={scrollToJournal}
                className="bg-primary hover:bg-[color:var(--teal-900)] text-primary-foreground px-9 py-4 rounded-full font-semibold text-lg transition-all shadow-md hover:shadow-lg focus:ring-2 focus:ring-white/50 focus:outline-none"
              >
                Submit your Sunday →
              </button>

              <div className="bg-accent text-accent-foreground px-5 py-2.5 rounded-full text-sm font-medium shadow-sm border border-primary/15 hover:brightness-[1.02] transition-all">
                <span className="font-semibold">This week:</span> Matcha on us ☕
              </div>
            </div>

            <p className="text-[12px] text-white/75 tracking-[0.18em] uppercase font-light">Forever is built daily.</p>
          </div>

          <div
            className="bg-secondary rounded-2xl p-8 md:p-10 shadow-md relative max-w-[520px] ml-auto -mt-5"
            style={{ backgroundColor: "rgba(239, 230, 215, 0.88)" }}
          >
            <div className="space-y-4">
              <p className="text-lg md:text-xl text-secondary-foreground leading-[1.5] font-serif italic">
                "Every Sunday, we walk the same route. Same trees, same corners. But each time, she notices something
                new—a scent, a sound, a moment I would have missed. She teaches me to be present, to find wonder in
                routine, to build ritual from repetition."
              </p>

              <svg
                className="w-32 h-2 text-primary opacity-30"
                viewBox="0 0 120 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 4C20 2 40 6 60 4C80 2 100 6 118 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>

              <p className="text-sm text-secondary-foreground/70 font-medium">— A reflection on ritual</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
