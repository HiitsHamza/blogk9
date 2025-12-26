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

        // Upload to Supabase Storage - bucket name: "k9media"
        const bucketName = "k9media"
        
        // First, verify the bucket exists by listing buckets
        const { data: buckets, error: listError } = await supabase.storage.listBuckets()
        if (listError) {
          console.error("[v0] Error listing buckets:", listError)
        } else {
          const bucketExists = buckets?.some(b => b.name === bucketName)
          console.log("[v0] Available buckets:", buckets?.map(b => b.name))
          console.log("[v0] Looking for bucket:", bucketName)
          console.log("[v0] Bucket exists:", bucketExists)
          
          if (!bucketExists) {
            return NextResponse.json(
              { 
                error: "Storage bucket not found", 
                details: `The bucket "${bucketName}" does not exist. Available buckets: ${buckets?.map(b => b.name).join(", ") || "none"}. Please create it in Supabase Storage with public access enabled.`,
                bucketName: bucketName,
                availableBuckets: buckets?.map(b => b.name) || []
              },
              { status: 500 }
            )
          }
        }
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, buffer, {
            contentType: photo.type,
            upsert: false,
          })

        if (uploadError) {
          console.error("[v0] Storage upload error:", uploadError)
          console.error("[v0] Upload error details:", {
            message: uploadError.message,
            statusCode: uploadError.statusCode,
            status: uploadError.status
          })
          
          // If bucket doesn't exist, provide helpful error message
          if (uploadError.message?.includes("Bucket not found") || uploadError.statusCode === '404' || uploadError.status === 404) {
            return NextResponse.json(
              { 
                error: "Storage bucket not found", 
                details: `The bucket "${bucketName}" does not exist or is not accessible. Please verify the bucket name matches exactly (including spaces) and that it's public.`,
                bucketName: bucketName
              },
              { status: 500 }
            )
          }
          
          return NextResponse.json(
            { error: "Failed to upload photo", details: uploadError.message },
            { status: 500 }
          )
        }

        // Get public URL
        const { data: urlData } = supabase.storage.from(bucketName).getPublicUrl(filePath)
        photoUrl = urlData.publicUrl
        console.log("[v0] Photo uploaded successfully:", photoUrl)
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
