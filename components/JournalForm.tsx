"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function JournalForm() {
  const [reflection, setReflection] = useState("")
  const [neighborhood, setNeighborhood] = useState("")
  const [email, setEmail] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [website, setWebsite] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const maxLength = 1200
  const charCount = reflection.length
  const wordCount = reflection.trim().split(/\s+/).filter(Boolean).length

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (website) {
      console.log("[v0] Honeypot triggered, blocking spam submission")
      return
    }

    if (!neighborhood || !email) {
      alert("Please fill in all required fields.")
      return
    }

    setIsSubmitting(true)

    try {
      // If there's a photo, use FormData, otherwise use JSON
      let body: FormData | string
      let headers: HeadersInit

      if (photo) {
        const formData = new FormData()
        formData.append("email", email)
        formData.append("neighborhood", neighborhood)
        formData.append("reflection", reflection)
        formData.append("photo", photo)
        body = formData
        // Don't set Content-Type header - browser will set it with boundary
        headers = {}
      } else {
        body = JSON.stringify({
          email,
          neighborhood,
          reflection,
        })
        headers = {
          "Content-Type": "application/json",
        }
      }

      const response = await fetch("/api/reflections", {
        method: "POST",
        headers,
        body,
      })

      const responseData = await response.json()

      if (!response.ok) {
        console.error("[v0] API response error:", responseData)
        throw new Error(responseData.error || "Failed to save reflection")
      }

      console.log("[v0] Reflection saved successfully:", responseData)
      setShowToast(true)
      setReflection("")
      setNeighborhood("")
      setEmail("")
      setPhoto(null)
      // Reset file input
      const fileInput = document.getElementById("photo") as HTMLInputElement
      if (fileInput) fileInput.value = ""

      setTimeout(() => setShowToast(false), 5000)
    } catch (error) {
      console.error("[v0] Error submitting form:", error)
      alert(`Failed to save your reflection: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="journal" className="py-12 md:py-20 bg-gradient-to-b from-transparent via-secondary/20 to-transparent">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-3xl">
        {showToast && (
          <div className="fixed top-6 right-6 z-50 bg-primary text-white px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-top-5 border border-white/20">
            <p className="font-medium">Thanks! In the live site, we'll email if your entry is featured.</p>
          </div>
        )}

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 md:p-12 lg:p-14 shadow-xl border border-secondary/50">
          <div className="space-y-8">
            <div className="space-y-3">
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
                Share your Sunday
              </h2>
              <p className="text-foreground/70 leading-relaxed text-base md:text-lg">
                Tell us about a moment with your dog that anchored you this week.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="reflection" className="block text-sm font-semibold text-foreground">
                  Your reflection
                </label>
                <textarea
                  id="reflection"
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  maxLength={maxLength}
                  rows={8}
                  placeholder="Write about a moment, a feeling, a realization..."
                  className="w-full px-5 py-4 rounded-xl border-2 border-secondary focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none bg-white text-foreground shadow-sm placeholder:text-foreground/40"
                  required
                />
                <div className="flex justify-between text-xs text-foreground/50 font-medium">
                  <span>{wordCount} words</span>
                  <span>
                    {charCount}/{maxLength} characters
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="neighborhood" className="block text-sm font-semibold text-foreground">
                  Neighborhood <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  id="neighborhood"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="e.g., King West, Liberty Village"
                  className="w-full px-5 py-4 rounded-xl border-2 border-secondary focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-white text-foreground shadow-sm placeholder:text-foreground/40"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-foreground">
                  Email <span className="text-primary">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-5 py-4 rounded-xl border-2 border-secondary focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-white text-foreground shadow-sm placeholder:text-foreground/40"
                  required
                />
              </div>

              <input
                type="text"
                name="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="absolute opacity-0 pointer-events-none"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div className="space-y-2">
                <label htmlFor="photo" className="block text-sm font-semibold text-foreground">
                  Photo <span className="text-foreground/60">(optional)</span>
                </label>
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                  className="w-full px-5 py-4 rounded-xl border-2 border-secondary focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-white text-foreground shadow-sm file:mr-4 file:py-2 file:px-5 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-[color:var(--teal-900)] file:cursor-pointer file:transition-colors file:shadow-sm"
                />
              </div>

              <div className="space-y-3 pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-[color:var(--teal-900)] text-primary-foreground py-6 rounded-xl text-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl focus:ring-4 focus:ring-primary/30 motion-safe:hover:scale-[1.02]"
                >
                  {isSubmitting ? "Sending..." : "Send reflection"}
                </Button>
                <p className="text-xs text-foreground/50 text-center leading-relaxed">
                  We'll only use your email to contact you if featured.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
