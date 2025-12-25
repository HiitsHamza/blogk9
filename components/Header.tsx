"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    if (pathname !== "/") {
      router.push(`/?section=${id}`)
    } else {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const section = params.get("section")
    if (section) {
      setTimeout(() => {
        const element = document.getElementById(section)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    }
  }, [pathname])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/85 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 md:px-10 py-3 md:py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-xl md:text-2xl font-semibold text-foreground tracking-tight hover:opacity-80 transition-opacity"
          style={{ fontStyle: 'italic' }}
        >
          Sundayswithmydog
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("cinema")}
            className="text-foreground/70 hover:text-primary transition-colors text-sm font-medium tracking-wide"
          >
            Cinema
          </button>
          <button
            onClick={() => scrollToSection("journal")}
            className="text-foreground/70 hover:text-primary transition-colors text-sm font-medium tracking-wide"
          >
            Journal
          </button>
          <button
            onClick={() => scrollToSection("journal")}
            className="bg-primary hover:bg-primary-dark text-primary-foreground rounded-full px-6 py-2.5 text-sm font-semibold transition-all shadow-sm hover:shadow-md focus:ring-2 focus:ring-primary/30 focus:outline-none"
          >
            SUBMIT
          </button>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => scrollToSection("journal")}
          className="md:hidden text-sm bg-primary text-primary-foreground px-5 py-2 rounded-full font-semibold shadow-sm"
        >
          Submit →
        </button>
      </div>
    </header>
  )
}
