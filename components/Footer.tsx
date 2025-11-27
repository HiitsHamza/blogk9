export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-16 md:py-20 border-t-2 border-secondary/60 bg-gradient-to-b from-transparent to-secondary/10">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center space-y-5">
          <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-foreground font-semibold tracking-wide">
            Your Rituals. Our Archive.
          </p>
          <p className="text-sm md:text-base text-foreground/50 font-medium">
            © {currentYear} Sundays with my dog • A KalmK9 community project
          </p>
        </div>
      </div>
    </footer>
  )
}
