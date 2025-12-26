export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-16 md:py-20 border-t-2 border-secondary/60 bg-gradient-to-b from-transparent to-secondary/10 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center space-y-5 relative z-10">
          <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-foreground font-semibold tracking-wide italic">
            Your Rituals. Our Archive.
          </p>
          
          <a
            href="https://www.instagram.com/startkalmk9/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-foreground/10 hover:bg-primary hover:scale-110 transition-all duration-300"
            aria-label="Follow us on Instagram"
          >
            <svg
              className="w-5 h-5 text-foreground hover:text-white transition-colors"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          
          <p className="text-sm md:text-base text-foreground/50 font-medium">
            © {currentYear} Sundays with my dog • A KalmK9 community project
          </p>
        </div>
        
        <div className="mt-12 text-center px-2">
          <p 
            className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-primary font-bold tracking-tight italic leading-none break-words"
            aria-hidden="true"
          >
            Sundayswithmydog
          </p>
        </div>
      </div>
    </footer>
  )
}
