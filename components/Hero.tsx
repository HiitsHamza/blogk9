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
        <video
          src="/Banner 4-5.3 NS_480p.mov"
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      <div className="container mx-auto px-6 lg:px-28 py-20 md:py-28 relative z-20">
        <div className="max-w-2xl">
          {/* Main content */}
          <div className="space-y-8">
            <h1
              className="font-serif text-5xl md:text-6xl font-semibold text-white leading-[1.05] tracking-tight text-balance max-w-[14ch]"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}
            >
              A Love letter to our anchors in the city.
            </h1>

            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-xl text-pretty">
              We're two best friends who want to get a dog. So we're asking the city what it truly means to bring one home.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={scrollToJournal}
                className="bg-primary hover:bg-[color:var(--teal-900)] text-primary-foreground px-9 py-4 rounded-full font-semibold text-lg transition-all shadow-md hover:shadow-lg focus:ring-2 focus:ring-white/50 focus:outline-none"
              >
                Submit
              </button>

              <div className="bg-accent text-accent-foreground px-5 py-2.5 rounded-full text-sm font-medium shadow-sm border border-primary/15 hover:brightness-[1.02] transition-all">
                <span className="font-semibold">This week:</span> Matcha on us ☕
              </div>
            </div>

            <p className="text-[12px] text-white/75 tracking-[0.18em] uppercase font-light">Forever is built daily.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
