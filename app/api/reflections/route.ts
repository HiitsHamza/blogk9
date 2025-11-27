import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          },
        },
      },
    )

    let email: string
    let neighborhood: string
    let reflection: string
    let photoUrl: string | null = null

    // Check if request contains FormData (file upload)
    const contentType = request.headers.get("content-type") || ""
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData()
      email = formData.get("email") as string
      neighborhood = formData.get("neighborhood") as string
      reflection = formData.get("reflection") as string
      const photo = formData.get("photo") as File | null

      // Upload photo to Supabase Storage if provided
      if (photo && photo.size > 0) {
        const fileExt = photo.name.split(".").pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `reflections/${fileName}`

        // Convert File to ArrayBuffer
        const arrayBuffer = await photo.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Upload to Supabase Storage - bucket name: "for photos and videos"
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("for photos and videos")
          .upload(filePath, buffer, {
            contentType: photo.type,
            upsert: false,
          })

        if (uploadError) {
          console.error("[v0] Storage upload error:", uploadError)
          return NextResponse.json(
            { error: "Failed to upload photo", details: uploadError.message },
            { status: 500 }
          )
        }

        // Get public URL
        const { data: urlData } = supabase.storage.from("for photos and videos").getPublicUrl(filePath)
        photoUrl = urlData.publicUrl
      }
    } else {
      // Handle JSON request
      const body = await request.json()
      email = body.email
      neighborhood = body.neighborhood
      reflection = body.reflection
    }

    // Validate required fields
    if (!email || !neighborhood || !reflection) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert reflection into database
    const { data, error } = await supabase
      .from("reflections")
      .insert([
        {
          email,
          neighborhood,
          reflection,
          photo_url: photoUrl,
        },
      ])
      .select()

    if (error) {
      console.error("[v0] Supabase error:", error)
      return NextResponse.json({ error: "Failed to save reflection", details: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error", details: String(error) }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const neighborhood = searchParams.get("neighborhood")
    const featured = searchParams.get("featured")

    // Create Supabase client
    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    })

    let query = supabase.from("reflections").select("*")

    // Filter by featured if provided (only if column exists)
    if (featured === "true") {
      query = query.eq("featured", true)
    }

    // Filter by neighborhood if provided
    if (neighborhood) {
      query = query.eq("neighborhood", neighborhood)
    }

    // Order by created_at descending and get all results
    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      // If error is about missing featured column, return empty array instead of error
      if (error.message?.includes("column") && error.message?.includes("featured")) {
        console.warn("[v0] Featured column does not exist yet. Please run the database migration.")
        return NextResponse.json({ data: [] })
      }
      console.error("[v0] Supabase error:", error)
      return NextResponse.json({ error: "Failed to fetch reflections" }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
